import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
import {createServer as createViteServer} from 'vite';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'church-db.json');
const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');

interface ChurchDb {
  settings: {
    id: string;
    is_live: boolean;
    live_title: string;
    live_url: string;
    daily_verse_ref: string;
    daily_verse_text: string;
    daily_verse_sw: string;
    daily_devotional: string;
    updated_at: string;
  };
  sermons: Array<Record<string, unknown>>;
  events: Array<Record<string, unknown>>;
  announcements: Array<Record<string, unknown>>;
  posts: Array<Record<string, unknown>>;
  leaders: Array<Record<string, unknown>>;
  ministries: Array<Record<string, unknown>>;
  smallGroups: Array<Record<string, unknown>>;
  testimonies: Array<Record<string, unknown>>;
  visitors: Array<Record<string, unknown>>;
  prayerRequests: Array<Record<string, unknown>>;
  ministrySignups: Array<Record<string, unknown>>;
  eventRsvps: Array<Record<string, unknown>>;
  donations: Array<Record<string, unknown>>;
  profiles: Array<Record<string, unknown>>;
}

function createInitialSeed(): ChurchDb {
  const now = new Date().toISOString();
  return {
    settings: {
      id: 'main',
      is_live: false,
      live_title: 'Sunday Family Worship — Live from PEFA Kenyatta',
      live_url: 'https://www.youtube.com/@pefakenyatta',
      daily_verse_ref: 'Psalm 122:1',
      daily_verse_text: '"I rejoiced with those who said to me, \'Let us go to the house of the Lord.\'"',
      daily_verse_sw: '"Nalifurahi waliponiambia, Na twende nyumbani mwa Bwana."',
      daily_devotional:
        'Every gathering in God’s house is an invitation to lay down heavy burdens and find renewed strength in Christ together with your church family.',
      updated_at: now,
    },
    leaders: [
      {
        id: 'leader-1',
        full_name: 'Rev. David Mwangi',
        role_title: 'Senior Pastor',
        role_title_sw: 'Mchungaji Mkuu',
        bio: 'Serving PEFA Kenyatta for over 14 years with a heart for expository preaching, family discipleship, and Nairobi urban missions.',
        photo_key: 'pastorDavid',
        display_order: 1,
        published: true,
      },
      {
        id: 'leader-2',
        full_name: 'Pastor Grace Wanjiku',
        role_title: 'Associate Pastor — Care & Families',
        role_title_sw: 'Mchungaji Msaidizi — Familia na Ushauri',
        bio: "Leads pastoral care, women's fellowship, and new-believer foundations across Kenyatta and Ngumo estates.",
        photo_key: 'pastorGrace',
        display_order: 2,
        published: true,
      },
      {
        id: 'leader-3',
        full_name: 'Elder Samuel Ochieng',
        role_title: 'Church Secretary & Missions Lead',
        role_title_sw: 'Katibu wa Kanisa na Misheni',
        bio: 'Oversees church governance, community food outreach, and rural church planting partnerships across Kenya.',
        display_order: 3,
        published: true,
      },
      {
        id: 'leader-4',
        full_name: 'Deaconess Esther Muthoni',
        role_title: 'Treasurer & Stewardship',
        role_title_sw: 'Mweka Hazina',
        bio: 'Stewards transparent church finances, M-Pesa giving accountability, and sanctuary building development.',
        display_order: 4,
        published: true,
      },
    ],
    sermons: [
      {
        id: 'sermon-1',
        title: 'Rooted in Hope When Seasons Shift',
        title_sw: 'Wenye Mizizi ya Tumaini',
        preacher: 'Rev. David Mwangi',
        sermon_date: '2026-11-08',
        series: 'Anchored in Grace',
        scripture: 'Jeremiah 17:7-8',
        summary:
          'How a believer stays spiritually green and fruitful even in economic or personal dry seasons through daily trust in God.',
        youtube_url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        notes_url: '#notes-jeremiah-17',
        duration: '44 min',
        published: true,
        created_at: now,
      },
      {
        id: 'sermon-2',
        title: 'The Praying Household',
        title_sw: 'Nyumba ya Maombi',
        preacher: 'Pastor Grace Wanjiku',
        sermon_date: '2026-11-01',
        series: 'Strong Families',
        scripture: 'Joshua 24:15',
        summary:
          'Practical rhythms for building an altar of prayer, kindness, and scripture in modern Kenyan homes.',
        youtube_url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        notes_url: '#notes-joshua-24',
        duration: '38 min',
        published: true,
        created_at: now,
      },
      {
        id: 'sermon-3',
        title: 'Generosity That Builds the Kingdom',
        title_sw: 'Ukarimu Unaoujenga Ufalme',
        preacher: 'Rev. David Mwangi',
        sermon_date: '2026-10-25',
        series: 'Anchored in Grace',
        scripture: '2 Corinthians 9:6-11',
        summary:
          'Understanding cheerful stewardship, firstfruits, and how local giving transforms neighborhoods around Mbagathi and Kibra.',
        youtube_url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        notes_url: '#notes-2cor-9',
        duration: '41 min',
        published: true,
        created_at: now,
      },
      {
        id: 'sermon-4',
        title: 'Bold Witnesses in the Marketplace',
        title_sw: 'Mashahidi Hodari Kazini',
        preacher: 'Elder Samuel Ochieng',
        sermon_date: '2026-10-18',
        series: 'Sent Out',
        scripture: 'Acts 1:8',
        summary:
          'Living with integrity and quiet courage in Nairobi offices, campuses, and businesses.',
        youtube_url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        notes_url: '#notes-acts-1',
        duration: '36 min',
        published: true,
        created_at: now,
      },
    ],
    events: [
      {
        id: 'event-1',
        title: 'Sunday Family Worship & Holy Communion',
        title_sw: 'Ibada ya Familia na Meza ya Bwana',
        category: 'Worship',
        start_at: '2026-11-22T10:30:00+03:00',
        end_at: '2026-11-22T12:45:00+03:00',
        location: 'PEFA Kenyatta Main Sanctuary',
        description:
          "Join us for uplifting English & Kiswahili praise, verse-by-verse teaching, and Holy Communion. PEFA Kids runs concurrently for ages 3–12.",
        rsvp_enabled: true,
        rsvp_count: 42,
        published: true,
        created_at: now,
      },
      {
        id: 'event-2',
        title: 'Kenyatta Neighborhood Food & Medical Outreach',
        title_sw: 'Huduma ya Chakula na Afya Mtaani',
        category: 'Outreach',
        start_at: '2026-11-28T09:00:00+03:00',
        end_at: '2026-11-28T14:00:00+03:00',
        location: 'Kenyatta Market Grounds',
        description:
          'Free blood pressure & diabetes screening with Christian doctors from KNH, children mentorship, and food hampers for 120 families.',
        photo_key: 'communityOutreach',
        rsvp_enabled: true,
        rsvp_count: 28,
        published: true,
        created_at: now,
      },
      {
        id: 'event-3',
        title: 'Friday Night Kesha: Revival & Intercession',
        title_sw: 'Kesha ya Ijumaa: Uamsho na Maombi',
        category: 'Prayer',
        start_at: '2026-12-04T21:00:00+03:00',
        end_at: '2026-12-05T04:30:00+03:00',
        location: 'PEFA Kenyatta Main Sanctuary',
        description:
          'An overnight gathering of worship, word, and intercession for families, candidates, and our nation Kenya.',
        rsvp_enabled: true,
        rsvp_count: 65,
        published: true,
        created_at: now,
      },
      {
        id: 'event-4',
        title: 'Youth & Young Adults Hangout — Nairobi',
        title_sw: 'Kongamano la Vijana',
        category: 'Youth',
        start_at: '2026-12-12T14:00:00+03:00',
        end_at: '2026-12-12T17:30:00+03:00',
        location: 'Fellowship Hall, Kenyatta Branch',
        description:
          'Acoustic worship, career & faith panel with Christian professionals, and fellowship meal.',
        photo_key: 'youthMinistry',
        rsvp_enabled: true,
        rsvp_count: 34,
        published: true,
        created_at: now,
      },
    ],
    announcements: [
      {
        id: 'ann-1',
        title: 'New Members & Baptism Class Starts This Sunday',
        title_sw: 'Darasa la Washiriki Wapya na Ubatizo',
        body: 'If you recently joined PEFA Kenyatta or wish to be baptized, meet Pastor Grace in Room 2 right after the 10:30 AM service.',
        body_sw:
          'Kama umejiunga nasi hivi karibuni au unatamani kubatizwa, kutana na Mchungaji Grace chumbani namba 2 baada ya ibada ya pili.',
        event_date: 'Sundays, 12:45 PM',
        priority: 'important',
        published: true,
        created_at: now,
      },
      {
        id: 'ann-2',
        title: 'Midweek Bible Study — Book of Romans',
        title_sw: 'Masomo ya Biblia Jumatano',
        body: 'Join us every Wednesday evening at 5:30 PM as we walk chapter-by-chapter through Paul’s letter to the Romans.',
        body_sw:
          'Karibu kila Jumatano saa 11:30 jioni tukijifunza kitabu cha Warumi mstari kwa mstari.',
        event_date: 'Wednesdays, 5:30 PM',
        priority: 'normal',
        published: true,
        created_at: now,
      },
      {
        id: 'ann-3',
        title: 'Sanctuary Solar & Roof Expansion Update',
        title_sw: 'Taarifa ya Ujenzi na Nishati ya Jua',
        body: 'Thank you for giving toward our Building Fund! Phase 1 solar backup lighting is now 80% funded.',
        body_sw: 'Asante kwa sadaka yako ya ujenzi! Awamu ya kwanza ya taa za sola imefikia asilimia 80.',
        event_date: 'Ongoing',
        priority: 'normal',
        published: true,
        created_at: now,
      },
    ],
    posts: [
      {
        id: 'post-1',
        title: 'Welcome Home: A Fresh Season of Community Care at PEFA Kenyatta',
        slug: 'welcome-home-fresh-season',
        excerpt:
          'How our small groups and KNH hospital visitation team are reaching neighbors around Kenyatta Market and Mbagathi Way.',
        content:
          'Over the past quarter, more than 40 families have connected into weekly home fellowships across Kenyatta Estate, Ngumo, and Woodley. Whether you are visiting Nairobi for the first time or looking for a church home near Kenyatta National Hospital, our doors and hearts are open every Sunday at 8:00 AM and 10:30 AM.',
        author: 'Rev. David Mwangi',
        photo_key: 'communityOutreach',
        published_at: '2026-11-05',
        published: true,
        created_at: now,
      },
      {
        id: 'post-2',
        title: 'Building Together: Phase 1 Solar & Children’s Wing Progress',
        slug: 'building-together-solar-progress',
        excerpt:
          'Thanks to faithful M-Pesa giving toward the Building Fund, our children’s classrooms now have brighter ventilation and backup power.',
        content:
          'Every shilling given to the Building Fund goes directly toward creating safe, joyful spaces for PEFA Kids and dependable lighting for Friday prayer vigils. Thank you for partnering with us in prayer and generosity.',
        author: 'Deaconess Esther Muthoni',
        photo_key: 'youthMinistry',
        published_at: '2026-10-28',
        published: true,
        created_at: now,
      },
    ],
    ministries: [
      {
        id: 'min-1',
        name: 'PEFA Kids (Ages 3–12)',
        name_sw: 'Huduma ya Watoto',
        category: 'Children',
        leader_name: 'Teacher Lydia Njeri',
        meeting_time: 'Sundays · 8:00 AM & 10:30 AM',
        description:
          'Age-grouped Bible storytelling, memory verses, crafts, and joyful worship in a safe, checked-in children’s wing.',
        published: true,
      },
      {
        id: 'min-2',
        name: 'Teens Ignite (Ages 13–17)',
        name_sw: 'Huduma ya Vijana Wadogo',
        category: 'Teens',
        leader_name: 'Brother Brian Kiprop',
        meeting_time: 'Sundays 10:30 AM & Saturdays 2:00 PM',
        description: 'Real conversations on identity, friendships, school life, and walking boldly with Jesus.',
        photo_key: 'youthMinistry',
        published: true,
      },
      {
        id: 'min-3',
        name: 'Vessels of Destiny Youth (18–30)',
        name_sw: 'Vijana Wakuu',
        category: 'Youth',
        leader_name: 'Pastor Kevin Otieno',
        meeting_time: 'Sundays 1:00 PM & Thursdays 6:00 PM',
        description:
          'University students and young professionals growing in purpose, music, and career integrity across Nairobi.',
        photo_key: 'youthMinistry',
        published: true,
      },
      {
        id: 'min-4',
        name: 'Daughters of Zion (Women)',
        name_sw: 'Huduma ya Wanawake',
        category: 'Women',
        leader_name: 'Pastor Grace Wanjiku',
        meeting_time: '1st Saturday of Month · 2:00 PM',
        description:
          'Prayer, mentorship, home economics, and supporting expectant mothers and widows in our community.',
        published: true,
      },
      {
        id: 'min-5',
        name: 'Kingdom Men Fellowship',
        name_sw: 'Huduma ya Wanaume',
        category: 'Men',
        leader_name: 'Elder Peter Kamau',
        meeting_time: '3rd Saturday of Month · 7:30 AM',
        description:
          'Breakfast fellowship equipping husbands, fathers, and marketplace leaders in godly stewardship.',
        published: true,
      },
      {
        id: 'min-6',
        name: 'Levites Praise & Worship',
        name_sw: 'Kikosi cha Sifa na Kuabudu',
        category: 'Music/Worship',
        leader_name: 'Minister Sarah Achieng',
        meeting_time: 'Saturdays · 3:00 PM (Rehearsal)',
        description:
          'Vocalists and instrumentalists leading heartfelt, Spirit-led English and Kiswahili congregational worship.',
        published: true,
      },
      {
        id: 'min-7',
        name: 'Hospitality & Ushering',
        name_sw: 'Ukaribishaji na Mashemasi',
        category: 'Ushering',
        leader_name: 'Deacon John Njoroge',
        meeting_time: 'Sundays · 7:15 AM Briefing',
        description:
          'The warm first smile at the gate, seating support, visitor welcome packs, and order during service.',
        published: true,
      },
      {
        id: 'min-8',
        name: 'Watchmen Intercessory',
        name_sw: 'Waombezi wa Kanisa',
        category: 'Intercessory',
        leader_name: 'Sister Mary Wambui',
        meeting_time: 'Tuesdays & Fridays · 6:00 PM',
        description:
          'Standing in the gap for church families, the sick at KNH, leadership, and revival across Nairobi.',
        published: true,
      },
      {
        id: 'min-9',
        name: 'Compassion & Missions Outreach',
        name_sw: 'Huduma ya Jamii na Misheni',
        category: 'Outreach',
        leader_name: 'Elder Samuel Ochieng',
        meeting_time: 'Last Saturday of Month · 9:00 AM',
        description:
          'Street evangelism, hospital visits to Kenyatta National Hospital, and neighborhood food support.',
        photo_key: 'communityOutreach',
        published: true,
      },
    ],
    smallGroups: [
      {
        id: 'sg-1',
        name: 'Kenyatta Estate Grace Cell',
        area: 'Kenyatta Estate (Phase 1 & 2)',
        meeting_day: 'Thursday',
        meeting_time: '6:30 PM',
        host_name: 'Bro. Daniel & Sis. Ruth Karanja',
        contact_phone: '+254 722 334 455',
        description: 'Warm living-room Bible study, prayer, and family care within walking distance of the church.',
        published: true,
      },
      {
        id: 'sg-2',
        name: 'Ngumo & Mbagathi Cell',
        area: 'Ngumo Estate',
        meeting_day: 'Tuesday',
        meeting_time: '6:30 PM',
        host_name: 'Elder Samuel Ochieng',
        contact_phone: '+254 733 445 566',
        description: "Discussion on Sunday's sermon plus intercession for families around Ngumo and Highview.",
        published: true,
      },
      {
        id: 'sg-3',
        name: "Woodley & Joseph Kang'ethe Cell",
        area: 'Woodley / Kibera Drive',
        meeting_day: 'Thursday',
        meeting_time: '6:00 PM',
        host_name: 'Deaconess Esther Muthoni',
        contact_phone: '+254 711 556 677',
        description: 'Evening fellowship for professionals and families in Woodley and Jamhuri.',
        published: true,
      },
      {
        id: 'sg-4',
        name: 'Golf Course & KNH Campus Cell',
        area: 'Golf Course / KNH Area',
        meeting_day: 'Wednesday',
        meeting_time: '7:00 PM',
        host_name: 'Dr. Mercy Chebet',
        contact_phone: '+254 720 667 788',
        description: 'Focused on medical students, nurses, and young professionals near Kenyatta National Hospital.',
        published: true,
      },
    ],
    testimonies: [
      {
        id: 'test-1',
        author_name: 'Beatrice Nyambura',
        title: 'Peace and Provision After Job Loss',
        story:
          'When I lost my job early this year, our Ngumo cell group prayed with me every Tuesday and brought groceries without me even asking. Three months later God opened a better role at a clinic nearby.',
        status: 'approved',
        consent_given: true,
        created_at: now,
      },
      {
        id: 'test-2',
        author_name: 'Josephat Mutua',
        title: 'Restored Family Unity',
        story:
          'Attending the Sunday teachings on the Praying Household transformed how my wife and I communicate. We now pray together with our children every night before bed.',
        status: 'approved',
        consent_given: true,
        created_at: now,
      },
      {
        id: 'test-3',
        author_name: 'Miriam Akinyi',
        title: 'Healing & Warm Welcome at KNH Season',
        story:
          'While my mother was admitted at Kenyatta National Hospital, PEFA Kenyatta intercessors visited us and prayed with us every evening. Today she is healthy and worshiping with us.',
        status: 'pending',
        consent_given: true,
        created_at: now,
      },
    ],
    visitors: [
      {
        id: 'vis-1',
        full_name: 'Faith Wambui',
        phone: '+254712889900',
        email: 'faith.wambui@example.ke',
        preferred_date: '2026-11-22',
        preferred_service: '10:30 AM Main Family Service',
        guests_count: 2,
        notes: 'Visiting with my 6-year-old daughter — excited for PEFA Kids!',
        consent_given: true,
        followed_up: false,
        created_at: now,
      },
    ],
    prayerRequests: [
      {
        id: 'pray-1',
        request_type: 'prayer',
        full_name: 'Peter N.',
        phone: '+254723112233',
        request_text: 'Please stand with me in prayer for my upcoming nursing licensing exams next month.',
        pastors_only: true,
        consent_given: true,
        status: 'new',
        created_at: now,
      },
    ],
    ministrySignups: [
      {
        id: 'ms-1',
        ministry_id: 'min-6',
        ministry_name: 'Levites Praise & Worship',
        full_name: 'Caleb Kiprono',
        phone: '+254715443322',
        email: 'caleb@example.ke',
        notes: 'I play acoustic guitar and sing tenor.',
        consent_given: true,
        created_at: now,
      },
    ],
    eventRsvps: [],
    donations: [
      {
        id: 'don-1',
        donor_name: 'Member Giving',
        phone: '254722111222',
        amount: 2500,
        fund: 'Tithe',
        checkout_request_id: 'ws_CO_SEED_001',
        mpesa_receipt_number: 'UKG48X91LP',
        status: 'completed',
        result_desc: 'The service request is processed successfully.',
        consent_given: true,
        created_at: now,
      },
      {
        id: 'don-2',
        donor_name: 'Grace M.',
        phone: '254711998877',
        amount: 1000,
        fund: 'Building Fund',
        checkout_request_id: 'ws_CO_SEED_002',
        mpesa_receipt_number: 'UKG72K10MN',
        status: 'completed',
        result_desc: 'The service request is processed successfully.',
        consent_given: true,
        created_at: now,
      },
      {
        id: 'don-3',
        donor_name: 'Anonymous',
        phone: '254733554433',
        amount: 500,
        fund: 'Offering',
        checkout_request_id: 'ws_CO_SEED_003',
        mpesa_receipt_number: 'UKG91T34QR',
        status: 'completed',
        result_desc: 'The service request is processed successfully.',
        consent_given: true,
        created_at: now,
      },
    ],
    profiles: [
      {
        id: 'member-demo-1',
        full_name: 'Mercy Wanjiru',
        phone: '254722111222',
        email: 'mercy@pefakenyatta.org',
        role: 'member',
        small_group_id: 'sg-1',
        sms_opt_in: true,
        whatsapp_opt_in: true,
        saved_sermon_ids: ['sermon-1'],
        created_at: now,
      },
      {
        id: 'admin-demo-1',
        full_name: 'Rev. David Mwangi',
        phone: '254722000111',
        email: 'pastor@pefakenyatta.org',
        role: 'admin',
        small_group_id: 'sg-1',
        sms_opt_in: true,
        whatsapp_opt_in: true,
        saved_sermon_ids: ['sermon-1', 'sermon-2'],
        created_at: now,
      },
    ],
  };
}

