-- ==============================================================================
-- PEFA Church, Kenyatta Branch - Supabase PostgreSQL Schema & RLS Policies
-- Run this script in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- 1. PROFILES (extends auth.users for Member Portal & RBAC)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  role text not null default 'member' check (role in ('visitor', 'member', 'ministry_leader', 'admin')),
  small_group_id uuid,
  sms_opt_in boolean not null default true,
  whatsapp_opt_in boolean not null default true,
  saved_sermon_ids uuid[] not null default '{}',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. SITE SETTINGS (Live Service Banner, Daily Verse, Church Metadata)
create table if not exists public.site_settings (
  id text primary key default 'main',
  is_live boolean not null default false,
  live_title text default 'Sunday Worship Service — Live from Kenyatta Sanctuary',
  live_url text default 'https://www.youtube.com/@pefakenyatta',
  daily_verse_ref text not null default 'Jeremiah 29:11',
  daily_verse_text text not null default '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
  daily_verse_sw text not null default '"Maana nayajua mawazo ninayowawazia ninyi," asema Bwana, "ni mawazo ya amani wala si ya mabaya, kuwapa ninyi tumaini siku zenu za mwisho."',
  daily_devotional text not null default 'Walk into this week anchored in God''s faithfulness. What feels uncertain to us is already steady in His hands.',
  updated_at timestamptz not null default now()
);

-- 3. SERMONS
create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_sw text,
  preacher text not null,
  sermon_date date not null default current_date,
  series text not null default 'Sunday Teaching',
  scripture text not null,
  summary text not null,
  youtube_url text,
  audio_url text,
  notes_url text,
  duration text default '42 min',
  thumbnail_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4. EVENTS
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_sw text,
  category text not null default 'Fellowship',
  start_at timestamptz not null,
  end_at timestamptz not null,
  location text not null default 'PEFA Kenyatta Main Sanctuary',
  description text not null,
  image_url text,
  rsvp_enabled boolean not null default true,
  rsvp_count integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Event RSVPs
create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  full_name text not null,
  phone text not null,
  guests integer not null default 1,
  consent_given boolean not null default true,
  created_at timestamptz not null default now()
);

-- 5. ANNOUNCEMENTS
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_sw text,
  body text not null,
  body_sw text,
  event_date text,
  priority text not null default 'normal' check (priority in ('normal', 'important')),
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 6. NEWS / BLOG POSTS
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  excerpt text not null,
  content text not null,
  author text not null default 'PEFA Kenyatta Communications',
  cover_image_url text,
  published_at date not null default current_date,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 7. LEADERS
create table if not exists public.leaders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null,
  role_title_sw text,
  bio text not null,
  photo_url text,
  display_order integer not null default 1,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 8. MINISTRIES
create table if not exists public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_sw text,
  category text not null,
  leader_name text not null,
  meeting_time text not null,
  description text not null,
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 9. MINISTRY SIGNUPS
create table if not exists public.ministry_signups (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid references public.ministries(id) on delete set null,
  ministry_name text not null,
  full_name text not null,
  phone text not null,
  email text,
  notes text,
  consent_given boolean not null default true,
  created_at timestamptz not null default now()
);

-- 10. SMALL GROUPS / CELL GROUPS
create table if not exists public.small_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null,
  meeting_day text not null,
  meeting_time text not null,
  host_name text not null,
  contact_phone text not null,
  description text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 11. VISITORS ("Plan My Visit")
create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  preferred_date date not null,
  preferred_service text not null default '10:30 AM Main Family Service',
  guests_count integer not null default 1,
  notes text,
  consent_given boolean not null default true,
  followed_up boolean not null default false,
  created_at timestamptz not null default now()
);

-- 12. PRAYER & COUNSELLING REQUESTS
create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null default 'prayer' check (request_type in ('prayer', 'counselling')),
  full_name text,
  phone text,
  request_text text not null,
  pastors_only boolean not null default true,
  preferred_callback_time text,
  consent_given boolean not null default true,
  status text not null default 'new' check (status in ('new', 'prayed', 'scheduled', 'closed')),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 13. TESTIMONIES
create table if not exists public.testimonies (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  phone text,
  title text not null,
  story text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  consent_given boolean not null default true,
  created_at timestamptz not null default now()
);

