import React, { createContext, useContext, useMemo } from 'react';
import { useLocale } from 'react-aria';

/**
 * Every piece of text Spark UI writes itself: button labels, screen-reader
 * names, empty states, file-upload errors. Components pick the table for the
 * current locale (`SparkProvider locale="hi-IN"`), and `SparkProvider
 * messages={{ … }}` overrides any key, so you can fix a wording or add a
 * language without waiting for a release.
 *
 * Numbers inside messages arrive already formatted for the locale, so
 * `hi-IN-u-nu-deva` gives Devanagari digits.
 */
export interface SparkMessages {
  close: string;
  dismiss: string;
  clear: string;
  loading: string;
  noResults: string;
  noOptions: string;
  selectPlaceholder: string;
  search: string;
  searchNamed: (name: string) => string;
  notifications: string;
  dismissNotification: string;
  // navigation
  breadcrumb: string;
  moreItems: (n: string) => string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  page: (n: string) => string;
  pageOf: (page: string, count: string) => string;
  rowsPerPage: string;
  mainNavigation: string;
  expandSidebar: string;
  collapseSidebar: string;
  progress: string;
  stepOf: (n: string, total: string) => string;
  stepStatus: { complete: string; current: string; upcoming: string; error: string };
  // dates and times
  today: string;
  thisWeek: string;
  thisMonth: string;
  thisYear: string;
  /** "Next 7 days": `amount` is already a localized "7 days". */
  nextAmount: (amount: string) => string;
  lastAmount: (amount: string) => string;
  clearDate: string;
  clearDates: string;
  clearTime: string;
  showTimes: string;
  times: string;
  // command palette
  commandPalette: string;
  commandPlaceholder: string;
  commands: string;
  searchCommands: string;
  // file upload
  dropFiles: (multiple: boolean) => string;
  browse: string;
  files: string;
  uploaded: string;
  uploading: (name: string) => string;
  uploadFailed: string;
  remove: (name: string) => string;
  fileTypeRejected: (name: string) => string;
  fileTooLarge: (name: string, max: string) => string;
  tooManyFiles: (name: string, max: string) => string;
  upTo: (size: string) => string;
  maxFiles: (n: string) => string;
  // data display
  dataTable: string;
  series: string;
  chart: string;
  total: string;
}

const en: SparkMessages = {
  close: 'Close',
  dismiss: 'Dismiss',
  clear: 'Clear',
  loading: 'Loading',
  noResults: 'No results',
  noOptions: 'No options',
  selectPlaceholder: 'Select an option',
  search: 'Search…',
  searchNamed: (name) => `Search ${name}`,
  notifications: 'Notifications',
  dismissNotification: 'Dismiss notification',
  breadcrumb: 'Breadcrumb',
  moreItems: (n) => `${n} more`,
  pagination: 'Pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: (n) => `Page ${n}`,
  pageOf: (p, c) => `Page ${p} of ${c}`,
  rowsPerPage: 'Rows per page',
  mainNavigation: 'Main',
  expandSidebar: 'Expand sidebar',
  collapseSidebar: 'Collapse sidebar',
  progress: 'Progress',
  stepOf: (n, t) => `Step ${n} of ${t}`,
  stepStatus: { complete: 'completed', current: 'current', upcoming: 'not started', error: 'has an error' },
  today: 'Today',
  thisWeek: 'This week',
  thisMonth: 'This month',
  thisYear: 'This year',
  nextAmount: (a) => `Next ${a}`,
  lastAmount: (a) => `Last ${a}`,
  clearDate: 'Clear date',
  clearDates: 'Clear dates',
  clearTime: 'Clear time',
  showTimes: 'Show times',
  times: 'Times',
  commandPalette: 'Command palette',
  commandPlaceholder: 'Type a command or search…',
  commands: 'Commands',
  searchCommands: 'Search commands',
  dropFiles: (m) => (m ? 'Drop files here or' : 'Drop a file here or'),
  browse: 'browse',
  files: 'Files',
  uploaded: 'Uploaded',
  uploading: (name) => `Uploading ${name}`,
  uploadFailed: 'Upload failed',
  remove: (name) => `Remove ${name}`,
  fileTypeRejected: (name) => `${name}: this file type isn't accepted.`,
  fileTooLarge: (name, max) => `${name}: larger than ${max}.`,
  tooManyFiles: (name, max) => `${name}: you can add up to ${max} files.`,
  upTo: (s) => `up to ${s}`,
  maxFiles: (n) => `max ${n} files`,
  dataTable: 'Data table',
  series: 'Series',
  chart: 'Chart',
  total: 'Total',
};

