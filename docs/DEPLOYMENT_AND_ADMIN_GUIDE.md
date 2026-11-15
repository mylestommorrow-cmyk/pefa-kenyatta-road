# PEFA Church, Kenyatta Branch — Deployment & Staff Admin Guide

## Part 1: Step-by-Step Free Hosting Deployment Guide

### 1. Set Up Supabase (Free Tier)
1. Create a free account at **supabase.com** and create a new project (choose a close region such as `eu-west-1` or `af-south-1`).
2. Open **SQL Editor -> New Query**, paste the contents of `supabase/schema.sql`, and click **Run**.
3. Run `supabase/seed.sql` in a second query to populate sample sermons, events, leaders, ministries, and cell groups.
4. Go to **Authentication -> Providers**, enable **Email** (and Phone/SMS if desired).
5. Create your first Admin user in **Authentication -> Users**, then run:
   ```sql
   update public.profiles set role = 'admin' where email = 'pastor@pefakenyatta.org';
   ```
6. Copy `Project URL`, `anon public key`, and `service_role key` from **Settings -> API**.

### 2. Set Up Safaricom M-Pesa Daraja
1. Log in to **developer.safaricom.co.ke** and create an app with **Lipa Na M-Pesa Online (STK Push)**.
2. Copy your **Consumer Key**, **Consumer Secret**, **Business Shortcode (Paybill/Till)**, and **Lipa Na M-Pesa Passkey**.
3. Set `MPESA_CALLBACK_URL` to `https://your-live-domain.com/api/mpesa/callback`.
4. Test first with `MPESA_ENV=sandbox`, then switch to `MPESA_ENV=production` once Safaricom approves Go-Live.

### 3. Deploy on Vercel / Netlify / Cloudflare Pages
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Server functions**: Use `api/mpesa-stk-push.ts` and `api/mpesa-callback.ts` (Vercel automatically turns files in `/api` into serverless endpoints), OR deploy the Express `server.ts` on Render / Railway / Fly.io free tier.
- Add all environment variables listed in `.env.example` into your hosting provider's **Environment Variables** dashboard (never commit `.env` to Git).

---

## Part 2: Non-Technical Admin User Guide (For Church Staff)

### Logging In
1. Tap **Admin** in the navigation drawer (or footer).
2. Sign in with your church admin email/password (or the church staff passcode during setup).

### Turning On the "We Are Live" Banner on Sundays
1. Open **Admin -> Live & Devotional**.
2. Paste Sunday's YouTube or Facebook Live link.
3. Switch **We're Live Now** ON and click **Save Settings**. Visitors immediately see a live watch banner at the top of the home page. Turn it OFF after service.

### Adding a Sunday Sermon
1. Open **Admin -> Sermons**.
2. Enter the sermon title, preacher name, scripture, series, and YouTube link (plus optional PDF notes link).
3. Click **Publish Sermon** — it appears immediately on the Home and Sermons pages.

### Approving Member Testimonies
1. Open **Admin -> Testimonies**.
2. Read new submissions marked **Pending**.
3. Click **Approve** to publish on the Testimonies page, or **Reject** to keep private.

### Exporting Visitor & Giving Reports
1. Open **Admin -> Visitors, Prayer & Giving**.
2. Filter donations by Fund (Tithe, Offering, Building Fund, Missions) or date.
3. Click **Download CSV** to open in Excel / Google Sheets for church treasury records.
4. Use **Export WhatsApp / SMS Contacts** to get a clean list of opted-in `+254` phone numbers for weekly announcements.
