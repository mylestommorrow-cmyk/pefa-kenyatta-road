export type Language = 'en' | 'sw';

export type PageRoute =
  | 'home'
  | 'visit'
  | 'about'
  | 'ministries'
  | 'sermons'
  | 'events'
  | 'groups'
  | 'give'
  | 'prayer'
  | 'testimonies'
  | 'news'
  | 'contact'
  | 'member'
  | 'admin'
  | 'privacy';

export type UserRole = 'visitor' | 'member' | 'ministry_leader' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  role: UserRole;
  small_group_id?: string | null;
  sms_opt_in: boolean;
  whatsapp_opt_in: boolean;
  saved_sermon_ids: string[];
  created_at: string;
}

export interface SiteSettings {
  id: string;
  is_live: boolean;
  live_title: string;
  live_url: string;
  daily_verse_ref: string;
  daily_verse_text: string;
  daily_verse_sw: string;
  daily_devotional: string;
  updated_at: string;
}

export interface Sermon {
  id: string;
  title: string;
  title_sw?: string;
  preacher: string;
  sermon_date: string;
  series: string;
  scripture: string;
  summary: string;
  youtube_url?: string;
  audio_url?: string;
  notes_url?: string;
  duration?: string;
  thumbnail_url?: string;
  published: boolean;
  created_at: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  title_sw?: string;
  category: string;
  start_at: string;
  end_at: string;
  location: string;
  description: string;
  image_url?: string;
  rsvp_enabled: boolean;
  rsvp_count: number;
  published: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  title_sw?: string;
  body: string;
  body_sw?: string;
  event_date?: string;
  priority: 'normal' | 'important';
  published: boolean;
  created_at: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  author: string;
  cover_image_url?: string;
  published_at: string;
  published: boolean;
  created_at: string;
}

export interface Leader {
  id: string;
  full_name: string;
  role_title: string;
  role_title_sw?: string;
  bio: string;
  photo_url?: string;
  display_order: number;
  published: boolean;
}

export interface Ministry {
  id: string;
  name: string;
  name_sw?: string;
  category: string;
  leader_name: string;
  meeting_time: string;
  description: string;
  image_url?: string;
  published: boolean;
}

export interface SmallGroup {
  id: string;
  name: string;
  area: string;
  meeting_day: string;
  meeting_time: string;
  host_name: string;
  contact_phone: string;
  description?: string;
  published: boolean;
}

export interface VisitorSubmission {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  preferred_date: string;
  preferred_service: string;
  guests_count: number;
  notes?: string;
  consent_given: boolean;
  followed_up: boolean;
  created_at: string;
}

export interface PrayerRequest {
  id: string;
  request_type: 'prayer' | 'counselling';
  full_name?: string;
  phone?: string;
  request_text: string;
  pastors_only: boolean;
  preferred_callback_time?: string;
  consent_given: boolean;
  status: 'new' | 'prayed' | 'scheduled' | 'closed';
  user_id?: string | null;
  created_at: string;
}

export interface Testimony {
  id: string;
  author_name: string;
  phone?: string;
  title: string;
  story: string;
  status: 'pending' | 'approved' | 'rejected';
  consent_given: boolean;
  created_at: string;
}

export interface MinistrySignup {
  id: string;
  ministry_id?: string;
  ministry_name: string;
  full_name: string;
  phone: string;
  email?: string;
  notes?: string;
  consent_given: boolean;
  created_at: string;
}

export type DonationFund =
  | 'Tithe'
  | 'Offering'
  | 'Building Fund'
  | 'Missions'
  | 'Welfare'
  | 'Other';

export interface DonationRecord {
  id: string;
  user_id?: string | null;
  donor_name?: string;
  phone: string;
  amount: number;
  fund: DonationFund;
  merchant_request_id?: string;
  checkout_request_id?: string;
  mpesa_receipt_number?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  result_desc?: string;
  consent_given: boolean;
  created_at: string;
}

export interface PublicChurchBundle {
  settings: SiteSettings;
  sermons: Sermon[];
  events: ChurchEvent[];
  announcements: Announcement[];
  posts: NewsPost[];
  leaders: Leader[];
  ministries: Ministry[];
  smallGroups: SmallGroup[];
  testimonies: Testimony[];
}