const hi: SparkMessages = {
  close: 'बंद करें',
  dismiss: 'हटाएँ',
  clear: 'साफ़ करें',
  loading: 'लोड हो रहा है',
  noResults: 'कोई परिणाम नहीं',
  noOptions: 'कोई विकल्प नहीं',
  selectPlaceholder: 'एक विकल्प चुनें',
  search: 'खोजें…',
  searchNamed: (name) => `${name} में खोजें`,
  notifications: 'सूचनाएँ',
  dismissNotification: 'सूचना हटाएँ',
  breadcrumb: 'ब्रेडक्रंब',
  moreItems: (n) => `${n} और`,
  pagination: 'पेज नेविगेशन',
  previousPage: 'पिछला पेज',
  nextPage: 'अगला पेज',
  page: (n) => `पेज ${n}`,
  pageOf: (p, c) => `पेज ${p} / ${c}`,
  rowsPerPage: 'प्रति पेज पंक्तियाँ',
  mainNavigation: 'मुख्य',
  expandSidebar: 'साइडबार खोलें',
  collapseSidebar: 'साइडबार छोटा करें',
  progress: 'प्रगति',
  stepOf: (n, t) => `चरण ${n} / ${t}`,
  stepStatus: { complete: 'पूरा', current: 'वर्तमान', upcoming: 'शुरू नहीं हुआ', error: 'त्रुटि है' },
  today: 'आज',
  thisWeek: 'इस सप्ताह',
  thisMonth: 'इस महीने',
  thisYear: 'इस वर्ष',
  nextAmount: (a) => `अगले ${a}`,
  lastAmount: (a) => `पिछले ${a}`,
  clearDate: 'तारीख साफ़ करें',
  clearDates: 'तारीखें साफ़ करें',
  clearTime: 'समय साफ़ करें',
  showTimes: 'समय दिखाएँ',
  times: 'समय',
  commandPalette: 'कमांड पैलेट',
  commandPlaceholder: 'कमांड लिखें या खोजें…',
  commands: 'कमांड',
  searchCommands: 'कमांड खोजें',
  dropFiles: (m) => (m ? 'फ़ाइलें यहाँ छोड़ें या' : 'फ़ाइल यहाँ छोड़ें या'),
  browse: 'चुनें',
  files: 'फ़ाइलें',
  uploaded: 'अपलोड हो गया',
  uploading: (name) => `${name} अपलोड हो रही है`,
  uploadFailed: 'अपलोड विफल रहा',
  remove: (name) => `${name} हटाएँ`,
  fileTypeRejected: (name) => `${name}: इस प्रकार की फ़ाइल स्वीकार नहीं है।`,
  fileTooLarge: (name, max) => `${name}: ${max} से बड़ी है।`,
  tooManyFiles: (name, max) => `${name}: आप अधिकतम ${max} फ़ाइलें जोड़ सकते हैं।`,
  upTo: (s) => `${s} तक`,
  maxFiles: (n) => `अधिकतम ${n} फ़ाइलें`,
  dataTable: 'डेटा तालिका',
  series: 'शृंखला',
  chart: 'चार्ट',
  total: 'कुल',
};

