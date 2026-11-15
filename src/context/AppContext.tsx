import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {fetchPublicChurchData} from '../lib/dataService';
import {isSupabaseConfigured, supabase} from '../lib/supabase';
import {TRANSLATIONS} from '../i18n/translations';
import type {ToastItem} from '../components/ui';
import type {Language, PageRoute, PublicChurchBundle, Sermon, UserProfile, UserRole} from '../types/church';

interface AppContextValue {
  route: PageRoute;
  navigate: (next: PageRoute) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof TRANSLATIONS)['en'];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  bundle: PublicChurchBundle | null;
  loadingBundle: boolean;
  bundleError: string | null;
  refreshBundle: () => Promise<void>;
  user: UserProfile | null;
  savedSermonIds: string[];
  toggleSavedSermon: (sermonId: string) => void;
  signInDemoMember: (role: UserRole, fullName?: string, phone?: string, email?: string) => void;
  signOutUser: () => Promise<void>;
  adminPasscode: string;
  setAdminPasscode: (code: string) => void;
  directoryOpen: boolean;
  setDirectoryOpen: (open: boolean) => void;
  toast: ToastItem | null;
  showToast: (message: string, tone?: 'success' | 'error') => void;
  dismissToast: () => void;
  activeSermon: Sermon | null;
  setActiveSermon: (sermon: Sermon | null) => void;
  sermonProgress: Record<string, number>;
  saveSermonProgress: (sermonId: string, seconds: number) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const VALID_ROUTES = new Set<PageRoute>([
  'home',
  'visit',
  'about',
  'ministries',
  'sermons',
  'events',
  'groups',
  'give',
  'prayer',
  'testimonies',
  'news',
  'contact',
  'member',
  'admin',
  'privacy',
]);

function getRouteFromLocation(): PageRoute {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('page') as PageRoute | null;
  if (p && VALID_ROUTES.has(p)) return p;
  return 'home';
}

export const AppProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [route, setRoute] = useState<PageRoute>(getRouteFromLocation);
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('pefa_lang');
    return saved === 'sw' ? 'sw' : 'en';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('pefa_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });
  const [bundle, setBundle] = useState<PublicChurchBundle | null>(null);
  const [loadingBundle, setLoadingBundle] = useState(true);
  const [bundleError, setBundleError] = useState<string | null>(null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [toast, setToast] = useState<ToastItem | null>(null);

  const [activeSermon, setActiveSermonState] = useState<Sermon | null>(() => {
    try {
      const raw = localStorage.getItem('pefa_active_sermon');
      return raw ? (JSON.parse(raw) as Sermon) : null;
    } catch {
      return null;
    }
  });

  const [sermonProgress, setSermonProgress] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem('pefa_sermon_progress');
      return raw ? (JSON.parse(raw) as Record<string, number>) : {};
    } catch {
      return {};
    }
  });

  const [savedSermonIds, setSavedSermonIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('pefa_saved_sermons');
      return raw ? (JSON.parse(raw) as string[]) : ['sermon-1'];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const raw = localStorage.getItem('pefa_member_profile');
      return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
      return null;
    }
  });

  const [adminPasscode, setAdminPasscodeState] = useState<string>(
    () => sessionStorage.getItem('pefa_admin_passcode') || ''
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('pefa_theme', theme);
  }, [theme]);

  const setLang = (next: Language) => {
    setLangState(next);
    localStorage.setItem('pefa_lang', next);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = useCallback((message: string, tone: 'success' | 'error' = 'success') => {
    setToast({message, tone});
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  const setActiveSermon = useCallback((sermon: Sermon | null) => {
    setActiveSermonState(sermon);
    if (sermon) localStorage.setItem('pefa_active_sermon', JSON.stringify(sermon));
    else localStorage.removeItem('pefa_active_sermon');
  }, []);

  const saveSermonProgress = useCallback((sermonId: string, seconds: number) => {
    setSermonProgress((prev) => {
      const next = {...prev, [sermonId]: Math.floor(seconds)};
      localStorage.setItem('pefa_sermon_progress', JSON.stringify(next));
      return next;
    });
  }, []);

  const navigate = useCallback((next: PageRoute) => {
    setRoute(next);
    setDirectoryOpen(false);
    const url = next === 'home' ? '/' : `/?page=${next}`;
    window.history.pushState({page: next}, '', url);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, []);

  useEffect(() => {
    const onPopState = () => setRoute(getRouteFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const refreshBundle = useCallback(async () => {
    setLoadingBundle(true);
    setBundleError(null);
    try {
      const data = await fetchPublicChurchData();
      setBundle(data);
    } catch (err) {
      setBundleError(err instanceof Error ? err.message : 'Could not load church updates. Please check your connection.');
    } finally {
      setLoadingBundle(false);
    }
  }, []);

  useEffect(() => {
    refreshBundle();
  }, [refreshBundle]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.auth.getUser().then(({data}) => {
      if (data.user) {
        setUser({
          id: data.user.id,
          full_name: (data.user.user_metadata?.full_name as string) || 'PEFA Member',
          phone: data.user.phone || (data.user.user_metadata?.phone as string) || '',
          email: data.user.email || '',
          role: 'member',
          sms_opt_in: true,
          whatsapp_opt_in: true,
          saved_sermon_ids: savedSermonIds,
          created_at: data.user.created_at,
        });
      }
    });
  }, [savedSermonIds]);

  const toggleSavedSermon = (sermonId: string) => {
    setSavedSermonIds((prev) => {
      const exists = prev.includes(sermonId);
      const next = exists ? prev.filter((id) => id !== sermonId) : [...prev, sermonId];
      localStorage.setItem('pefa_saved_sermons', JSON.stringify(next));
      showToast(exists ? 'Removed from saved sermons.' : 'Sermon saved to your Member Portal.');
      return next;
    });
  };

  const signInDemoMember = (role: UserRole, fullName?: string, phone?: string, email?: string) => {
    const profile: UserProfile = {
      id: `member-${Date.now()}`,
      full_name: fullName || (role === 'admin' ? 'Rev. David Mwangi' : 'Mercy Wanjiru'),
      phone: phone || '+254722111222',
      email: email || (role === 'admin' ? 'pastor@pefakenyatta.org' : 'mercy@pefakenyatta.org'),
      role,
      small_group_id: 'sg-1',
      sms_opt_in: true,
      whatsapp_opt_in: true,
      saved_sermon_ids: savedSermonIds,
      created_at: new Date().toISOString(),
    };
    setUser(profile);
    localStorage.setItem('pefa_member_profile', JSON.stringify(profile));
  };

  const signOutUser = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('pefa_member_profile');
  };

  const setAdminPasscode = (code: string) => {
    setAdminPasscodeState(code);
    if (code) sessionStorage.setItem('pefa_admin_passcode', code);
    else sessionStorage.removeItem('pefa_admin_passcode');
  };

  return (
    <AppContext.Provider
      value={{
        route,
        navigate,
        lang,
        setLang,
        t: TRANSLATIONS[lang],
        theme,
        toggleTheme,
        bundle,
        loadingBundle,
        bundleError,
        refreshBundle,
        user,
        savedSermonIds,
        toggleSavedSermon,
        signInDemoMember,
        signOutUser,
        adminPasscode,
        setAdminPasscode,
        directoryOpen,
        setDirectoryOpen,
        toast,
        showToast,
        dismissToast: () => setToast(null),
        activeSermon,
        setActiveSermon,
        sermonProgress,
        saveSermonProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