-- 14. DONATIONS (M-Pesa STK Push & Paybill Logs)
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  donor_name text,
  phone text not null,
  amount numeric(12, 2) not null check (amount > 0),
  fund text not null default 'Tithe' check (fund in ('Tithe', 'Offering', 'Building Fund', 'Missions', 'Welfare', 'Other')),
  merchant_request_id text,
  checkout_request_id text unique,
  mpesa_receipt_number text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'cancelled')),
  result_desc text,
  consent_given boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- HELPER FUNCTION: CHECK ADMIN ROLE
-- ==============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.sermons enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.announcements enable row level security;
alter table public.posts enable row level security;
alter table public.leaders enable row level security;
alter table public.ministries enable row level security;
alter table public.ministry_signups enable row level security;
alter table public.small_groups enable row level security;
alter table public.visitors enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.testimonies enable row level security;
alter table public.donations enable row level security;

-- PUBLIC READ POLICIES (Published content only)
create policy "Public read site_settings" on public.site_settings for select using (true);
create policy "Public read published sermons" on public.sermons for select using (published = true or public.is_admin());
create policy "Public read published events" on public.events for select using (published = true or public.is_admin());
create policy "Public read published announcements" on public.announcements for select using (published = true or public.is_admin());
create policy "Public read published posts" on public.posts for select using (published = true or public.is_admin());
create policy "Public read published leaders" on public.leaders for select using (published = true or public.is_admin());
create policy "Public read published ministries" on public.ministries for select using (published = true or public.is_admin());
create policy "Public read published small_groups" on public.small_groups for select using (published = true or public.is_admin());
create policy "Public read approved testimonies" on public.testimonies for select using (status = 'approved' or public.is_admin());

-- PUBLIC INSERT POLICIES (Forms with Kenya Data Protection consent)
create policy "Anyone can submit visitor plan" on public.visitors for insert with check (consent_given = true);
create policy "Anyone can submit event RSVP" on public.event_rsvps for insert with check (consent_given = true);
create policy "Anyone can submit ministry signup" on public.ministry_signups for insert with check (consent_given = true);
create policy "Anyone can submit prayer request" on public.prayer_requests for insert with check (consent_given = true);
create policy "Anyone can submit testimony" on public.testimonies for insert with check (consent_given = true and status = 'pending');
create policy "Authenticated or anon can initiate donation" on public.donations for insert with check (consent_given = true);

-- PRIVATE READ POLICIES (Strict Privacy: Admins & Owners only)
create policy "Users view own profile or admin" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Prayer requests visible to admin or requester" on public.prayer_requests
  for select using (public.is_admin() or (auth.uid() is not null and auth.uid() = user_id));

create policy "Donations visible to admin or donor" on public.donations
  for select using (public.is_admin() or (auth.uid() is not null and auth.uid() = user_id));

create policy "Visitors visible to admins only" on public.visitors for select using (public.is_admin());
create policy "Ministry signups visible to admins only" on public.ministry_signups for select using (public.is_admin());
create policy "Event RSVPs visible to admins only" on public.event_rsvps for select using (public.is_admin());

-- ADMIN WRITE POLICIES
create policy "Admins manage site_settings" on public.site_settings for all using (public.is_admin());
create policy "Admins manage sermons" on public.sermons for all using (public.is_admin());
create policy "Admins manage events" on public.events for all using (public.is_admin());
create policy "Admins manage announcements" on public.announcements for all using (public.is_admin());
create policy "Admins manage posts" on public.posts for all using (public.is_admin());
create policy "Admins manage leaders" on public.leaders for all using (public.is_admin());
create policy "Admins manage ministries" on public.ministries for all using (public.is_admin());
create policy "Admins manage small_groups" on public.small_groups for all using (public.is_admin());
create policy "Admins manage testimonies" on public.testimonies for all using (public.is_admin());
create policy "Admins manage visitors" on public.visitors for all using (public.is_admin());
create policy "Admins manage prayer_requests" on public.prayer_requests for all using (public.is_admin());
create policy "Admins manage ministry_signups" on public.ministry_signups for all using (public.is_admin());
create policy "Admins manage donations" on public.donations for all using (public.is_admin());

-- ==============================================================================
-- SUPABASE STORAGE BUCKET FOR CHURCH MEDIA
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('church-media', 'church-media', true)
on conflict (id) do nothing;

create policy "Public read church media" on storage.objects
  for select using (bucket_id = 'church-media');

create policy "Admins upload church media" on storage.objects
  for insert with check (bucket_id = 'church-media' and public.is_admin());

create policy "Admins delete church media" on storage.objects
  for delete using (bucket_id = 'church-media' and public.is_admin());
