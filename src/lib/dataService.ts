import {CHURCH_IMAGES} from '../data/assets';
import {isSupabaseConfigured, supabase} from './supabase';
import type {
  Announcement,
  ChurchEvent,
  DonationFund,
  DonationRecord,
  Leader,
  Ministry,
  NewsPost,
  PrayerRequest,
  PublicChurchBundle,
  Sermon,
  SiteSettings,
  SmallGroup,
  Testimony,
} from '../types/church';

const OFFLINE_CACHE_KEY = 'pefa_kenyatta_offline_bundle_v1';

function resolvePhotoUrl<T extends {photo_url?: string; image_url?: string; cover_image_url?: string; photo_key?: string}>(
  item: T
): T {
  const key = item.photo_key as keyof typeof CHURCH_IMAGES | undefined;
  const fallbackAsset = key && CHURCH_IMAGES[key] ? CHURCH_IMAGES[key] : undefined;
  if (!fallbackAsset) return item;
  return {
    ...item,
    photo_url: item.photo_url || fallbackAsset,
    image_url: item.image_url || fallbackAsset,
    cover_image_url: item.cover_image_url || fallbackAsset,
  };
}

function hydrateBundle(bundle: PublicChurchBundle): PublicChurchBundle {
  return {
    ...bundle,
    leaders: bundle.leaders.map((l) => resolvePhotoUrl(l as Leader & {photo_key?: string})),
    events: bundle.events.map((e) => resolvePhotoUrl(e as ChurchEvent & {photo_key?: string})),
    posts: bundle.posts.map((p) => resolvePhotoUrl(p as NewsPost & {photo_key?: string})),
    ministries: bundle.ministries.map((m) => resolvePhotoUrl(m as Ministry & {photo_key?: string})),
  };
}

export async function fetchPublicChurchData(): Promise<PublicChurchBundle> {
  try {
    if (isSupabaseConfigured && supabase) {
      const [
        settingsRes,
        sermonsRes,
        eventsRes,
        announcementsRes,
        postsRes,
        leadersRes,
        ministriesRes,
        groupsRes,
        testimoniesRes,
      ] = await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle(),
        supabase.from('sermons').select('*').eq('published', true).order('sermon_date', {ascending: false}),
        supabase.from('events').select('*').eq('published', true).order('start_at', {ascending: true}),
        supabase.from('announcements').select('*').eq('published', true).order('created_at', {ascending: false}),
        supabase.from('posts').select('*').eq('published', true).order('published_at', {ascending: false}),
        supabase.from('leaders').select('*').eq('published', true).order('display_order', {ascending: true}),
        supabase.from('ministries').select('*').eq('published', true),
        supabase.from('small_groups').select('*').eq('published', true),
        supabase.from('testimonies').select('*').eq('status', 'approved').order('created_at', {ascending: false}),
      ]);

      if (!sermonsRes.error && settingsRes.data) {
        const bundle: PublicChurchBundle = hydrateBundle({
          settings: settingsRes.data as SiteSettings,
          sermons: (sermonsRes.data || []) as Sermon[],
          events: (eventsRes.data || []) as ChurchEvent[],
          announcements: (announcementsRes.data || []) as Announcement[],
          posts: (postsRes.data || []) as NewsPost[],
          leaders: (leadersRes.data || []) as Leader[],
          ministries: (ministriesRes.data || []) as Ministry[],
          smallGroups: (groupsRes.data || []) as SmallGroup[],
          testimonies: (testimoniesRes.data || []) as Testimony[],
        });
        localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(bundle));
        return bundle;
      }
    }

    const res = await fetch('/api/church/public');
    if (!res.ok) throw new Error('Failed to load church data.');
    const raw = (await res.json()) as PublicChurchBundle;
    const bundle = hydrateBundle(raw);
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(bundle));
    return bundle;
  } catch (err) {
    const cached = localStorage.getItem(OFFLINE_CACHE_KEY);
    if (cached) {
      return hydrateBundle(JSON.parse(cached) as PublicChurchBundle);
    }
    throw err;
  }
}