const gu: SparkMessages = {
  close: 'બંધ કરો',
  dismiss: 'દૂર કરો',
  clear: 'સાફ કરો',
  loading: 'લોડ થઈ રહ્યું છે',
  noResults: 'કોઈ પરિણામ નથી',
  noOptions: 'કોઈ વિકલ્પ નથી',
  selectPlaceholder: 'એક વિકલ્પ પસંદ કરો',
  search: 'શોધો…',
  searchNamed: (name) => `${name}માં શોધો`,
  notifications: 'સૂચનાઓ',
  dismissNotification: 'સૂચના દૂર કરો',
  breadcrumb: 'બ્રેડક્રમ્બ',
  moreItems: (n) => `${n} વધુ`,
  pagination: 'પેજ નેવિગેશન',
  previousPage: 'પાછલું પેજ',
  nextPage: 'આગલું પેજ',
  page: (n) => `પેજ ${n}`,
  pageOf: (p, c) => `પેજ ${p} / ${c}`,
  rowsPerPage: 'પેજ દીઠ પંક્તિઓ',
  mainNavigation: 'મુખ્ય',
  expandSidebar: 'સાઇડબાર ખોલો',
  collapseSidebar: 'સાઇડબાર નાનું કરો',
  progress: 'પ્રગતિ',
  stepOf: (n, t) => `પગલું ${n} / ${t}`,
  stepStatus: { complete: 'પૂર્ણ', current: 'હાલનું', upcoming: 'શરૂ થયું નથી', error: 'ભૂલ છે' },
  today: 'આજે',
  thisWeek: 'આ અઠવાડિયે',
  thisMonth: 'આ મહિને',
  thisYear: 'આ વર્ષે',
  nextAmount: (a) => `આગામી ${a}`,
  lastAmount: (a) => `છેલ્લા ${a}`,
  clearDate: 'તારીખ સાફ કરો',
  clearDates: 'તારીખો સાફ કરો',
  clearTime: 'સમય સાફ કરો',
  showTimes: 'સમય બતાવો',
  times: 'સમય',
  commandPalette: 'કમાન્ડ પેલેટ',
  commandPlaceholder: 'કમાન્ડ લખો અથવા શોધો…',
  commands: 'કમાન્ડ',
  searchCommands: 'કમાન્ડ શોધો',
  dropFiles: (m) => (m ? 'ફાઇલો અહીં મૂકો અથવા' : 'ફાઇલ અહીં મૂકો અથવા'),
  browse: 'પસંદ કરો',
  files: 'ફાઇલો',
  uploaded: 'અપલોડ થઈ ગયું',
  uploading: (name) => `${name} અપલોડ થઈ રહી છે`,
  uploadFailed: 'અપલોડ નિષ્ફળ ગયું',
  remove: (name) => `${name} દૂર કરો`,
  fileTypeRejected: (name) => `${name}: આ પ્રકારની ફાઇલ સ્વીકાર્ય નથી.`,
  fileTooLarge: (name, max) => `${name}: ${max}થી મોટી છે.`,
  tooManyFiles: (name, max) => `${name}: તમે વધુમાં વધુ ${max} ફાઇલો ઉમેરી શકો છો.`,
  upTo: (s) => `${s} સુધી`,
  maxFiles: (n) => `વધુમાં વધુ ${n} ફાઇલો`,
  dataTable: 'ડેટા કોષ્ટક',
  series: 'શ્રેણી',
  chart: 'ચાર્ટ',
  total: 'કુલ',
};

