import type {Language} from '../types/church';

export const TRANSLATIONS: Record<Language, {
  nav: {
    home: string;
    visit: string;
    sermons: string;
    events: string;
    ministries: string;
    give: string;
    groups: string;
    prayer: string;
    testimonies: string;
    about: string;
    news: string;
    contact: string;
    member: string;
    admin: string;
    privacy: string;
    menu: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    nextService: string;
    ctaNew: string;
    ctaGive: string;
    liveNow: string;
    watchLive: string;
  };
  sections: {
    serviceTimes: string;
    dailyVerse: string;
    latestSermon: string;
    upcomingEvents: string;
    announcements: string;
    pastorWelcome: string;
    pastorWelcomeLead: string;
    viewAllSermons: string;
    viewAllEvents: string;
    planVisit: string;
    giveOnline: string;
    offlineSaved: string;
  };
  forms: {
    consentLabel: string;
    privacyLink: string;
    submit: string;
    submitting: string;
    successTitle: string;
  };
  footer: {
    rights: string;
    addressLabel: string;
    quickLinks: string;
    connect: string;
    dataProtection: string;
  };
}> = {
  en: {
    nav: {
      home: 'Home',
      visit: "I'm New",
      sermons: 'Sermons',
      events: 'Events',
      ministries: 'Ministries',
      give: 'Give',
      groups: 'Cell Groups',
      prayer: 'Prayer',
      testimonies: 'Testimonies',
      about: 'About',
      news: 'News',
      contact: 'Contact',
      member: 'Member Portal',
      admin: 'Admin',
      privacy: 'Data Protection',
      menu: 'More',
    },
    hero: {
      kicker: 'PEFA Church · Kenyatta Branch, Nairobi',
      title: 'A warm church family rooted in Christ and hope.',
      subtitle:
        'Whether this is your first Sunday in Nairobi or you are looking for a home church near Kenyatta Market and Mbagathi Way, there is a seat waiting for you.',
      nextService: 'Next Sunday Worship · 8:00 AM & 10:30 AM',
      ctaNew: "I'm New Here",
      ctaGive: 'Give via M-Pesa',
      liveNow: 'We are live now',
      watchLive: 'Watch Service',
    },
    sections: {
      serviceTimes: 'Weekly Gatherings',
      dailyVerse: 'Daily Word & Devotional',
      latestSermon: 'Latest Sunday Message',
      upcomingEvents: 'Upcoming Events',
      announcements: 'Church Announcements',
      pastorWelcome: 'A Word from Our Senior Pastor',
      pastorWelcomeLead:
        'Karibu nyumbani! At PEFA Kenyatta, we believe the Gospel meets real life—strengthening families, raising young leaders, and serving our neighbors with practical compassion.',
      viewAllSermons: 'Browse Sermon Library',
      viewAllEvents: 'Full Events Calendar',
      planVisit: 'Plan Your Sunday Visit',
      giveOnline: 'Give with M-Pesa',
      offlineSaved: 'Service times & contacts are cached offline for Sunday morning.',
    },
    forms: {
      consentLabel:
        'I consent to PEFA Church Kenyatta storing and processing my details solely for pastoral care, church communication, and administration in line with the Kenya Data Protection Act (2019).',
      privacyLink: 'Read Privacy Notice',
      submit: 'Submit',
      submitting: 'Sending...',
      successTitle: 'Asante! Received safely.',
    },
    footer: {
      rights: 'PEFA Church, Kenyatta Branch · Pentecostal Evangelistic Fellowship of Africa.',
      addressLabel: 'Location & Directions',
      quickLinks: 'Church Life',
      connect: 'Care & Portal',
      dataProtection: 'Kenya Data Protection Notice',
    },
  },
  sw: {
    nav: {
      home: 'Nyumbani',
      visit: 'Mimi ni Mgeni',
      sermons: 'Mahubiri',
      events: 'Matukio',
      ministries: 'Huduma',
      give: 'Toa Sadaka',
      groups: 'Vikundi vya Nyumba',
      prayer: 'Maombi',
      testimonies: 'Shuhuda',
      about: 'Kuhusu Sisi',
      news: 'Habari',
      contact: 'Wasiliana',
      member: 'Mwanachama',
      admin: 'Usimamizi',
      privacy: 'Ulinzi wa Data',
      menu: 'Zaidi',
    },
    hero: {
      kicker: 'Kanisa la PEFA · Tawi la Kenyatta, Nairobi',
      title: 'Familia ya kanisa yenye upendo, neno la Mungu na tumaini.',
      subtitle:
        'Iwe ni Jumapili yako ya kwanza Nairobi au unatafuta kanisa la nyumbani karibu na Kenyatta Market na Mbagathi Way, tunakukaribisha kwa mikono miwili.',
      nextService: 'Ibada ya Jumapili · Saa 2:00 Asubuhi & Saa 4:30 Asubuhi',
      ctaNew: 'Mimi ni Mgeni',
      ctaGive: 'Toa kwa M-Pesa',
      liveNow: 'Tuko Mubashara Sasa',
      watchLive: 'Tazama Ibada',
    },
    sections: {
      serviceTimes: 'Ratiba ya Ibada za Wiki',
      dailyVerse: 'Neno la Leo',
      latestSermon: 'Ujumbe wa Hivi Karibuni',
      upcomingEvents: 'Matukio Yajayo',
      announcements: 'Matangazo ya Kanisa',
      pastorWelcome: 'Ujumbe wa Karibu kutoka kwa Mchungaji',
      pastorWelcomeLead:
        'Karibu nyumbani! Katika PEFA Kenyatta, tunaamini Injili inagusa maisha ya kila siku—kuimarisha familia, kulea vijana, na kuhudumia majirani zetu kwa upendo.',
      viewAllSermons: 'Tazama Mahubiri Yote',
      viewAllEvents: 'Kalenda ya Matukio',
      planVisit: 'Panga Ziara Yako',
      giveOnline: 'Toa kupitia M-Pesa',
      offlineSaved: 'Ratiba ya ibada na mawasiliano yamehifadhiwa hata bila mtandao.',
    },
    forms: {
      consentLabel:
        'Nakubali Kanisa la PEFA Kenyatta lihifadhi na kutumia taarifa zangu kwa huduma ya kichungaji na mawasiliano ya kanisa pekee kulingana na Sheria ya Ulinzi wa Data Kenya (2019).',
      privacyLink: 'Soma Sera ya Faragha',
      submit: 'Tuma',
      submitting: 'Inatuma...',
      successTitle: 'Asante! Taarifa imepokelewa.',
    },
    footer: {
      rights: 'Kanisa la PEFA, Tawi la Kenyatta · Pentecostal Evangelistic Fellowship of Africa.',
      addressLabel: 'Mahali Tulipo',
      quickLinks: 'Maisha ya Kanisa',
      connect: 'Huduma na Mwanachama',
      dataProtection: 'Ilani ya Ulinzi wa Data Kenya',
    },
  },
};