export async function submitVisitorPlan(payload: {
  full_name: string;
  phone: string;
  email?: string;
  preferred_date: string;
  preferred_service: string;
  guests_count: number;
  notes?: string;
  consent_given: boolean;
}) {
  if (isSupabaseConfigured && supabase) {
    const {error} = await supabase.from('visitors').insert(payload);
    if (!error) return {ok: true};
  }
  const res = await fetch('/api/church/visitors', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as {error?: string; ok?: boolean};
  if (!res.ok) throw new Error(data.error || 'Could not submit visit plan.');
  return data;
}

export async function submitEventRsvp(payload: {
  event_id: string;
  full_name: string;
  phone: string;
  guests: number;
  consent_given: boolean;
}) {
  if (isSupabaseConfigured && supabase) {
    const {error} = await supabase.from('event_rsvps').insert(payload);
    if (!error) return {ok: true};
  }
  const res = await fetch('/api/church/rsvps', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as {error?: string; ok?: boolean};
  if (!res.ok) throw new Error(data.error || 'Could not submit RSVP.');
  return data;
}

export async function submitMinistrySignup(payload: {
  ministry_id?: string;
  ministry_name: string;
  full_name: string;
  phone: string;
  email?: string;
  notes?: string;
  consent_given: boolean;
}) {
  if (isSupabaseConfigured && supabase) {
    const {error} = await supabase.from('ministry_signups').insert(payload);
    if (!error) return {ok: true};
  }
  const res = await fetch('/api/church/ministry-signups', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as {error?: string; ok?: boolean};
  if (!res.ok) throw new Error(data.error || 'Could not submit ministry request.');
  return data;
}

export async function submitPrayerOrCounselling(payload: {
  request_type: 'prayer' | 'counselling';
  full_name?: string;
  phone?: string;
  request_text: string;
  pastors_only: boolean;
  preferred_callback_time?: string;
  consent_given: boolean;
}) {
  if (isSupabaseConfigured && supabase) {
    const {error} = await supabase.from('prayer_requests').insert(payload);
    if (!error) return {ok: true};
  }
  const res = await fetch('/api/church/prayer', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as {error?: string; ok?: boolean};
  if (!res.ok) throw new Error(data.error || 'Could not send request.');
  return data;
}

export async function submitTestimony(payload: {
  author_name: string;
  phone?: string;
  title: string;
  story: string;
  consent_given: boolean;
}) {
  if (isSupabaseConfigured && supabase) {
    const {error} = await supabase.from('testimonies').insert({...payload, status: 'pending'});
    if (!error) return {ok: true};
  }
  const res = await fetch('/api/church/testimonies', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as {error?: string; ok?: boolean};
  if (!res.ok) throw new Error(data.error || 'Could not submit testimony.');
  return data;
}

export async function initiateMpesaStkPush(payload: {
  phone: string;
  amount: number;
  fund: DonationFund;
  donorName?: string;
  consentGiven: boolean;
  userId?: string | null;
}) {
  const res = await fetch('/api/mpesa/stkpush', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    mode?: string;
    checkoutRequestId?: string;
    customerMessage?: string;
    record?: DonationRecord;
    error?: string;
  };
  if (!res.ok) throw new Error(data.error || 'M-Pesa STK Push failed.');
  return data;
}

export async function pollMpesaStatus(checkoutRequestId: string): Promise<DonationRecord> {
  const res = await fetch(`/api/mpesa/status/${encodeURIComponent(checkoutRequestId)}`);
  const data = (await res.json()) as {record?: DonationRecord; error?: string};
  if (!res.ok || !data.record) throw new Error(data.error || 'Transaction lookup failed.');
  return data.record;
}

export async function fetchMemberDonations(phone: string): Promise<DonationRecord[]> {
  if (!phone) return [];
  if (isSupabaseConfigured && supabase) {
    const {data} = await supabase.from('donations').select('*').order('created_at', {ascending: false});
    if (data) return data as DonationRecord[];
  }
  const res = await fetch(`/api/mpesa/my-donations?phone=${encodeURIComponent(phone)}`);
  const json = (await res.json()) as {donations?: DonationRecord[]};
  return json.donations || [];
}

export async function verifyAdminPasscode(passcode: string): Promise<boolean> {
  const res = await fetch('/api/auth/verify-admin', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({passcode}),
  });
  return res.ok;
}

export async function fetchAdminBundle(passcode: string) {
  const res = await fetch('/api/church/admin/bundle', {
    headers: {'x-admin-passcode': passcode, 'x-user-role': 'admin'},
  });
  if (!res.ok) throw new Error('Admin authorization failed.');
  return res.json() as Promise<{
    settings: SiteSettings;
    sermons: Sermon[];
    events: ChurchEvent[];
    announcements: Announcement[];
    posts: NewsPost[];
    leaders: Leader[];
    ministries: Ministry[];
    smallGroups: SmallGroup[];
    testimonies: Testimony[];
    visitors: Array<Record<string, unknown>>;
    prayerRequests: PrayerRequest[];
    ministrySignups: Array<Record<string, unknown>>;
    donations: DonationRecord[];
    profiles: Array<Record<string, unknown>>;
  }>;
}

export async function adminUpdateSettings(passcode: string, settings: Partial<SiteSettings>) {
  const res = await fetch('/api/church/admin/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-passcode': passcode,
      'x-user-role': 'admin',
    },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Could not update site settings.');
  return res.json();
}

export async function adminCreateItem(passcode: string, collection: string, payload: Record<string, unknown>) {
  const res = await fetch(`/api/church/admin/${collection}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-passcode': passcode,
      'x-user-role': 'admin',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Could not create ${collection} record.`);
  return res.json();
}

export async function adminUpdateItem(
  passcode: string,
  collection: string,
  id: string,
  payload: Record<string, unknown>
) {
  const res = await fetch(`/api/church/admin/${collection}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-passcode': passcode,
      'x-user-role': 'admin',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Could not update ${collection} record.`);
  return res.json();
}

export async function adminDeleteItem(passcode: string, collection: string, id: string) {
  const res = await fetch(`/api/church/admin/${collection}/${id}`, {
    method: 'DELETE',
    headers: {'x-admin-passcode': passcode, 'x-user-role': 'admin'},
  });
  if (!res.ok) throw new Error(`Could not delete ${collection} record.`);
  return res.json();
}

export async function uploadResizedImage(passcode: string, blob: Blob, dataUrl: string, filename: string): Promise<string> {
  const isWebp = blob.type === 'image/webp' || dataUrl.startsWith('data:image/webp');
  const ext = isWebp ? 'webp' : 'jpg';
  const contentType = isWebp ? 'image/webp' : 'image/jpeg';

  if (isSupabaseConfigured && supabase) {
    const filePath = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '')}.${ext}`;
    const {error} = await supabase.storage.from('church-media').upload(filePath, blob, {
      contentType,
      upsert: false,
    });
    if (!error) {
      const {data} = supabase.storage.from('church-media').getPublicUrl(filePath);
      return data.publicUrl;
    }
  }
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-passcode': passcode,
      'x-user-role': 'admin',
    },
    body: JSON.stringify({dataUrl, filename}),
  });
  const json = (await res.json()) as {url?: string; error?: string};
  if (!res.ok || !json.url) throw new Error(json.error || 'Upload failed.');
  return json.url;
}
