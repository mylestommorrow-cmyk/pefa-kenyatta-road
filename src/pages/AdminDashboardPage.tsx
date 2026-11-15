import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Check, Download, Lock, Plus, Radio, Trash2, Upload, X} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {
  adminCreateItem,
  adminDeleteItem,
  adminUpdateItem,
  adminUpdateSettings,
  fetchAdminBundle,
  uploadResizedImage,
  verifyAdminPasscode,
} from '../lib/dataService';
import {downloadCsv, formatKenyanMsisdn} from '../lib/csvExport';
import {resizeImageFile} from '../lib/imageResize';
import {Badge, Button, Card, ConfirmDialog, Input, Select, Textarea} from '../components/ui';
import type {DonationRecord, SiteSettings} from '../types/church';

type AdminTab =
  | 'overview'
  | 'sermons'
  | 'events'
  | 'announcements'
  | 'posts'
  | 'leaders'
  | 'ministries'
  | 'groups'
  | 'testimonies'
  | 'submissions'
  | 'giving'
  | 'guide';

export const AdminDashboardPage: React.FC = () => {
  const {adminPasscode, setAdminPasscode, refreshBundle, showToast} = useApp();
  const [passInput, setPassInput] = useState(adminPasscode || '');
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(false);
  const [bundleData, setBundleData] = useState<Awaited<ReturnType<typeof fetchAdminBundle>> | null>(null);
  const [settingsDraft, setSettingsDraft] = useState<Partial<SiteSettings>>({});
  const [fundFilter, setFundFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [pendingDelete, setPendingDelete] = useState<{collection: string; id: string; label: string} | null>(null);

  // Forms
  const [newSermon, setNewSermon] = useState({
    title: '',
    preacher: 'Rev. David Mwangi',
    sermon_date: new Date().toISOString().slice(0, 10),
    series: 'Anchored in Grace',
    scripture: '',
    summary: '',
    youtube_url: '',
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Fellowship',
    start_at: '2026-11-29T10:30',
    end_at: '2026-11-29T13:00',
    location: 'PEFA Kenyatta Main Sanctuary',
    description: '',
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    body: '',
    event_date: '',
    priority: 'normal' as 'normal' | 'important',
  });
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'PEFA Kenyatta Communications',
    cover_image_url: '',
  });
  const [newLeader, setNewLeader] = useState({
    full_name: '',
    role_title: '',
    bio: '',
    photo_url: '',
    display_order: 5,
  });
  const [newMinistry, setNewMinistry] = useState({
    name: '',
    category: 'Outreach',
    leader_name: '',
    meeting_time: '',
    description: '',
  });
  const [newGroup, setNewGroup] = useState({
    name: '',
    area: '',
    meeting_day: 'Thursday',
    meeting_time: '6:30 PM',
    host_name: '',
    contact_phone: '',
    description: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const loadAdmin = useCallback(async (code: string) => {
    setLoading(true);
    try {
      const data = await fetchAdminBundle(code);
      setBundleData(data);
      setSettingsDraft(data.settings);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Unable to load admin data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminPasscode) {
      loadAdmin(adminPasscode);
    }
  }, [adminPasscode, loadAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const ok = await verifyAdminPasscode(passInput.trim());
    if (!ok) {
      setAuthError('Incorrect staff passcode. (Default preview passcode: PEFA2026)');
      return;
    }
    setAdminPasscode(passInput.trim());
  };

  const handleUploadImage = async (file: File | undefined, onDone: (url: string) => void) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const resized = await resizeImageFile(file, 1200, 0.82);
      const url = await uploadResizedImage(adminPasscode, resized.blob, resized.dataUrl, file.name);
      onDone(url);
      showToast(`Image resized (${resized.width}x${resized.height}px) and uploaded!`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Image upload failed.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await adminDeleteItem(adminPasscode, pendingDelete.collection, pendingDelete.id);
    setPendingDelete(null);
    await loadAdmin(adminPasscode);
    await refreshBundle();
    showToast('Item deleted.');
  };

  const monthlyGivingTotal = useMemo(() => {
    const list = (bundleData?.donations || []) as DonationRecord[];
    return list.filter((d) => d.status === 'completed').reduce((acc, d) => acc + Number(d.amount || 0), 0);
  }, [bundleData]);

  const filteredDonations = useMemo(() => {
    const list = (bundleData?.donations || []) as DonationRecord[];
    return list.filter((d) => {
      if (fundFilter !== 'All' && d.fund !== fundFilter) return false;
      if (dateFilter && !String(d.created_at || '').startsWith(dateFilter)) return false;
      return true;
    });
  }, [bundleData, fundFilter, dateFilter]);

  const exportWhatsAppContacts = () => {
    if (!bundleData) return;
    const rawContacts: Array<{name: string; phone: string; source: string}> = [];
    bundleData.visitors.forEach((v) =>
      rawContacts.push({name: String(v.full_name || ''), phone: String(v.phone || ''), source: 'Visitor'})
    );
    bundleData.ministrySignups.forEach((m) =>
      rawContacts.push({name: String(m.full_name || ''), phone: String(m.phone || ''), source: 'Ministry'})
    );
    bundleData.profiles.forEach((p) => {
      if (p.sms_opt_in !== false && p.whatsapp_opt_in !== false) {
        rawContacts.push({name: String(p.full_name || ''), phone: String(p.phone || ''), source: 'Member'})
      }
    });

    const uniqueMap = new Map<string, {name: string; phone: string; source: string}>();
    rawContacts.forEach((c) => {
      const formatted = formatKenyanMsisdn(c.phone);
      if (formatted && !uniqueMap.has(formatted)) {
        uniqueMap.set(formatted, {name: c.name, phone: formatted, source: c.source});
      }
    });

    const rows = Array.from(uniqueMap.values()).map((c) => [c.name, c.phone, c.source]);
    downloadCsv('pefa-kenyatta-whatsapp-sms-contacts.csv', ['Name', 'Phone (+254)', 'Source'], rows);
    showToast(`Exported ${rows.length} opted-in Kenyan contacts.`);
  };

  if (!adminPasscode || !bundleData) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <Card padding="lg">
          <div className="flex items-center gap-2.5 text-[#1E3A8A] dark:text-amber-400">
            <Lock className="h-5 w-5" />
            <span className="text-xs font-semibold">Protected Church Administration</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
            PEFA Kenyatta Admin Console
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Sign in with the staff passcode to update sermons, events, live service banner, and export giving reports.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {authError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                {authError}
              </p>
            )}
            <Input
              label="Staff Passcode"
              type="password"
              required
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              placeholder="Enter passcode (preview: PEFA2026)"
            />
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Verifying...' : 'Open Admin Dashboard'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const tabs: Array<{id: AdminTab; label: string}> = [
    {id: 'overview', label: 'Live & Overview'},
    {id: 'sermons', label: 'Sermons'},
    {id: 'events', label: 'Events'},
    {id: 'announcements', label: 'Announcements'},
    {id: 'posts', label: 'News'},
    {id: 'leaders', label: 'Leaders'},
    {id: 'ministries', label: 'Ministries'},
    {id: 'groups', label: 'Cell Groups'},
    {id: 'testimonies', label: 'Testimonies'},
    {id: 'submissions', label: 'Visitors & Prayer'},
    {id: 'giving', label: 'M-Pesa Giving'},
    {id: 'guide', label: 'Staff Guide'},
  ];

  const pendingTestimoniesCount = bundleData.testimonies.filter((t) => t.status === 'pending').length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">Church Staff Workspace</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            PEFA Kenyatta Admin Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={exportWhatsAppContacts}>
            <Download className="h-3.5 w-3.5" />
            <span>Export WhatsApp/SMS List</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAdminPasscode('');
              setBundleData(null);
            }}
          >
            Lock Admin
          </Button>
        </div>
      </div>

      {/* Quick Common Tasks Bar */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setTab('sermons')}>
          <Plus className="h-3.5 w-3.5" /> <span>Add Sermon</span>
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setTab('events')}>
          <Plus className="h-3.5 w-3.5" /> <span>Add Event</span>
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setTab('announcements')}>
          <Plus className="h-3.5 w-3.5" /> <span>Post Announcement</span>
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setTab('submissions')}>
          <span>View Prayer Requests</span>
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setTab('giving')}>
          <span>View Giving</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-1.5 overflow-x-auto pb-2" role="tablist">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`min-h-[42px] rounded-xl px-3.5 text-xs font-semibold transition whitespace-nowrap shrink-0 ${
              tab === item.id
                ? 'bg-[#1E3A8A] text-white dark:bg-amber-500 dark:text-slate-950'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {item.label}
            {item.id === 'testimonies' && pendingTestimoniesCount > 0 ? ` (${pendingTestimoniesCount})` : ''}
          </button>
        ))}
      </div>

      {/* TAB: OVERVIEW */}
      {tab === 'overview' && (
        <div className="mt-6 space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card padding="md">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Giving This Month</p>
              <p className="mt-2 font-mono-tabular text-2xl font-bold text-slate-900 dark:text-white">
                KES {monthlyGivingTotal.toLocaleString()}
              </p>
            </Card>
            <Card padding="md">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">New Visitors</p>
              <p className="mt-2 font-mono-tabular text-2xl font-bold text-slate-900 dark:text-white">
                {bundleData.visitors.length}
              </p>
            </Card>
            <Card padding="md">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Upcoming Events</p>
              <p className="mt-2 font-mono-tabular text-2xl font-bold text-slate-900 dark:text-white">
                {bundleData.events.length}
              </p>
            </Card>
            <Card padding="md">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Testimonies</p>
              <p className="mt-2 font-mono-tabular text-2xl font-bold text-slate-900 dark:text-white">
                {pendingTestimoniesCount}
              </p>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Radio className="h-5 w-5 text-[#1E3A8A] dark:text-amber-400" />
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Live Service Banner</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsDraft((p) => ({...p, is_live: !p.is_live}))}
                  className={`min-h-[40px] rounded-xl px-3.5 text-xs font-semibold ${
                    settingsDraft.is_live
                      ? 'bg-amber-500 text-slate-950'
                      : 'border border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {settingsDraft.is_live ? 'LIVE: ON' : 'LIVE: OFF'}
                </button>
              </div>
              <div className="mt-4 space-y-3">
                <Input
                  label="Banner Title"
                  value={settingsDraft.live_title || ''}
                  onChange={(e) => setSettingsDraft((p) => ({...p, live_title: e.target.value}))}
                />
                <Input
                  label="YouTube or Facebook Live URL"
                  type="url"
                  value={settingsDraft.live_url || ''}
                  onChange={(e) => setSettingsDraft((p) => ({...p, live_url: e.target.value}))}
                />
              </div>
            </Card>

            <Card>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Daily Verse &amp; Devotional
              </h2>
              <div className="mt-4 space-y-3">
                <Input
                  label="Scripture Reference"
                  value={settingsDraft.daily_verse_ref || ''}
                  onChange={(e) => setSettingsDraft((p) => ({...p, daily_verse_ref: e.target.value}))}
                />
                <Textarea
                  label="English Verse Text"
                  rows={2}
                  value={settingsDraft.daily_verse_text || ''}
                  onChange={(e) => setSettingsDraft((p) => ({...p, daily_verse_text: e.target.value}))}
                />
                <Textarea
                  label="Short Devotional Note"
                  rows={2}
                  value={settingsDraft.daily_devotional || ''}
                  onChange={(e) => setSettingsDraft((p) => ({...p, daily_devotional: e.target.value}))}
                />
              </div>
            </Card>
          </div>

          <Button
            size="lg"
            onClick={async () => {
              await adminUpdateSettings(adminPasscode, settingsDraft);
              await loadAdmin(adminPasscode);
              await refreshBundle();
              showToast('Live banner and daily devotional saved!');
            }}
          >
            Save Live Banner &amp; Daily Verse
          </Button>
        </div>
      )}

      {/* TAB: SERMONS */}
      {tab === 'sermons' && (
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await adminCreateItem(adminPasscode, 'sermons', {...newSermon, published: true, duration: '40 min'});
                setNewSermon({...newSermon, title: '', scripture: '', summary: '', youtube_url: ''});
                await loadAdmin(adminPasscode);
                await refreshBundle();
                showToast('Sermon published!');
              }}
              className="space-y-3.5"
            >
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Add Sermon</h2>
              <Input label="Sermon Title *" required value={newSermon.title} onChange={(e) => setNewSermon({...newSermon, title: e.target.value})} />
              <Input label="Preacher *" required value={newSermon.preacher} onChange={(e) => setNewSermon({...newSermon, preacher: e.target.value})} />
              <Input label="Date *" type="date" required value={newSermon.sermon_date} onChange={(e) => setNewSermon({...newSermon, sermon_date: e.target.value})} />
              <Input label="Scripture *" required value={newSermon.scripture} onChange={(e) => setNewSermon({...newSermon, scripture: e.target.value})} />
              <Input label="Series Name *" required value={newSermon.series} onChange={(e) => setNewSermon({...newSermon, series: e.target.value})} />
              <Input label="YouTube URL" type="url" value={newSermon.youtube_url} onChange={(e) => setNewSermon({...newSermon, youtube_url: e.target.value})} />
              <Textarea label="Short Summary *" required rows={3} value={newSermon.summary} onChange={(e) => setNewSermon({...newSermon, summary: e.target.value})} />
              <Button type="submit" fullWidth>
                <Plus className="h-4 w-4" /> <span>Publish Sermon</span>
              </Button>
            </form>
          </Card>

          <div className="space-y-3 lg:col-span-7">
            {bundleData.sermons.map((s) => (
              <Card key={s.id} padding="sm" className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={s.published ? 'success' : 'neutral'}>{s.published ? 'Published' : 'Draft'}</Badge>
                    <span className="text-xs text-slate-500">{s.sermon_date} · {s.series}</span>
                  </div>
                  <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{s.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{s.preacher} · {s.scripture}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Delete ${s.title}`}
                  onClick={() => setPendingDelete({collection: 'sermons', id: s.id, label: s.title})}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-red-600 hover:bg-red-50 dark:border-slate-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB: EVENTS */}
      {tab === 'events' && (
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await adminCreateItem(adminPasscode, 'events', {
                  ...newEvent,
                  start_at: new Date(newEvent.start_at).toISOString(),
                  end_at: new Date(newEvent.end_at).toISOString(),
                  rsvp_enabled: true,
                  rsvp_count: 0,
                  published: true,
                });
                setNewEvent({...newEvent, title: '', description: ''});
                await loadAdmin(adminPasscode);
                await refreshBundle();
                showToast('Event published!');
              }}
              className="space-y-3.5"
            >
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Add Event</h2>
              <Input label="Event Title *" required value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} />
              <Input label="Category *" required value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})} />
              <Input label="Start Time *" type="datetime-local" required value={newEvent.start_at} onChange={(e) => setNewEvent({...newEvent, start_at: e.target.value})} />
              <Input label="End Time *" type="datetime-local" required value={newEvent.end_at} onChange={(e) => setNewEvent({...newEvent, end_at: e.target.value})} />
              <Input label="Location *" required value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} />
              <Textarea label="Description *" required rows={3} value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} />
              <Button type="submit" fullWidth>
                <Plus className="h-4 w-4" /> <span>Publish Event</span>
              </Button>
            </form>
          </Card>

          <div className="space-y-3 lg:col-span-7">
            {bundleData.events.map((ev) => (
              <Card key={ev.id} padding="sm" className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone={ev.published ? 'success' : 'neutral'}>{ev.published ? 'Published' : 'Draft'}</Badge>
                    <span className="font-mono-tabular text-xs text-slate-500">
                      {new Date(ev.start_at).toLocaleDateString('en-KE')} · RSVPs: {ev.rsvp_count}
                    </span>
                  </div>
                  <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{ev.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{ev.location}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Delete ${ev.title}`}
                  onClick={() => setPendingDelete({collection: 'events', id: ev.id, label: ev.title})}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-red-600 hover:bg-red-50 dark:border-slate-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ANNOUNCEMENTS */}
      {tab === 'announcements' && (
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await adminCreateItem(adminPasscode, 'announcements', {...newAnnouncement, published: true});
                setNewAnnouncement({title: '', body: '', event_date: '', priority: 'normal'});
                await loadAdmin(adminPasscode);
                await refreshBundle();
                showToast('Announcement posted!');
              }}
              className="space-y-3.5"
            >
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Post Announcement</h2>
              <Input label="Headline *" required value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
              <Input label="Timing" value={newAnnouncement.event_date} onChange={(e) => setNewAnnouncement({...newAnnouncement, event_date: e.target.value})} />
              <Select label="Priority" value={newAnnouncement.priority} onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value as 'normal' | 'important'})}>
                <option value="normal">Normal Update</option>
                <option value="important">Important Notice</option>
              </Select>
              <Textarea label="Details *" required rows={3} value={newAnnouncement.body} onChange={(e) => setNewAnnouncement({...newAnnouncement, body: e.target.value})} />
              <Button type="submit" fullWidth>Publish Announcement</Button>
            </form>
          </Card>
          <div className="space-y-3 lg:col-span-7">
            {bundleData.announcements.map((a) => (
              <Card key={a.id} padding="sm" className="flex items-center justify-between gap-4">
                <div>
                  <Badge tone={a.priority === 'important' ? 'warning' : 'success'}>
                    {a.priority === 'important' ? 'Important' : 'Published'}
                  </Badge>
                  <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{a.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{a.body}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Delete ${a.title}`}
                  onClick={() => setPendingDelete({collection: 'announcements', id: a.id, label: a.title})}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-red-600 dark:border-slate-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB: NEWS POSTS WITH DRAG-AND-DROP & IMAGE PREVIEW */}
      {tab === 'posts' && (
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await adminCreateItem(adminPasscode, 'posts', {
                  ...newPost,
                  published_at: new Date().toISOString().slice(0, 10),
                  published: true,
                });
                setNewPost({title: '', excerpt: '', content: '', author: 'PEFA Kenyatta Communications', cover_image_url: ''});
                await loadAdmin(adminPasscode);
                await refreshBundle();
                showToast('News story published!');
              }}
              className="space-y-3.5"
            >
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Publish News Post</h2>
              <Input label="Post Title *" required value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} />
              <Input label="Short Excerpt *" required value={newPost.excerpt} onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})} />
              <Textarea label="Full Story *" required rows={4} value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  handleUploadImage(e.dataTransfer.files?.[0], (url) => setNewPost((p) => ({...p, cover_image_url: url})));
                }}
                className={`rounded-xl border-2 border-dashed p-4 text-center transition ${
                  dragActive
                    ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 dark:border-amber-400'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {newPost.cover_image_url && (
                  <img
                    src={newPost.cover_image_url}
                    alt="Uploaded cover preview"
                    className="mb-3 h-32 w-full rounded-lg object-cover"
                  />
                )}
                <label className="flex min-h-[44px] cursor-pointer flex-col items-center justify-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Upload className="h-4 w-4" />
                  <span>
                    {uploadingImage
                      ? 'Compressing WebP & uploading...'
                      : 'Drag & drop photo here or tap to browse'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleUploadImage(e.target.files?.[0], (url) => setNewPost((p) => ({...p, cover_image_url: url})))}
                  />
                </label>
              </div>

              <Button type="submit" fullWidth>Publish Post</Button>
            </form>
          </Card>

          <div className="space-y-3 lg:col-span-7">
            {bundleData.posts.map((p) => (
              <Card key={p.id} padding="sm" className="flex items-center justify-between gap-4">
                <div>
                  <Badge tone="success">Published</Badge>
                  <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.published_at} · {p.author}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Delete ${p.title}`}
                  onClick={() => setPendingDelete({collection: 'posts', id: p.id, label: p.title})}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-red-600 dark:border-slate-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB: LEADERS */}
      {tab === 'leaders' && (
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await adminCreateItem(adminPasscode, 'leaders', {...newLeader, published: true});
                setNewLeader({full_name: '', role_title: '', bio: '', photo_url: '', display_order: 5});
                await loadAdmin(adminPasscode);
                await refreshBundle();
                showToast('Leader saved!');
              }}
              className="space-y-3.5"
            >
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Add Leader</h2>
              <Input label="Full Name *" required value={newLeader.full_name} onChange={(e) => setNewLeader({...newLeader, full_name: e.target.value})} />
              <Input label="Role Title *" required value={newLeader.role_title} onChange={(e) => setNewLeader({...newLeader, role_title: e.target.value})} />
              <Textarea label="Short Bio *" required rows={3} value={newLeader.bio} onChange={(e) => setNewLeader({...newLeader, bio: e.target.value})} />
              {newLeader.photo_url && (
                <img src={newLeader.photo_url} alt="Leader portrait preview" className="h-24 w-24 rounded-xl object-cover" />
              )}
              <label className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <Upload className="h-4 w-4" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Portrait (Auto-Resized)'}</span>
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleUploadImage(e.target.files?.[0], (url) => setNewLeader((l) => ({...l, photo_url: url})))} />
              </label>
              <Button type="submit" fullWidth>Save Leader</Button>
            </form>
          </Card>
          <div className="space-y-3 lg:col-span-7">
            {bundleData.leaders.map((l) => (
              <Card key={l.id} padding="sm" className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{l.full_name}</p>
                  <p className="text-xs text-[#1E3A8A] dark:text-amber-400">{l.role_title}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Delete ${l.full_name}`}
                  onClick={() => setPendingDelete({collection: 'leaders', id: l.id, label: l.full_name})}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-red-600 dark:border-slate-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB: MINISTRIES */}
      {tab === 'ministries' && (
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await adminCreateItem(adminPasscode, 'ministries', {...newMinistry, published: true});
                setNewMinistry({name: '', category: 'Outreach', leader_name: '', meeting_time: '', description: ''});
                await loadAdmin(adminPasscode);
                await refreshBundle();
                showToast('Ministry added!');
              }}
              className="space-y-3.5"
            >
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Add Ministry</h2>
              <Input label="Ministry Name *" required value={newMinistry.name} onChange={(e) => setNewMinistry({...newMinistry, name: e.target.value})} />
              <Input label="Leader Name *" required value={newMinistry.leader_name} onChange={(e) => setNewMinistry({...newMinistry, leader_name: e.target.value})} />
              <Input label="Meeting Time *" required value={newMinistry.meeting_time} onChange={(e) => setNewMinistry({...newMinistry, meeting_time: e.target.value})} />
              <Textarea label="Description *" required rows={3} value={newMinistry.description} onChange={(e) => setNewMinistry({...newMinistry, description: e.target.value})} />
              <Button type="submit" fullWidth>Add Ministry</Button>
            </form>
          </Card>
          <div className="space-y-3 lg:col-span-7">
            {bundleData.ministries.map((m) => (
              <Card key={m.id} padding="sm" className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{m.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{m.leader_name} · {m.meeting_time}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Delete ${m.name}`}
                  onClick={() => setPendingDelete({collection: 'ministries', id: m.id, label: m.name})}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-red-600 dark:border-slate-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SMALL GROUPS */}
      {tab === 'groups' && (
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await adminCreateItem(adminPasscode, 'smallGroups', {...newGroup, published: true});
                setNewGroup({name: '', area: '', meeting_day: 'Thursday', meeting_time: '6:30 PM', host_name: '', contact_phone: '', description: ''});
                await loadAdmin(adminPasscode);
                await refreshBundle();
                showToast('Cell group saved!');
              }}
              className="space-y-3.5"
            >
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Add Cell Group</h2>
              <Input label="Group Name *" required value={newGroup.name} onChange={(e) => setNewGroup({...newGroup, name: e.target.value})} />
              <Input label="Estate / Area *" required value={newGroup.area} onChange={(e) => setNewGroup({...newGroup, area: e.target.value})} />
              <Input label="Meeting Day *" required value={newGroup.meeting_day} onChange={(e) => setNewGroup({...newGroup, meeting_day: e.target.value})} />
              <Input label="Meeting Time *" required value={newGroup.meeting_time} onChange={(e) => setNewGroup({...newGroup, meeting_time: e.target.value})} />
              <Input label="Host Name *" required value={newGroup.host_name} onChange={(e) => setNewGroup({...newGroup, host_name: e.target.value})} />
              <Input label="Contact Phone *" required value={newGroup.contact_phone} onChange={(e) => setNewGroup({...newGroup, contact_phone: e.target.value})} />
              <Button type="submit" fullWidth>Add Cell Group</Button>
            </form>
          </Card>
          <div className="space-y-3 lg:col-span-7">
            {bundleData.smallGroups.map((g) => (
              <Card key={g.id} padding="sm" className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{g.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{g.area} · {g.meeting_day} {g.meeting_time} · Host: {g.host_name}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Delete ${g.name}`}
                  onClick={() => setPendingDelete({collection: 'smallGroups', id: g.id, label: g.name})}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-red-600 dark:border-slate-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB: TESTIMONIES */}
      {tab === 'testimonies' && (
        <div className="mt-6 space-y-4">
          {bundleData.testimonies.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone={item.status === 'approved' ? 'success' : item.status === 'pending' ? 'warning' : 'error'}>
                    {item.status === 'approved' ? 'Published' : item.status === 'pending' ? 'Pending' : 'Rejected'}
                  </Badge>
                  <span className="text-xs font-medium text-slate-500">{item.author_name}</span>
                </div>
                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.story}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.status !== 'approved' && (
                  <Button
                    size="sm"
                    onClick={async () => {
                      await adminUpdateItem(adminPasscode, 'testimonies', item.id, {status: 'approved'});
                      await loadAdmin(adminPasscode);
                      await refreshBundle();
                      showToast('Testimony approved & published.');
                    }}
                  >
                    <Check className="h-3.5 w-3.5" /> <span>Approve</span>
                  </Button>
                )}
                {item.status !== 'rejected' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      await adminUpdateItem(adminPasscode, 'testimonies', item.id, {status: 'rejected'});
                      await loadAdmin(adminPasscode);
                      await refreshBundle();
                      showToast('Testimony hidden.');
                    }}
                  >
                    <X className="h-3.5 w-3.5" /> <span>Reject</span>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB: VISITORS & PRAYER */}
      {tab === 'submissions' && (
        <div className="mt-6 space-y-8">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Planned Sunday Visitors ({bundleData.visitors.length})
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  downloadCsv(
                    'pefa-kenyatta-visitors.csv',
                    ['Name', 'Phone', 'Email', 'Preferred Date', 'Service', 'Guests', 'Notes'],
                    bundleData.visitors.map((v) => [
                      String(v.full_name || ''),
                      String(v.phone || ''),
                      String(v.email || ''),
                      String(v.preferred_date || ''),
                      String(v.preferred_service || ''),
                      Number(v.guests_count || 1),
                      String(v.notes || ''),
                    ])
                  )
                }
              >
                <Download className="h-3.5 w-3.5" /> <span>Download Visitors CSV</span>
              </Button>
            </div>
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {bundleData.visitors.map((v) => (
                <div key={String(v.id)} className="py-3 text-sm">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {String(v.full_name)} · <span className="font-mono-tabular">{String(v.phone)}</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {String(v.preferred_date)} · {String(v.preferred_service)} · {Number(v.guests_count || 1)} guest(s)
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Prayer &amp; Counselling Requests ({bundleData.prayerRequests.length})
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  downloadCsv(
                    'pefa-kenyatta-prayer-requests.csv',
                    ['Type', 'Name', 'Phone', 'Pastors Only', 'Request', 'Created At'],
                    bundleData.prayerRequests.map((p) => [
                      p.request_type,
                      p.full_name || 'Anonymous',
                      p.phone || '',
                      p.pastors_only ? 'Yes' : 'No',
                      p.request_text,
                      p.created_at,
                    ])
                  )
                }
              >
                <Download className="h-3.5 w-3.5" /> <span>Download Prayer CSV</span>
              </Button>
            </div>
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {bundleData.prayerRequests.map((p) => (
                <div key={p.id} className="py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge tone={p.pastors_only ? 'warning' : 'neutral'}>
                      {p.pastors_only ? 'Pastors Only' : 'Prayer Team'}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {p.request_type.toUpperCase()} · {p.full_name || 'Anonymous'}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-800 dark:text-slate-200">{p.request_text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB: GIVING */}
      {tab === 'giving' && (
        <Card className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">M-Pesa Giving Records</h2>
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={fundFilter}
                onChange={(e) => setFundFilter(e.target.value)}
                aria-label="Filter giving by fund"
                className="min-h-[42px] rounded-xl border border-slate-200 bg-[#FAFBFD] px-3 text-xs font-medium dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All Funds</option>
                <option value="Tithe">Tithe</option>
                <option value="Offering">Offering</option>
                <option value="Building Fund">Building Fund</option>
                <option value="Missions">Missions</option>
                <option value="Welfare">Welfare</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="month"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                aria-label="Filter giving by month"
                className="min-h-[42px] rounded-xl border border-slate-200 bg-[#FAFBFD] px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <Button
                size="sm"
                onClick={() =>
                  downloadCsv(
                    'pefa-kenyatta-giving-records.csv',
                    ['Date', 'Donor', 'Phone', 'Fund', 'Amount (KES)', 'Status', 'M-Pesa Receipt'],
                    filteredDonations.map((d) => [
                      d.created_at,
                      d.donor_name || 'Member',
                      d.phone,
                      d.fund,
                      d.amount,
                      d.status,
                      d.mpesa_receipt_number || '',
                    ])
                  )
                }
              >
                <Download className="h-3.5 w-3.5" /> <span>Export Giving CSV</span>
              </Button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="py-2.5 pr-4 font-semibold">Date</th>
                  <th className="py-2.5 pr-4 font-semibold">Donor</th>
                  <th className="py-2.5 pr-4 font-semibold">Phone</th>
                  <th className="py-2.5 pr-4 font-semibold">Fund</th>
                  <th className="py-2.5 pr-4 text-right font-semibold">Amount (KES)</th>
                  <th className="py-2.5 pr-4 font-semibold">Receipt</th>
                  <th className="py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="h-12">
                    <td className="py-2 pr-4 font-mono-tabular text-slate-600 dark:text-slate-300">
                      {new Date(d.created_at).toLocaleDateString('en-KE')}
                    </td>
                    <td className="py-2 pr-4 font-medium text-slate-900 dark:text-white">{d.donor_name || 'Member'}</td>
                    <td className="py-2 pr-4 font-mono-tabular text-slate-600 dark:text-slate-300">{d.phone}</td>
                    <td className="py-2 pr-4 text-slate-700 dark:text-slate-200">{d.fund}</td>
                    <td className="py-2 pr-4 text-right font-mono-tabular font-semibold text-slate-900 dark:text-white">
                      {Number(d.amount).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4 font-mono-tabular text-slate-600 dark:text-slate-300">
                      {d.mpesa_receipt_number || '—'}
                    </td>
                    <td className="py-2">
                      <Badge tone={d.status === 'completed' ? 'success' : d.status === 'pending' ? 'warning' : 'error'}>
                        {d.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB: STAFF GUIDE */}
      {tab === 'guide' && (
        <Card padding="lg" className="mt-6">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Quick Guide for Church Staff
          </h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <li>
              <strong>Sunday Live Stream:</strong> Go to <em>Live &amp; Overview</em>, paste the Sunday YouTube or Facebook link, tap <em>LIVE: ON</em>, and save. Turn it back <em>OFF</em> after service.
            </li>
            <li>
              <strong>Weekly Sermon Upload:</strong> Tap <em>Add Sermon</em> above, enter the title, preacher, scripture, and YouTube link. Study notes are generated automatically.
            </li>
            <li>
              <strong>Safe Deletions:</strong> Every delete button asks for confirmation first so nothing is lost accidentally.
            </li>
            <li>
              <strong>Treasury Reports:</strong> Open <em>View Giving</em>, filter by fund or month, and tap <em>Export Giving CSV</em>.
            </li>
          </ol>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Confirm Removal"
        message={`Are you sure you want to remove "${pendingDelete?.label || ''}"? This cannot be undone.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
