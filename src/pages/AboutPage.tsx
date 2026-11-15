import React from 'react';
import {CHURCH_CONFIG} from '../config/church';
import {useApp} from '../context/AppContext';
import {SafeImage} from '../components/SafeImage';

const STATEMENT_OF_FAITH = [
  {
    title: 'The Holy Scriptures',
    body: 'We believe the Bible is the inspired, infallible Word of God and our final authority in faith, worship, and daily living.',
  },
  {
    title: 'One Triune God',
    body: 'We believe in one God eternally existent in three persons: Father, Son (Jesus Christ), and Holy Spirit.',
  },
  {
    title: 'Salvation Through Jesus Christ',
    body: 'We believe salvation is a gift of grace received through repentance and faith in the death and resurrection of Jesus Christ.',
  },
  {
    title: 'The Holy Spirit & Spiritual Gifts',
    body: 'We believe in the present-day ministry of the Holy Spirit, empowering believers for holiness, witness, and compassionate service.',
  },
];

export const AboutPage: React.FC = () => {
  const {bundle, lang} = useApp();
  const leaders = bundle?.leaders || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
          {CHURCH_CONFIG.denomination}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {lang === 'sw' ? 'Kuhusu PEFA Tawi la Kenyatta' : 'Rooted in the Word, serving Kenyatta & Nairobi'}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Founded under the Pentecostal Evangelistic Fellowship of Africa (PEFA), the Kenyatta Branch began as a neighborhood prayer fellowship near Kenyatta Market and has grown into a vibrant multi-generational congregation serving families across Kenyatta Estate, Ngumo, Woodley, and Kenyatta National Hospital.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/60 bg-white/76 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72">
          <p className="text-xs font-semibold text-[#B45309] dark:text-amber-400">Our Vision</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
            A Christ-centered family transforming Nairobi and beyond.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            We envision homes anchored in Scripture, young people walking with integrity, and neighborhoods experiencing tangible love through our local church.
          </p>
        </div>

        <div className="rounded-2xl border border-white/60 bg-white/76 p-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72">
          <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">Our Mission</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
            Worship passionately, disciple faithfully, serve compassionately.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Through Sunday worship, midweek home cells, youth mentorship, and hospital/community outreach, we equip every believer to follow Jesus in everyday life.
          </p>
        </div>
      </div>

      {/* Statement of Faith */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Statement of Faith
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {STATEMENT_OF_FAITH.map((item, idx) => (
            <div key={item.title} className="rounded-xl border border-white/60 bg-white/76 p-5 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                0{idx + 1}. {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Pastoral &amp; Church Leadership
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Accountable spiritual oversight and transparent stewardship for PEFA Kenyatta.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((leader) => (
            <article
              key={leader.id}
              className="overflow-hidden rounded-2xl border border-white/60 bg-white/76 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72"
            >
              <div className="aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <SafeImage
                  src={leader.photo_url}
                  alt={leader.full_name}
                  className="h-full w-full object-cover"
                  fallbackTitle={leader.full_name}
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
                  {lang === 'sw' && leader.role_title_sw ? leader.role_title_sw : leader.role_title}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">
                  {leader.full_name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {leader.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