const ta: SparkMessages = {
  close: 'மூடு',
  dismiss: 'நிராகரி',
  clear: 'அழி',
  loading: 'ஏற்றுகிறது',
  noResults: 'முடிவுகள் இல்லை',
  noOptions: 'விருப்பங்கள் இல்லை',
  selectPlaceholder: 'ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்',
  search: 'தேடு…',
  searchNamed: (name) => `${name} இல் தேடு`,
  notifications: 'அறிவிப்புகள்',
  dismissNotification: 'அறிவிப்பை நிராகரி',
  breadcrumb: 'பிரெட்க்ரம்ப்',
  moreItems: (n) => `மேலும் ${n}`,
  pagination: 'பக்க வழிசெலுத்தல்',
  previousPage: 'முந்தைய பக்கம்',
  nextPage: 'அடுத்த பக்கம்',
  page: (n) => `பக்கம் ${n}`,
  pageOf: (p, c) => `பக்கம் ${p} / ${c}`,
  rowsPerPage: 'ஒரு பக்கத்திற்கான வரிசைகள்',
  mainNavigation: 'முதன்மை',
  expandSidebar: 'பக்கப்பட்டியை விரி',
  collapseSidebar: 'பக்கப்பட்டியைச் சுருக்கு',
  progress: 'முன்னேற்றம்',
  stepOf: (n, t) => `படி ${n} / ${t}`,
  stepStatus: { complete: 'முடிந்தது', current: 'தற்போதைய', upcoming: 'தொடங்கவில்லை', error: 'பிழை உள்ளது' },
  today: 'இன்று',
  thisWeek: 'இந்த வாரம்',
  thisMonth: 'இந்த மாதம்',
  thisYear: 'இந்த ஆண்டு',
  nextAmount: (a) => `அடுத்த ${a}`,
  lastAmount: (a) => `கடந்த ${a}`,
  clearDate: 'தேதியை அழி',
  clearDates: 'தேதிகளை அழி',
  clearTime: 'நேரத்தை அழி',
  showTimes: 'நேரங்களைக் காட்டு',
  times: 'நேரங்கள்',
  commandPalette: 'கட்டளைத் தட்டு',
  commandPlaceholder: 'கட்டளையை உள்ளிடவும் அல்லது தேடவும்…',
  commands: 'கட்டளைகள்',
  searchCommands: 'கட்டளைகளைத் தேடு',
  dropFiles: (m) => (m ? 'கோப்புகளை இங்கே விடவும் அல்லது' : 'கோப்பை இங்கே விடவும் அல்லது'),
  browse: 'தேர்ந்தெடு',
  files: 'கோப்புகள்',
  uploaded: 'பதிவேற்றப்பட்டது',
  uploading: (name) => `${name} பதிவேற்றப்படுகிறது`,
  uploadFailed: 'பதிவேற்றம் தோல்வியடைந்தது',
  remove: (name) => `${name} ஐ நீக்கு`,
  fileTypeRejected: (name) => `${name}: இந்த வகைக் கோப்பு ஏற்கப்படாது.`,
  fileTooLarge: (name, max) => `${name}: ${max} ஐ விடப் பெரியது.`,
  tooManyFiles: (name, max) => `${name}: அதிகபட்சம் ${max} கோப்புகளைச் சேர்க்கலாம்.`,
  upTo: (s) => `${s} வரை`,
  maxFiles: (n) => `அதிகபட்சம் ${n} கோப்புகள்`,
  dataTable: 'தரவு அட்டவணை',
  series: 'தொடர்',
  chart: 'விளக்கப்படம்',
  total: 'மொத்தம்',
};

/** Built-in tables by language. Add your own with `SparkProvider messages`. */
export const builtInMessages: Record<string, SparkMessages> = { en, hi, gu, ta };

/** Partial override: plain keys, plus a partial `stepStatus`. */
export type SparkMessagesOverride = Partial<Omit<SparkMessages, 'stepStatus'>> & { stepStatus?: Partial<SparkMessages['stepStatus']> };

export const MessagesContext = createContext<SparkMessagesOverride | null>(null);

/** Text for the current locale, with any SparkProvider overrides applied. */
export function useMessages(): SparkMessages & { locale: string; num: (n: number) => string } {
  const { locale } = useLocale();
  const override = useContext(MessagesContext);
  return useMemo(() => {
    const base = builtInMessages[locale.split('-')[0].toLowerCase()] ?? en;
    const fmt = new Intl.NumberFormat(locale);
    return {
      ...base,
      ...override,
      stepStatus: { ...base.stepStatus, ...override?.stepStatus },
      locale,
      num: (n: number) => fmt.format(n),
    } as SparkMessages & { locale: string; num: (n: number) => string };
  }, [locale, override]);
}

/** Wraps children with message overrides (used by SparkProvider). */
export function MessagesProvider({ value, children }: { value: SparkMessagesOverride; children: React.ReactNode }) {
  const parent = useContext(MessagesContext);
  const merged = useMemo(() => ({ ...parent, ...value, stepStatus: { ...parent?.stepStatus, ...value.stepStatus } }), [parent, value]);
  return <MessagesContext.Provider value={merged}>{children}</MessagesContext.Provider>;
}
