// Internationalization (i18n) module for GlowRep
// Supports English and Hindi with easy extensibility for regional languages

export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    'nav.master': 'Master HQ',
    'nav.nodal': 'Nodal Manager',
    'nav.admin': 'Gym Admin',
    'nav.logout': 'Logout',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalMembers': 'Total Members',
    'dashboard.activeMembers': 'Active Members',
    'dashboard.expiredMembers': 'Expired Members',
    'dashboard.todayCheckins': "Today's Check-ins",
    'dashboard.revenue': 'Revenue',
    'dashboard.monthlyRevenue': 'Monthly Revenue',

    // Members
    'members.title': 'Members',
    'members.add': 'Add Member',
    'members.name': 'Name',
    'members.phone': 'Phone',
    'members.email': 'Email',
    'members.status': 'Status',
    'members.active': 'Active',
    'members.expired': 'Expired',
    'members.search': 'Search members...',
    'members.membershipExpiry': 'Membership Expiry',

    // Check-in
    'checkin.title': 'Check-In',
    'checkin.scan': 'Scan QR Code',
    'checkin.manual': 'Manual Check-in',
    'checkin.success': 'Check-in successful!',
    'checkin.offlineSuccess': 'Check-in saved offline. Will sync when connected.',
    'checkin.pendingSync': 'Pending Sync',

    // Payments
    'payments.title': 'Payments',
    'payments.createLink': 'Create Payment Link',
    'payments.logCash': 'Log Cash Payment',
    'payments.amount': 'Amount (₹)',
    'payments.method': 'Payment Method',
    'payments.cash': 'Cash',
    'payments.upi': 'UPI',
    'payments.reconciliation': 'Daily Reconciliation',
    'payments.cashTotal': 'Cash Total',
    'payments.upiTotal': 'UPI Total',
    'payments.grandTotal': 'Grand Total',

    // Trainers
    'trainer.title': 'Trainer Dashboard',
    'trainer.assignedMembers': 'Assigned Members',
    'trainer.todaySchedule': 'Today\'s Schedule',
    'trainer.workoutPlan': 'Workout Plan',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.noData': 'No data available',
    'common.online': 'Online',
    'common.offline': 'Offline',
    'common.syncNow': 'Sync Now',
    'common.language': 'Language',
  },

  hi: {
    // Navigation
    'nav.master': 'मास्टर HQ',
    'nav.nodal': 'नोडल मैनेजर',
    'nav.admin': 'जिम एडमिन',
    'nav.logout': 'लॉगआउट',

    // Dashboard
    'dashboard.title': 'डैशबोर्ड',
    'dashboard.totalMembers': 'कुल सदस्य',
    'dashboard.activeMembers': 'सक्रिय सदस्य',
    'dashboard.expiredMembers': 'समाप्त सदस्य',
    'dashboard.todayCheckins': 'आज की चेक-इन',
    'dashboard.revenue': 'राजस्व',
    'dashboard.monthlyRevenue': 'मासिक राजस्व',

    // Members
    'members.title': 'सदस्य',
    'members.add': 'सदस्य जोड़ें',
    'members.name': 'नाम',
    'members.phone': 'फ़ोन',
    'members.email': 'ईमेल',
    'members.status': 'स्थिति',
    'members.active': 'सक्रिय',
    'members.expired': 'समाप्त',
    'members.search': 'सदस्य खोजें...',
    'members.membershipExpiry': 'सदस्यता समाप्ति',

    // Check-in
    'checkin.title': 'चेक-इन',
    'checkin.scan': 'QR कोड स्कैन करें',
    'checkin.manual': 'मैन्युअल चेक-इन',
    'checkin.success': 'चेक-इन सफल!',
    'checkin.offlineSuccess': 'चेक-इन ऑफ़लाइन सेव हो गई। कनेक्ट होने पर सिंक होगी।',
    'checkin.pendingSync': 'सिंक बाकी',

    // Payments
    'payments.title': 'भुगतान',
    'payments.createLink': 'भुगतान लिंक बनाएं',
    'payments.logCash': 'नकद भुगतान दर्ज करें',
    'payments.amount': 'राशि (₹)',
    'payments.method': 'भुगतान विधि',
    'payments.cash': 'नकद',
    'payments.upi': 'UPI',
    'payments.reconciliation': 'दैनिक हिसाब',
    'payments.cashTotal': 'नकद कुल',
    'payments.upiTotal': 'UPI कुल',
    'payments.grandTotal': 'कुल योग',

    // Trainers
    'trainer.title': 'ट्रेनर डैशबोर्ड',
    'trainer.assignedMembers': 'निर्धारित सदस्य',
    'trainer.todaySchedule': 'आज का शेड्यूल',
    'trainer.workoutPlan': 'वर्कआउट प्लान',

    // Common
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.loading': 'लोड हो रहा है...',
    'common.noData': 'कोई डेटा उपलब्ध नहीं',
    'common.online': 'ऑनलाइन',
    'common.offline': 'ऑफ़लाइन',
    'common.syncNow': 'अभी सिंक करें',
    'common.language': 'भाषा',
  },
};

// Current language state
let currentLanguage: Language = (localStorage.getItem('glowrep_lang') as Language) || 'en';

/**
 * Get a translated string by key.
 */
export function t(key: string): string {
  return translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
}

/**
 * Get the current language.
 */
export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * Set the language and persist to localStorage.
 */
export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  localStorage.setItem('glowrep_lang', lang);
  // Dispatch a custom event so React components can re-render
  window.dispatchEvent(new CustomEvent('language-change', { detail: lang }));
}

/**
 * Toggle between English and Hindi.
 */
export function toggleLanguage(): Language {
  const newLang = currentLanguage === 'en' ? 'hi' : 'en';
  setLanguage(newLang);
  return newLang;
}

export default translations;
