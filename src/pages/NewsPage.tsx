import React, {useState} from 'react';
import {ArrowLeft} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {SafeImage} from '../components/SafeImage';
import type {NewsPost} from '../types/church';

export const NewsPage: React.FC = () => {
  const {bundle, lang} = useApp();
  const posts = bundle?.posts || [];
  const [activePost, setActivePost] = useState<NewsPost | null>(null);

  if (activePost) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <button
          type="button"
          onClick={() => setActivePost(null)}
          className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:underline dark:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all church news</span>
        </button>

        <p className="mt-6 font-mono-tabular text-xs text-slate-500 dark:text-slate-400">
          {activePost.published_at} · By {activePost.author}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
          {activePost.title}
        </h1>

        {activePost.cover_image_url && (
          <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <SafeImage src={activePost.cover_image_url} alt={activePost.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <p className="font-medium text-slate-900 dark:text-white">{activePost.excerpt}</p>
          <p className="whitespace-pre-line">{activePost.content}</p>
        </div>
      </article>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-[#1E3A8A] dark:text-amber-400">
          {lang === 'sw' ? 'Habari na Taarifa' : 'Church Updates & Stories'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {lang === 'sw' ? 'Habari za PEFA Kenyatta' : 'News & Community Stories'}
        </h1>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/60 bg-white/76 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/72">
            <div>
              <div className="aspect-[16/9] w-full overflow-hidden">
                <SafeImage
                  src={post.cover_image_url}
                  alt={post.title}
                  className="h-full w-full object-cover"
                  fallbackTitle={post.title}
                />
              </div>
              <div className="p-6">
                <p className="font-mono-tabular text-xs text-slate-500 dark:text-slate-400">
                  {post.published_at} · {post.author}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {post.excerpt}
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActivePost(post)}
                className="min-h-[40px] text-xs font-semibold text-[#1E3A8A] hover:underline dark:text-amber-400"
              >
                Read full update
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