function readDb(): ChurchDb {
  fs.mkdirSync(DATA_DIR, {recursive: true});
  if (!fs.existsSync(DB_FILE)) {
    const initial = createInitialSeed();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) as ChurchDb;
  } catch {
    const initial = createInitialSeed();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

function writeDb(db: ChurchDb) {
  fs.mkdirSync(DATA_DIR, {recursive: true});
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function normalizeKenyanPhone(raw: string): string {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`;
  if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) return `254${digits}`;
  throw new Error('Enter a valid Kenyan phone number (e.g. 0712 345 678 or 254712345678).');
}

function formatDarajaTimestamp(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function isAdminAuthorized(req: express.Request): boolean {
  const expected = process.env.ADMIN_PASSCODE || 'PEFA2026';
  const passcode = req.headers['x-admin-passcode'];
  const roleHeader = req.headers['x-user-role'];
  return passcode === expected || roleHeader === 'admin';
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json({limit: '6mb'}));
  fs.mkdirSync(UPLOAD_DIR, {recursive: true});

  // Serve uploaded resized images
  app.use('/uploads', express.static(UPLOAD_DIR));

  // Healthcheck
  app.get('/api/health', (_req, res) => {
    res.json({ok: true, service: 'PEFA Kenyatta API'});
  });

  // Public church bundle (published content only)
  app.get('/api/church/public', (_req, res) => {
    const db = readDb();
    res.json({
      settings: db.settings,
      sermons: db.sermons.filter((s) => s.published !== false),
      events: db.events.filter((e) => e.published !== false),
      announcements: db.announcements.filter((a) => a.published !== false),
      posts: db.posts.filter((p) => p.published !== false),
      leaders: [...db.leaders]
        .filter((l) => l.published !== false)
        .sort((a, b) => Number(a.display_order || 99) - Number(b.display_order || 99)),
      ministries: db.ministries.filter((m) => m.published !== false),
      smallGroups: db.smallGroups.filter((g) => g.published !== false),
      testimonies: db.testimonies.filter((t) => t.status === 'approved'),
    });
  });

  // Public form submissions (Kenya Data Protection consent required)
  app.post('/api/church/visitors', (req, res) => {
    const body = req.body as Record<string, unknown>;
    if (!body?.consent_given) return res.status(400).json({error: 'Consent checkbox is required.'});
    if (!body.full_name || !body.phone || !body.preferred_date) {
      return res.status(400).json({error: 'Name, phone number, and preferred Sunday date are required.'});
    }
    const db = readDb();
    const record = {
      id: `vis-${crypto.randomUUID().slice(0, 8)}`,
      full_name: String(body.full_name),
      phone: String(body.phone),
      email: body.email ? String(body.email) : '',
      preferred_date: String(body.preferred_date),
      preferred_service: String(body.preferred_service || '10:30 AM Main Family Service'),
      guests_count: Number(body.guests_count || 1),
      notes: body.notes ? String(body.notes) : '',
      consent_given: true,
      followed_up: false,
      created_at: new Date().toISOString(),
    };
    db.visitors.unshift(record);
    writeDb(db);
    res.status(201).json({ok: true, record});
  });

  app.post('/api/church/rsvps', (req, res) => {
    const body = req.body as Record<string, unknown>;
    if (!body?.consent_given) return res.status(400).json({error: 'Consent checkbox is required.'});
    if (!body.event_id || !body.full_name || !body.phone) {
      return res.status(400).json({error: 'Event, name, and phone are required.'});
    }
    const db = readDb();
    const record = {
      id: `rsvp-${crypto.randomUUID().slice(0, 8)}`,
      event_id: String(body.event_id),
      full_name: String(body.full_name),
      phone: String(body.phone),
      guests: Number(body.guests || 1),
      consent_given: true,
      created_at: new Date().toISOString(),
    };
    db.eventRsvps.unshift(record);
    const ev = db.events.find((e) => e.id === record.event_id);
    if (ev) {
      ev.rsvp_count = Number(ev.rsvp_count || 0) + record.guests;
    }
    writeDb(db);
    res.status(201).json({ok: true, record});
  });

  app.post('/api/church/ministry-signups', (req, res) => {
    const body = req.body as Record<string, unknown>;
    if (!body?.consent_given) return res.status(400).json({error: 'Consent checkbox is required.'});
    if (!body.ministry_name || !body.full_name || !body.phone) {
      return res.status(400).json({error: 'Ministry, name, and phone are required.'});
    }
    const db = readDb();
    const record = {
      id: `ms-${crypto.randomUUID().slice(0, 8)}`,
      ministry_id: body.ministry_id ? String(body.ministry_id) : undefined,
      ministry_name: String(body.ministry_name),
      full_name: String(body.full_name),
      phone: String(body.phone),
      email: body.email ? String(body.email) : '',
      notes: body.notes ? String(body.notes) : '',
      consent_given: true,
      created_at: new Date().toISOString(),
    };
    db.ministrySignups.unshift(record);
    writeDb(db);
    res.status(201).json({ok: true, record});
  });

  app.post('/api/church/prayer', (req, res) => {
    const body = req.body as Record<string, unknown>;
    if (!body?.consent_given) return res.status(400).json({error: 'Consent checkbox is required.'});
    if (!body.request_text) {
      return res.status(400).json({error: 'Please enter your prayer or counselling request.'});
    }
    const db = readDb();
    const record = {
      id: `pray-${crypto.randomUUID().slice(0, 8)}`,
      request_type: body.request_type === 'counselling' ? 'counselling' : 'prayer',
      full_name: body.full_name ? String(body.full_name) : 'Anonymous',
      phone: body.phone ? String(body.phone) : '',
      request_text: String(body.request_text),
      pastors_only: body.pastors_only !== false,
      preferred_callback_time: body.preferred_callback_time ? String(body.preferred_callback_time) : '',
      consent_given: true,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    db.prayerRequests.unshift(record);
    writeDb(db);
    res.status(201).json({ok: true, record});
  });

  app.post('/api/church/testimonies', (req, res) => {
    const body = req.body as Record<string, unknown>;
    if (!body?.consent_given) return res.status(400).json({error: 'Consent checkbox is required.'});
    if (!body.author_name || !body.title || !body.story) {
      return res.status(400).json({error: 'Name, title, and testimony story are required.'});
    }
    const db = readDb();
    const record = {
      id: `test-${crypto.randomUUID().slice(0, 8)}`,
      author_name: String(body.author_name),
      phone: body.phone ? String(body.phone) : '',
      title: String(body.title),
      story: String(body.story),
      status: 'pending',
      consent_given: true,
      created_at: new Date().toISOString(),
    };
    db.testimonies.unshift(record);
    writeDb(db);
    res.status(201).json({ok: true, record});
  });

  // Member Portal donations lookup & profile sync
  app.get('/api/mpesa/my-donations', (req, res) => {
    const phoneQuery = String(req.query.phone || '').replace(/\D/g, '');
    if (!phoneQuery) return res.json({donations: []});
    const suffix = phoneQuery.slice(-9);
    const db = readDb();
    const matching = db.donations.filter((d) => String(d.phone || '').replace(/\D/g, '').endsWith(suffix));
    res.json({donations: matching});
  });

  // M-Pesa Daraja STK Push endpoint (Real Daraja when configured, authentic Sandbox simulator in preview)
  app.post('/api/mpesa/stkpush', async (req, res) => {
    try {
      const body = req.body as {
        phone?: string;
        amount?: number;
        fund?: string;
        donorName?: string;
        consentGiven?: boolean;
        userId?: string | null;
      };

      if (!body?.consentGiven) {
        return res.status(400).json({error: 'Please tick the Data Protection consent box before giving.'});
      }
      const amount = Math.round(Number(body.amount));
      if (!Number.isFinite(amount) || amount < 1 || amount > 150000) {
        return res.status(400).json({error: 'Please enter an amount between KES 1 and KES 150,000.'});
      }

      const phone = normalizeKenyanPhone(String(body.phone || ''));
      const fund = String(body.fund || 'Offering');
      const donorName = body.donorName ? String(body.donorName) : 'Church Member';

      const consumerKey = process.env.MPESA_CONSUMER_KEY;
      const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
      const passkey = process.env.MPESA_PASSKEY;
      const shortcode = process.env.MPESA_SHORTCODE || '174379';
      const hasLiveDaraja =
        Boolean(consumerKey && consumerSecret && passkey) &&
        !String(consumerKey).includes('YOUR_DARAJA') &&
        !String(passkey).includes('YOUR_DARAJA');

      const db = readDb();
      const now = new Date().toISOString();

      if (hasLiveDaraja) {
        const env = process.env.MPESA_ENV === 'production' ? 'production' : 'sandbox';
        const baseUrl = env === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
          headers: {Authorization: `Basic ${auth}`},
        });
        if (!tokenRes.ok) {
          return res.status(502).json({error: 'Unable to authenticate with Safaricom Daraja API.'});
        }
        const tokenJson = (await tokenRes.json()) as {access_token: string};
        const timestamp = formatDarajaTimestamp();
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
        const callbackUrl = process.env.MPESA_CALLBACK_URL || `${process.env.APP_URL}/api/mpesa/callback`;
        const accountRef = `PEFA-${fund.toUpperCase().replace(/\s+/g, '').slice(0, 8)}`;

        const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenJson.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phone,
            PartyB: shortcode,
            PhoneNumber: phone,
            CallBackURL: callbackUrl,
            AccountReference: accountRef,
            TransactionDesc: `PEFA Kenyatta ${fund}`,
          }),
        });
        const stkData = (await stkRes.json()) as {
          ResponseCode?: string;
          ResponseDescription?: string;
          MerchantRequestID?: string;
          CheckoutRequestID?: string;
          errorMessage?: string;
        };
        if (!stkRes.ok || stkData.ResponseCode !== '0') {
          return res.status(400).json({
            error: stkData.errorMessage || stkData.ResponseDescription || 'Daraja STK Push request failed.',
          });
        }

        const record = {
          id: `don-${crypto.randomUUID().slice(0, 8)}`,
          user_id: body.userId || null,
          donor_name: donorName,
          phone,
          amount,
          fund,
          merchant_request_id: stkData.MerchantRequestID,
          checkout_request_id: stkData.CheckoutRequestID,
          status: 'pending',
          result_desc: 'STK Push sent to phone. Waiting for M-Pesa PIN.',
          consent_given: true,
          created_at: now,
        };
        db.donations.unshift(record);
        writeDb(db);

        return res.json({
          ok: true,
          mode: 'daraja',
          checkoutRequestId: stkData.CheckoutRequestID,
          customerMessage: 'M-Pesa prompt sent! Enter your M-Pesa PIN on your phone to complete giving.',
          record,
        });
      }

      // Sandbox simulation mode when Daraja keys are not yet configured in environment
      const checkoutRequestId = `ws_CO_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      const merchantRequestId = `MR_${crypto.randomBytes(4).toString('hex')}`;
      const record = {
        id: `don-${crypto.randomUUID().slice(0, 8)}`,
        user_id: body.userId || null,
        donor_name: donorName,
        phone,
        amount,
        fund,
        merchant_request_id: merchantRequestId,
        checkout_request_id: checkoutRequestId,
        status: 'pending',
        result_desc: 'STK Push sent to phone (Sandbox preview). Waiting for PIN confirmation...',
        consent_given: true,
        created_at: now,
      };
      db.donations.unshift(record);
      writeDb(db);

      // Simulate Safaricom M-Pesa callback arrival after 2.6s
      setTimeout(() => {
        const latestDb = readDb();
        const item = latestDb.donations.find((d) => d.checkout_request_id === checkoutRequestId);
        if (item && item.status === 'pending') {
          item.status = 'completed';
          item.mpesa_receipt_number = `UK${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
          item.result_desc = 'The service request is processed successfully.';
          item.updated_at = new Date().toISOString();
          writeDb(latestDb);
        }
      }, 2600);

      return res.json({
        ok: true,
        mode: 'sandbox-preview',
        checkoutRequestId,
        customerMessage:
          'STK Push prompt sent to your phone. Confirming your M-Pesa PIN response...',
        record,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to send M-Pesa prompt.';
      return res.status(400).json({error: msg});
    }
  });

  // Safaricom Daraja Callback URL
  app.post('/api/mpesa/callback', (req, res) => {
    const callback = (req.body as {
      Body?: {
        stkCallback?: {
          CheckoutRequestID: string;
          ResultCode: number;
          ResultDesc: string;
          CallbackMetadata?: {Item: Array<{Name: string; Value?: string | number}>};
        };
      };
    })?.Body?.stkCallback;

    if (!callback) {
      return res.status(400).json({ResultCode: 1, ResultDesc: 'Invalid callback payload'});
    }

    const db = readDb();
    const record = db.donations.find((d) => d.checkout_request_id === callback.CheckoutRequestID);
    if (record) {
      const isSuccess = callback.ResultCode === 0;
      const receipt = callback.CallbackMetadata?.Item?.find((i) => i.Name === 'MpesaReceiptNumber')?.Value;
      record.status = isSuccess ? 'completed' : callback.ResultCode === 1032 ? 'cancelled' : 'failed';
      record.mpesa_receipt_number = receipt ? String(receipt) : undefined;
      record.result_desc = callback.ResultDesc;
      record.updated_at = new Date().toISOString();
      writeDb(db);
    }

    res.json({ResultCode: 0, ResultDesc: 'Accepted'});
  });

  // Poll M-Pesa STK transaction status
  app.get('/api/mpesa/status/:checkoutRequestId', (req, res) => {
    const db = readDb();
    const record = db.donations.find((d) => d.checkout_request_id === req.params.checkoutRequestId);
    if (!record) return res.status(404).json({error: 'Transaction not found'});
    res.json({record});
  });

  // Admin passcode verification
  app.post('/api/auth/verify-admin', (req, res) => {
    const expected = process.env.ADMIN_PASSCODE || 'PEFA2026';
    const {passcode} = req.body as {passcode?: string};
    if (passcode && passcode === expected) {
      return res.json({ok: true});
    }
    return res.status(401).json({error: 'Invalid admin passcode.'});
  });

  // Protected Admin Bundle
  app.get('/api/church/admin/bundle', (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({error: 'Admin authorization required.'});
    }
    const db = readDb();
    res.json(db);
  });

  // Update Site Settings (Live Banner & Daily Verse)
  app.put('/api/church/admin/settings', (req, res) => {
    if (!isAdminAuthorized(req)) return res.status(401).json({error: 'Admin authorization required.'});
    const db = readDb();
    db.settings = {
      ...db.settings,
      ...(req.body as Partial<ChurchDb['settings']>),
      updated_at: new Date().toISOString(),
    };
    writeDb(db);
    res.json({ok: true, settings: db.settings});
  });

  // Generic Admin CRUD for collections
  const allowedCollections = new Set([
    'sermons',
    'events',
    'announcements',
    'posts',
    'leaders',
    'ministries',
    'smallGroups',
    'testimonies',
    'visitors',
    'prayerRequests',
  ]);

  app.post('/api/church/admin/:collection', (req, res) => {
    if (!isAdminAuthorized(req)) return res.status(401).json({error: 'Admin authorization required.'});
    const collection = req.params.collection as keyof ChurchDb;
    if (!allowedCollections.has(collection)) return res.status(400).json({error: 'Invalid collection.'});

    const db = readDb();
    const list = db[collection] as Array<Record<string, unknown>>;
    const record = {
      ...(req.body as Record<string, unknown>),
      id: `${collection.slice(0, 4)}-${crypto.randomUUID().slice(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    list.unshift(record);
    writeDb(db);
    res.status(201).json({ok: true, record});
  });

  app.put('/api/church/admin/:collection/:id', (req, res) => {
    if (!isAdminAuthorized(req)) return res.status(401).json({error: 'Admin authorization required.'});
    const collection = req.params.collection as keyof ChurchDb;
    if (!allowedCollections.has(collection)) return res.status(400).json({error: 'Invalid collection.'});

    const db = readDb();
    const list = db[collection] as Array<Record<string, unknown>>;
    const idx = list.findIndex((item) => item.id === req.params.id);
    if (idx === -1) return res.status(404).json({error: 'Record not found.'});
    list[idx] = {...list[idx], ...(req.body as Record<string, unknown>)};
    writeDb(db);
    res.json({ok: true, record: list[idx]});
  });

  app.delete('/api/church/admin/:collection/:id', (req, res) => {
    if (!isAdminAuthorized(req)) return res.status(401).json({error: 'Admin authorization required.'});
    const collection = req.params.collection as keyof ChurchDb;
    if (!allowedCollections.has(collection)) return res.status(400).json({error: 'Invalid collection.'});

    const db = readDb();
    const list = db[collection] as Array<Record<string, unknown>>;
    const filtered = list.filter((item) => item.id !== req.params.id);
    (db[collection] as Array<Record<string, unknown>>) = filtered;
    writeDb(db);
    res.json({ok: true});
  });

  // Resized image upload endpoint (used when Supabase Storage is not configured)
  app.post('/api/upload', (req, res) => {
    if (!isAdminAuthorized(req)) return res.status(401).json({error: 'Admin authorization required.'});
    const {dataUrl, filename} = req.body as {dataUrl?: string; filename?: string};
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      return res.status(400).json({error: 'Valid image data URL required.'});
    }
    const base64Data = dataUrl.split(',')[1];
    const ext = dataUrl.startsWith('data:image/webp') ? 'webp' : 'jpg';
    const safeName = (filename || 'upload').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24);
    const outName = `${safeName}-${Date.now()}.${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, outName), Buffer.from(base64Data, 'base64'));
    res.json({ok: true, url: `/uploads/${outName}`});
  });

  // Vite Dev Middleware or Production Static Serve
  if (process.env.NODE_ENV !== 'production') {
    app.get('/@vite/client', (_req, res) => {
      res.type('application/javascript').send(`
const sheetsMap = new Map();
export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    style.textContent = content;
    document.head.appendChild(style);
    sheetsMap.set(id, style);
  } else {
    style.textContent = content;
  }
}
export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
    sheetsMap.delete(id);
  }
}
export function injectQuery(url, queryToInject) {
  if (!url.startsWith('.') && !url.startsWith('/')) return url;
  const [pathname, search] = url.split('?');
  return pathname + '?' + (search ? search + '&' : '') + queryToInject;
}
export function createHotContext() {
  const noop = () => {};
  return {
    data: {},
    accept: noop,
    acceptExports: noop,
    dispose: noop,
    prune: noop,
    decline: noop,
    invalidate: noop,
    on: noop,
    off: noop,
    send: noop,
  };
}
export class ErrorOverlay extends HTMLElement {}
`);
    });

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`PEFA Kenyatta server listening on http://localhost:${PORT}`);
  });
}

startServer();
