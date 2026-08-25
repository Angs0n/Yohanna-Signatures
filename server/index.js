require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const { z } = require('zod');

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);

const app = express();
const port = Number(process.env.PORT || 3001);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map((origin) => origin.trim());

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('Origin is not allowed by CORS'));
}, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  price: z.coerce.number().positive(),
  description: z.string().trim().min(10).max(3000),
  category: z.string().trim().min(2).max(60),
  images: z.array(z.string().url()).min(1).max(5),
  sizes: z.array(z.string().trim().min(1).max(20)).min(1).max(20),
  colors: z.array(z.string().trim().min(1).max(40)).min(1).max(20),
  materials: z.string().trim().max(200).default(''),
  care: z.string().trim().max(200).default(''),
  quantity: z.coerce.number().int().min(0).max(100000),
});
const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(120), email: z.string().email().max(255), phone: z.string().trim().min(5).max(40),
    country: z.string().trim().min(2).max(80), state: z.string().trim().min(2).max(80), city: z.string().trim().min(2).max(80), address: z.string().trim().min(5).max(300),
  }),
  items: z.array(z.object({ id: z.coerce.number().int().positive(), quantity: z.coerce.number().int().min(1).max(20) })).min(1).max(20),
});

function parse(schema, value, res) {
  const result = schema.safeParse(value);
  if (!result.success) { res.status(400).json({ success: false, message: 'Invalid request', errors: result.error.flatten() }); return null; }
  return result.data;
}
function failure(res, error, message = 'Unexpected server error') {
  console.error(error);
  res.status(500).json({ success: false, message });
}
async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ success: false, message: 'Invalid session' });
  const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profileError || profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
  req.user = user;
  next();
}

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/api/products', async (req, res) => {
  try {
    let query = supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });
    if (req.query.category && req.query.category !== 'All') query = query.eq('category', req.query.category);
    if (req.query.search) query = query.ilike('name', `%${String(req.query.search).trim()}%`);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) { failure(res, error); }
});

app.get('/api/products/:id', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).eq('is_active', true).single();
  if (error || !data) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data });
});

app.post('/api/products', requireAdmin, async (req, res) => {
  const product = parse(productSchema, req.body, res); if (!product) return;
  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) return failure(res, error, 'Could not create product');
  res.status(201).json({ success: true, data });
});
app.put('/api/products/:id', requireAdmin, async (req, res) => {
  const product = parse(productSchema.partial(), req.body, res); if (!product) return;
  const { data, error } = await supabase.from('products').update(product).eq('id', req.params.id).select().single();
  if (error || !data) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data });
});
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('products').update({ is_active: false }).eq('id', req.params.id);
  if (error) return failure(res, error, 'Could not delete product');
  res.status(204).end();
});

app.post('/api/checkout/initialize', async (req, res) => {
  const checkout = parse(checkoutSchema, req.body, res); if (!checkout) return;
  if (!process.env.PAYSTACK_SECRET_KEY) return res.status(503).json({ success: false, message: 'Payments are not configured yet' });
  try {
    const ids = checkout.items.map((item) => item.id);
    const { data: products, error } = await supabase.from('products').select('id,name,price,quantity').in('id', ids).eq('is_active', true);
    if (error) throw error;
    if (!products || products.length !== ids.length) return res.status(400).json({ success: false, message: 'One or more products are unavailable' });
    const items = checkout.items.map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product || product.quantity < item.quantity) throw new Error(`Insufficient stock for product ${item.id}`);
      return { product_id: product.id, name: product.name, unit_price: product.price, quantity: item.quantity, line_total: product.price * item.quantity };
    });
    const total = items.reduce((sum, item) => sum + item.line_total, 0);
    const reference = `YOH-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const { data: order, error: orderError } = await supabase.from('orders').insert({ reference, customer: checkout.customer, items, total, currency: 'NGN', status: 'pending', payment_status: 'pending' }).select().single();
    if (orderError) throw orderError;
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: checkout.customer.email, amount: Math.round(total * 100), currency: 'NGN', reference, callback_url: `${process.env.WEB_URL}/payment/callback` }),
    });
    const payment = await paystackResponse.json();
    if (!paystackResponse.ok || !payment.status) throw new Error(payment.message || 'Paystack initialization failed');
    res.status(201).json({ success: true, data: { orderId: order.id, reference, authorizationUrl: payment.data.authorization_url } });
  } catch (error) { failure(res, error, error.message || 'Could not start payment'); }
});

app.get('/api/payments/verify/:reference', async (req, res) => {
  if (!process.env.PAYSTACK_SECRET_KEY) return res.status(503).json({ success: false, message: 'Payments are not configured yet' });
  try {
    const { data: expectedOrder, error: orderLookupError } = await supabase.from('orders').select('id,total').eq('reference', req.params.reference).single();
    if (orderLookupError || !expectedOrder) return res.status(404).json({ success: false, message: 'Order not found' });
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(req.params.reference)}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });
    const payment = await paystackResponse.json();
    if (!paystackResponse.ok || !payment.status) return res.status(400).json({ success: false, message: payment.message || 'Payment could not be verified' });
    const paid = payment.data.status === 'success';
    if (paid && (payment.data.currency !== 'NGN' || payment.data.amount !== Math.round(Number(expectedOrder.total) * 100))) {
      return res.status(400).json({ success: false, message: 'Payment amount does not match the order' });
    }
    const { data: order, error } = await supabase.from('orders').update({ payment_status: paid ? 'paid' : 'failed', status: paid ? 'processing' : 'payment_failed', paid_at: paid ? new Date().toISOString() : null }).eq('reference', req.params.reference).select().single();
    if (error || !order) throw error || new Error('Order not found');
    res.json({ success: true, data: { order, paid } });
  } catch (error) { failure(res, error, 'Could not verify payment'); }
});

app.post('/api/subscribe', async (req, res) => {
  const email = z.string().email().safeParse(req.body?.email);
  if (!email.success) return res.status(400).json({ success: false, message: 'A valid email is required' });
  const { error } = await supabase.from('subscribers').upsert({ email: email.data }, { onConflict: 'email', ignoreDuplicates: true });
  if (error) return failure(res, error, 'Could not subscribe');
  res.status(201).json({ success: true, message: 'Subscribed successfully' });
});
app.post('/api/contact', async (req, res) => {
  const contact = z.object({ name: z.string().trim().min(2).max(120), email: z.string().email(), subject: z.string().trim().min(2).max(180), message: z.string().trim().min(5).max(5000) }).safeParse(req.body);
  if (!contact.success) return res.status(400).json({ success: false, message: 'Please complete every contact field' });
  const { error } = await supabase.from('contact_messages').insert(contact.data);
  if (error) return failure(res, error, 'Could not send message');
  res.status(201).json({ success: true, message: 'Message received' });
});

app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ success: false, message: 'Unexpected server error' }); });
app.listen(port, '0.0.0.0', () => console.log(`Yohanna API listening on ${port}`));
