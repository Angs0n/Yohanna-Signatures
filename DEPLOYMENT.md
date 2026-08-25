# Free deployment guide

This project can start on free tiers: Vercel hosts the Next.js storefront, Render hosts the Express API, and Supabase stores data. Render's free service sleeps after 15 minutes without traffic, and Vercel Hobby is limited to personal/non-commercial use, so upgrade before relying on this for a busy business.

## 1. Create Supabase

1. Create a free project at Supabase and open **SQL Editor**.
2. Run [`supabase/schema.sql`](supabase/schema.sql).
3. In **Project Settings > API**, copy the project URL and **service_role** key. The service-role key belongs only in Render; never put it in the frontend.
4. Create the owner account under **Authentication > Users**, then run the commented admin command at the bottom of the SQL schema with that user's UUID.

## 2. Create Paystack test keys

Use the Paystack dashboard's test keys while testing. Add `PAYSTACK_SECRET_KEY` to Render. Add the public key only as `NEXT_PUBLIC_PAYSTACK_KEY` in Vercel if the frontend later uses Paystack's popup; this backend uses server-side payment initialization and never exposes the secret key.

## 3. Deploy the API to Render

1. In Render, select **New > Blueprint** and select this GitHub repository.
2. Render reads `render.yaml`. Choose the Free instance type and provide the variables shown in [`server/.env.example`](server/.env.example).
3. Set `WEB_URL` to the final Vercel URL and `CORS_ORIGIN` to that same URL. Keep `PORT` unset on Render.
4. After deployment, copy the API URL, for example `https://yohanna-signature-api.onrender.com`.

## 4. Deploy the storefront to Vercel

1. Import the GitHub repository in Vercel as a Next.js project with the repository root as its root directory.
2. Add `NEXT_PUBLIC_API_URL` with the Render API URL (no trailing slash).
3. Deploy. Then put the resulting Vercel URL into Render's `WEB_URL` and `CORS_ORIGIN` and redeploy the API once.

## Before accepting real payments

- Add real products to Supabase, including valid image URLs and stock quantities.
- Switch to Paystack live keys only after you have tested the full checkout flow.
- Add a Paystack webhook endpoint and verify its signature before shipping at scale.
- Replace the free services when you need always-on uptime, backups, or a commercial Vercel license.
