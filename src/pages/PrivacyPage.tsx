import React from 'react';
import {ShieldCheck} from 'lucide-react';
import {CHURCH_CONFIG} from '../config/church';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2 text-[#1E3A8A] dark:text-amber-400">
        <ShieldCheck className="h-5 w-5" />
        <span className="text-xs font-semibold">Kenya Data Protection Act (2019) Compliance</span>
      </div>
      <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
        Data Protection &amp; Privacy Notice
      </h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        Effective Date: November 2026 · Data Controller: {CHURCH_CONFIG.name}, {CHURCH_CONFIG.address}
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <section>
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            1. What Information We Collect
          </h2>
          <p className="mt-2">
            When you voluntarily submit a form (Plan My Visit, Ministry/Cell Group Sign-up, Prayer Request, Testimony, Event RSVP, or M-Pesa Giving), we collect only the details needed for that purpose: your name, phone number, email (optional), and any message you write.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            2. Lawful Basis &amp; Purpose of Processing
          </h2>
          <p className="mt-2">
            In accordance with the Kenya Data Protection Act, 2019, we process your personal data strictly on the basis of your explicit consent and legitimate pastoral care obligations—such as welcoming visitors, coordinating small groups, praying over requests, and issuing church stewardship records. We never sell or share member contacts with third-party marketers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            3. M-Pesa &amp; Financial Privacy
          </h2>
          <p className="mt-2">
            M-Pesa STK Push payments are processed directly by Safaricom Daraja APIs. Your M-Pesa PIN is never entered on or visible to our website. We store only the phone number, amount, fund designation, and Safaricom receipt reference for church treasury accountability.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            4. Pastoral Confidentiality
          </h2>
          <p className="mt-2">
            Prayer and counselling requests marked “Pastors Only” are restricted by Row Level Security policies and visible solely to authorized pastoral leadership.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            5. Your Rights as a Data Subject
          </h2>
          <p className="mt-2">
            You have the right to access, correct, opt out of SMS/WhatsApp announcements, or request deletion of your personal records at any time by contacting the church office at{' '}
            <span className="font-mono-tabular font-semibold">{CHURCH_CONFIG.email}</span> or{' '}
            <span className="font-mono-tabular font-semibold">{CHURCH_CONFIG.phone}</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
