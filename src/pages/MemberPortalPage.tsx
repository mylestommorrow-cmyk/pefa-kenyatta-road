import React, {useEffect, useState} from 'react';
import {Bookmark, HeartHandshake, LogOut, UserCheck, Users} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {fetchMemberDonations} from '../lib/dataService';
import {isSupabaseConfigured, supabase} from '../lib/supabase';
import type {DonationRecord, UserRole} from '../types/church';

export const MemberPortalPage: React.FC = () => {
  const {user, signInDemoMember, signOutUser, bundle, savedSermonIds, toggleSavedSermon, navigate} = useApp();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [authMsg, setAuthMsg] = useState('');
  const [donations, setDonations] = useState<DonationRecord[]>([]);

  useEffect(() => {
    if (user?.phone) {
      fetchMemberDonations(user.phone).then(setDonations).catch(() => setDonations([]));
    }
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMsg('');
    if (isSupabaseConfigured && supabase && email) {
      const {error} = await supabase.auth.signInWithOtp({
        email,
        options: {data: {full_name: fullName, phone}},
      });
      if (error) {
        setAuthMsg(error.message);
        return;
      }
      setAuthMsg('Check your email for your Supabase magic sign-in link.');
      return;
    }
    signInDemoMember(role, fullName || 'Mercy Wanjiru', phone || '+254722111222', email || 'mercy@pefakenyatta.org');
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-white/60 bg-white/78 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/74 sm:p-8">
          <div className="flex items-center gap-2 text-[#1E3A8A] dark:text-amber-400">
            <UserCheck className="h-5 w-5" />
            <span className="text-xs font-semibold">PEFA Kenyatta Member Portal</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
            Sign in to your Member Hub
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            View your M-Pesa giving history, cell group details, and saved sermons.
          </p>

          <form onSubmit={handleSignIn} className="mt-6 space-y-3.5">
            {authMsg && <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">{authMsg}</p>}
            <input
              placeholder="Full Name (e.g. Mercy Wanjiru)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <input
              type="tel"
              placeholder="M-Pesa Phone (e.g. 0722 111 222)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 font-mono-tabular text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Portal Role (Preview RBAC)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="mt-1 w-full min-h-[42px] rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="visitor">Visitor</option>
                <option value="member">Member</option>
                <option value="ministry_leader">Ministry Leader</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="min-h-[48px] w-full rounded-xl bg-[#1E3A8A] px-4 text-sm font-semibold text-white hover:bg-[#172D6E] dark:bg-amber-500 dark:text-slate-950"
            >
              Continue to Member Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  const savedSermons = (bundle?.sermons || []).filter((s) => savedSermonIds.includes(s.id));
  const myGroup = bundle?.smallGroups?.find((g) => g.id === user.small_group_id) || bundle?.smallGroups?.[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A] dark:text-amber-400">
            Role: {user.role.replace('_', ' ')}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-slate-900 dark:text-white">
            Karibu, {user.full_name}
          </h1>
          <p className="mt-1 font-mono-tabular text-xs text-slate-500 dark:text-slate-400">
            {user.phone} · {user.email}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {user.role === 'admin' && (
            <button
              type="button"
              onClick={() => navigate('admin')}
              className="min-h-[42px] rounded-xl bg-[#1E3A8A] px-4 text-xs font-semibold text-white dark:bg-amber-500 dark:text-slate-950"
            >
              Open Admin Dashboard
            </button>
          )}
          <button
            type="button"
            onClick={signOutUser}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* My Giving History */}
        <div className="rounded-2xl border border-white/60 bg-white/76 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72 lg:col-span-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-[#1E3A8A] dark:text-amber-400" />
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                My M-Pesa Giving History
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('give')}
              className="min-h-[38px] rounded-lg bg-[#1E3A8A] px-3.5 text-xs font-semibold text-white dark:bg-amber-500 dark:text-slate-950"
            >
              Give Now
            </button>
          </div>

          {donations.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              No M-Pesa giving records found for <span className="font-mono-tabular">{user.phone}</span> yet. Give via M-Pesa using this phone number to track receipts here.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {donations.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{d.fund}</p>
                    <p className="font-mono-tabular text-xs text-slate-500 dark:text-slate-400">
                      {new Date(d.created_at).toLocaleDateString('en-KE')} · Receipt: {d.mpesa_receipt_number || d.status}
                    </p>
                  </div>
                  <p className="font-mono-tabular font-bold text-slate-900 dark:text-white">
                    KES {Number(d.amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Small Group & Saved Sermons */}
        <div className="space-y-6 lg:col-span-5">
          {myGroup && (
            <div className="rounded-2xl border border-white/60 bg-white/76 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72">
              <div className="flex items-center gap-2 text-[#1E3A8A] dark:text-amber-400">
                <Users className="h-5 w-5" />
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  My Cell Group
                </h2>
              </div>
              <p className="mt-3 font-semibold text-slate-900 dark:text-white">{myGroup.name}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                {myGroup.area} · {myGroup.meeting_day} at {myGroup.meeting_time}
              </p>
              <p className="mt-1 font-mono-tabular text-xs text-slate-500 dark:text-slate-400">
                Host: {myGroup.host_name} ({myGroup.contact_phone})
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-white/60 bg-white/76 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72">
            <div className="flex items-center gap-2 text-[#1E3A8A] dark:text-amber-400">
              <Bookmark className="h-5 w-5" />
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Saved Sermons ({savedSermons.length})
              </h2>
            </div>
            {savedSermons.length === 0 ? (
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                Bookmark messages in the Sermon Library to revisit them here.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                {savedSermons.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{s.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.preacher} · {s.scripture}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSavedSermon(s.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
