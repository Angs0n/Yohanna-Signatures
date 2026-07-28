const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// In-memory database (replace with real database for production)
let products = [
  {
    id: 1,
    name: 'Signature Kaftan',
    price: 85000,
    description: 'Handcrafted luxury kaftan featuring intricate embroidery and flowing silhouette.',
    category: 'Featured',
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ivory', 'Champagne', 'Gold'],
    materials: 'Premium Silk Blend',
    care: 'Dry Clean Only',
    quantity: 50,
    createdAt: new Date().toISOString()
  }
];

let orders = [];
let subscribers = [];
let notifications = [];

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Send email notification
async function sendEmailNotification(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Yohanna Signature" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Email error:', error);
  }
}

// ============ PRODUCT ROUTES ============

// Get all products
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...products];
  
  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }
  
  if (search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({ success: true, data: filtered });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// Add product (Admin)
app.post('/api/products', upload.array('images', 5), (req, res) => {
  try {
    const { name, price, description, category, sizes, colors, materials, care, quantity } = req.body;
    
    const imageUrls = req.files 
      ? req.files.map(file => `/uploads/${file.filename}`)
      : JSON.parse(req.body.images || '[]');
    
    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      description,
      category,
      images: imageUrls,
      sizes: JSON.parse(sizes || '["S","M","L"]'),
      colors: JSON.parse(colors || '["Black"]'),
      materials: materials || '',
      care: care || '',
      quantity: parseInt(quantity) || 0,
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    notifications.push({
      id: Date.now().toString(),
      message: `New product "${name}" added`,
      type: 'product',
      read: false,
      createdAt: new Date().toISOString()
    });
    
    res.json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update product (Admin)
app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  products[index] = { ...products[index], ...req.body };
  res.json({ success: true, data: products[index] });
});

// Delete product (Admin)
app.delete('/api/products/:id', (req, res) => {
  products = products.filter(p => p.id !== parseInt(req.params.id));
  res.json({ success: true, message: 'Product deleted' });
});

// ============ ORDER ROUTES ============

// Get all orders
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: orders });
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerInfo, items, total, paymentReference } = req.body;
    
    const order = {
      id: uuidv4(),
      orderNumber: `YOH-${Date.now()}`,
      customerInfo,
      items,
      total,
      paymentReference,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    
    // Add notification
    notifications.push({
      id: Date.now().toString(),
      message: `New order #${order.orderNumber} from ${customerInfo.name}`,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString()
    });
    
    // Send email to admin
    await sendEmailNotification(
      process.env.ADMIN_EMAIL || 'admin@yohannasignature.com',
      `New Order #${order.orderNumber}`,
      `
        <h2>New Order Received</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Customer:</strong> ${customerInfo.name}</p>
        <p><strong>Email:</strong> ${customerInfo.email}</p>
        <p><strong>Phone:</strong> ${customerInfo.phone}</p>
        <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
        <h3>Items:</h3>
        <ul>
          ${items.map(item => `<li>${item.name} x ${item.cartQuantity} - ₦${(item.price * item.cartQuantity).toLocaleString()}</li>`).join('')}
        </ul>
        <p><strong>Shipping Address:</strong></p>
        <p>${customerInfo.address.address}, ${customerInfo.address.city}, ${customerInfo.address.state}</p>
      `
    );
    
    // Send confirmation to customer
    await sendEmailNotification(
      customerInfo.email,
      `Order Confirmed - #${order.orderNumber}`,
      `
        <h2>Thank You for Your Order!</h2>
        <p>Dear ${customerInfo.name},</p>
        <p>Your order has been confirmed and is being processed.</p>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
        <p>We'll notify you when your order ships.</p>
      `
    );
    
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  
  order.status = req.body.status;
  order.updatedAt = new Date().toISOString();
  
  res.json({ success: true, data: order });
});

// ============ NEWSLETTER ROUTES ============

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (subscribers.includes(email)) {
      return res.json({ success: true, message: 'Already subscribed' });
    }
    
    subscribers.push(email);
    
    // Send welcome email
    await sendEmailNotification(
      email,
      'Welcome to Yohanna Signature',
      `
        <h2>Welcome to Yohanna Signature!</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You'll be the first to know about new collections and exclusive offers.</p>
      `
    );
    
    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ CONTACT ROUTES ============

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    await sendEmailNotification(
      process.env.ADMIN_EMAIL || 'admin@yohannasignature.com',
      `Contact Form: ${subject}`,
      `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    );
    
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ NOTIFICATION ROUTES ============

app.get('/api/notifications', (req, res) => {
  res.json({ success: true, data: notifications });
});

app.put('/api/notifications/:id/read', (req, res) => {
  const notification = notifications.find(n => n.id === req.params.id);
  if (notification) {
    notification.read = true;
  }
  res.json({ success: true });
});

// ============ UPLOAD ROUTE ============

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({ 
    success: true, 
    url: `/uploads/${req.file.filename}` 
  });
});

// Serve static files from Next.js in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', '.next')));
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});