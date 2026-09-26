import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type LanguageCode = "en" | "hi" | "bn" | "ta" | "te" | "mr" | "gu" | "pa";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", region: "Global / India" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", region: "National / North" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳", region: "East / West Bengal" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", region: "South / Tamil Nadu" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", region: "South / AP & Telangana" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", region: "West / Maharashtra" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", region: "West / Gujarat" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", region: "North / Punjab" },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav & General
    settings: "Settings",
    language: "Language",
    appearance: "Appearance",
    companyNetwork: "Company & Network",
    allSettings: "All Settings",
    feedbackSupport: "Feedback & Support",
    // News wire
    sportsWire: "Real-time Sports Wire",
    updatedLive: "Updated Live",
    syncedJustNow: "Synced just now",
    sportsUpdatesTitle: "Sports Updates & National News",
    sportsUpdatesDesc: "Breaking selection trials, Khelo India updates, state championships, and athlete pathways across India.",
    refreshWire: "Refresh Wire",
    reelView: "Reel",
    listView: "List",
    gridView: "Grid",
    searchNewsPlaceholder: "Search news & trials...",
    allSports: "All Sports",
    asianGames: "Asian Games",
    cricket: "Cricket",
    football: "Football",
    badminton: "Badminton",
    athletics: "Athletics",
    grassroots: "Grassroots",
    swipeToBrowse: "Swipe horizontally to browse",
    updates: "updates",
    articles: "articles",
    featuredLeadStory: "Featured Lead Story",
    readFullAnalysis: "Read Tactical Analysis",
    viewAnalytics: "View Recharts & Social Feed",
    hideAnalytics: "Hide Recharts & Social Feed",
    trendingBulletins: "Trending Bulletins",
    moreNationalUpdates: "National Sports Dispatches & Selection Wire",
    activeUpdates: "updates active",
    haveTournamentUpdate: "Have a tournament or trial update?",
    submitNotice: "Submit sports notice",
    savedToReadingList: "Saved to reading list",
    removedFromReadingList: "Removed from reading list",
    articleShared: "Article shared successfully",
    analyticsHub: "High-Performance Analytics Hub",
    liveWireData: "Live Wire Data",
  },
  hi: {
    settings: "सेटिंग्स",
    language: "भाषा (Language)",
    appearance: "दिखावट (Appearance)",
    companyNetwork: "कंपनी और नेटवर्क",
    allSettings: "सभी सेटिंग्स",
    feedbackSupport: "प्रतिक्रिया और सहायता",
    sportsWire: "लाइव स्पोर्ट्स वायर",
    updatedLive: "लाइव अपडेट",
    syncedJustNow: "अभी सिंक हुआ",
    sportsUpdatesTitle: "खेल समाचार और राष्ट्रीय अपडेट",
    sportsUpdatesDesc: "भारत भर में चयन ट्रायल, खेलो इंडिया अपडेट, राज्य चैंपियनशिप और एथलीट अवसर।",
    refreshWire: "वायर रिफ्रेश करें",
    reelView: "रील",
    listView: "सूची",
    gridView: "ग्रिड",
    searchNewsPlaceholder: "समाचार और ट्रायल खोजें...",
    allSports: "सभी खेल",
    asianGames: "एशियाई खेल",
    cricket: "क्रिकेट",
    football: "फुटबॉल",
    badminton: "बैडमिंटन",
    athletics: "एथलेटिक्स",
    grassroots: "ग्रासरूट्स",
    swipeToBrowse: "अपडेट देखने के लिए स्वाइप करें",
    updates: "अपडेट्स",
    articles: "लेख",
    featuredLeadStory: "प्रमुख राष्ट्रीय समाचार",
    readFullAnalysis: "रणनीतिक विश्लेषण पढ़ें",
    viewAnalytics: "एनालिटिक्स और सोशल फ़ीड देखें",
    hideAnalytics: "एनालिटिक्स छिपाएं",
    trendingBulletins: "ट्रेंडिंग बुलेटिन",
    moreNationalUpdates: "राष्ट्रीय खेल समाचार और चयन अपडेट",
    activeUpdates: "सक्रिय अपडेट्स",
    haveTournamentUpdate: "क्या आपके पास टूर्नामेंट या ट्रायल अपडेट है?",
    submitNotice: "खेल सूचना भेजें",
    savedToReadingList: "रीडिंग लिस्ट में सहेजा गया",
    removedFromReadingList: "रीडिंग लिस्ट से हटाया गया",
    articleShared: "लेख सफलतापूर्वक शेयर किया गया",
    analyticsHub: "हाई-परफॉर्मेंस एनालिटिक्स हब",
    liveWireData: "लाइव वायर डेटा",
  },
  bn: {
    settings: "সেটিংস",
    language: "ভাষা (Language)",
    appearance: "চেহারা (Appearance)",
    companyNetwork: "কোম্পানি ও নেটওয়ার্ক",
    allSettings: "সমস্ত সেটিংস",
    feedbackSupport: "মতামত ও সহায়তা",
    sportsWire: "রিয়েল-টাইম স্পোর্টস ওয়্যার",
    updatedLive: "লাইভ আপডেট",
    syncedJustNow: "এইমাত্র সিঙ্ক হয়েছে",
    sportsUpdatesTitle: "খেলার খবর ও জাতীয় আপডেট",
    sportsUpdatesDesc: "বাছাই ট্রায়াল, খেলো ইন্ডিয়া আপডেট, রাজ্য চ্যাম্পিয়নশিপ এবং খেলোয়াড়দের অগ্রগতি।",
    refreshWire: "রিফ্রেশ করুন",
    reelView: "রিল",
    listView: "তালিকা",
    gridView: "গ্রিড",
    searchNewsPlaceholder: "খবর ও ট্রায়াল খুঁজুন...",
    allSports: "সব খেলা",
    asianGames: "এশিয়ান গেমস",
    cricket: "ক্রিকেট",
    football: "ফুটবল",
    badminton: "ব্যাডমিন্টন",
    athletics: "অ্যাথলেটিক্স",
    grassroots: "তৃণমূল পর্যায়",
    swipeToBrowse: "আপডেট দেখতে সোয়াইপ করুন",
    updates: "আপডেট",
    articles: "নিবন্ধ",
    featuredLeadStory: "প্রধান জাতীয় খবর",
    readFullAnalysis: "বিশ্লেষণ পড়ুন",
    viewAnalytics: "অ্যানালিটিক্স দেখুন",
    hideAnalytics: "লুকান",
    trendingBulletins: "ট্রেন্ডিং বুলেটিন",
    moreNationalUpdates: "জাতীয় ক্রীড়া সংবাদ ও বাছাই আপডেট",
    activeUpdates: "সक्रिय আপডেট",
    haveTournamentUpdate: "টুর্নামেন্ট বা ট্রায়ালের আপডেট আছে?",
    submitNotice: "বিজ্ঞপ্তি জমা দিন",
    savedToReadingList: "তালিকায় সংরক্ষিত হয়েছে",
    removedFromReadingList: "তালিকা থেকে সরানো হয়েছে",
    articleShared: "শেয়ার করা হয়েছে",
    analyticsHub: "অ্যানালিটিক্স হাব",
    liveWireData: "লাইভ ডেটা",
  },
  ta: {
    settings: "அமைப்புகள்",
    language: "மொழி (Language)",
    appearance: "தோற்றம் (Appearance)",
    companyNetwork: "நிறுவனம் மற்றும் நெட்வொர்க்",
    allSettings: "அனைத்து அமைப்புகள்",
    feedbackSupport: "கருத்து & ஆதரவு",
    sportsWire: "நேரலை விளையாட்டு செய்திகள்",
    updatedLive: "நேரலை புதுப்பிப்பு",
    syncedJustNow: "இப்போது புதுப்பிக்கப்பட்டது",
    sportsUpdatesTitle: "விளையாட்டு செய்திகள் & தேசிய அறிவிப்புகள்",
    sportsUpdatesDesc: "தேர்வு சோதனைகள், கேலோ இந்தியா செய்திகள், மாநில சாம்பியன்ஷிப்புகள்.",
    refreshWire: "புதுப்பிக்கவும்",
    reelView: "ரீல்",
    listView: "பட்டியல்",
    gridView: "கட்டம் (Grid)",
    searchNewsPlaceholder: "செய்திகள் & சோதனைகளைத் தேடுங்கள்...",
    allSports: "அனைத்து விளையாட்டுகள்",
    asianGames: "ஆசிய விளையாட்டுகள்",
    cricket: "கிரிக்கெட்",
    football: "கால்பந்து",
    badminton: "பேட்மிண்டன்",
    athletics: "தடகளம்",
    grassroots: "கிராமப்புற விளையாட்டு",
    swipeToBrowse: "பார்க்க ஸ்வைப் செய்யவும்",
    updates: "புதுப்பிப்புகள்",
    articles: "கட்டுரைகள்",
    featuredLeadStory: "முக்கிய செய்தி",
    readFullAnalysis: "பகுப்பாய்வைப் படிக்கவும்",
    viewAnalytics: "விளக்கப்படங்களைப் பார்க்கவும்",
    hideAnalytics: "மறைக்கவும்",
    trendingBulletins: "பிரபலமான செய்திகள்",
    moreNationalUpdates: "தேசிய விளையாட்டு அறிவிப்புகள்",
    activeUpdates: "செயலில் உள்ள செய்திகள்",
    haveTournamentUpdate: "போட்டி அறிவிப்பு உள்ளதா?",
    submitNotice: "அறிவிப்பைச் சமர்ப்பிக்கவும்",
    savedToReadingList: "சேமிக்கப்பட்டது",
    removedFromReadingList: "நீக்கப்பட்டது",
    articleShared: "பகிரப்பட்டது",
    analyticsHub: "பகுப்பாய்வு மையம்",
    liveWireData: "நேரலை தகவல்",
  },
  te: {
    settings: "సెట్టింగులు",
    language: "భాష (Language)",
    appearance: "రూపురేఖలు (Appearance)",
    companyNetwork: "కంపెనీ & నెట్‌వర్క్",
    allSettings: "అన్ని సెట్టింగ్‌లు",
    feedbackSupport: "అభిప్రాయం & మద్దతు",
    sportsWire: "లైవ్ స్పోర్ట్స్ వైర్",
    updatedLive: "లైవ్ అప్‌డేట్",
    syncedJustNow: "ఇప్పుడే సమకాలీకరించబడింది",
    sportsUpdatesTitle: "క్రీడా వార్తలు & జాతీయ అప్‌డేట్లు",
    sportsUpdatesDesc: "ఎంపిక ట్రయల్స్, ఖేలో ఇండియా అప్‌డేట్‌లు మరియు రాష్ట్ర ఛాంపియన్‌షిప్‌లు.",
    refreshWire: "రిఫ్రెష్ చేయండి",
    reelView: "రీల్",
    listView: "జాబితా",
    gridView: "గ్రిడ్",
    searchNewsPlaceholder: "వార్తలు & ట్రయల్స్ శోధించండి...",
    allSports: "అన్ని క్రీడలు",
    asianGames: "ఆసియా క్రీడలు",
    cricket: "క్రికెట్",
    football: "ఫుట్‌బాల్",
    badminton: "బ్యాడ్మింటన్",
    athletics: "అథ్లెటిక్స్",
    grassroots: "గ్రాస్‌రూట్స్",
    swipeToBrowse: "చూడటానికి స్వైప్ చేయండి",
    updates: "నవీకరణలు",
    articles: "వ్యాసాలు",
    featuredLeadStory: "ప్రధాన జాతీయ వార్త",
    readFullAnalysis: "విశ్లేషణ చదవండి",
    viewAnalytics: "గణాంకాలు చూడండి",
    hideAnalytics: "దాచండి",
    trendingBulletins: "ట్రెండింగ్ వార్తలు",
    moreNationalUpdates: "జాతీయ క్రీడా ప్రకటనలు & ఎంపిక వార్తలు",
    activeUpdates: "యాక్టివ్ అప్‌డేట్‌లు",
    haveTournamentUpdate: "టోర్నమెంట్ అప్‌డేట్ ఉందా?",
    submitNotice: "నోటీస్ సమర్పించండి",
    savedToReadingList: "సేవ్ చేయబడింది",
    removedFromReadingList: "తొలగించబడింది",
    articleShared: "షేర్ చేయబడింది",
    analyticsHub: "అనలిటిక్స్ హబ్",
    liveWireData: "లైవ్ డేటా",
  },
  mr: {
    settings: "सेटिंग्ज",
    language: "भाषा (Language)",
    appearance: "दिसणे (Appearance)",
    companyNetwork: "कंपनी आणि नेटवर्क",
    allSettings: "सर्व सेटिंग्ज",
    feedbackSupport: "अभिप्राय आणि मदत",
    sportsWire: "थेट क्रीडा वार्ता",
    updatedLive: "थेट अपडेट",
    syncedJustNow: "आत्ताच सिंक केले",
    sportsUpdatesTitle: "क्रीडा घडामोडी आणि राष्ट्रीय बातम्या",
    sportsUpdatesDesc: "निवड चाचण्या, खेलो इंडिया अपडेट्स आणि राज्यस्तरीय स्पर्धा.",
    refreshWire: "रिफ्रेश करा",
    reelView: "रील",
    listView: "यादी",
    gridView: "ग्रिड",
    searchNewsPlaceholder: "बातम्या आणि चाचण्या शोधा...",
    allSports: "सर्व खेळ",
    asianGames: "आशियाई खेळ",
    cricket: "क्रिकेट",
    football: "फुटबॉल",
    badminton: "बॅडमिंटन",
    athletics: "अ‍ॅथलेटिक्स",
    grassroots: "ग्रासरूट्स क्रीडा",
    swipeToBrowse: "पाहण्यासाठी स्वाइप करा",
    updates: "अपडेट्स",
    articles: "लेख",
    featuredLeadStory: "प्रमुख राष्ट्रीय बातमी",
    readFullAnalysis: "विश्लेषण वाचा",
    viewAnalytics: "आकडेवारी पहा",
    hideAnalytics: "लपवा",
    trendingBulletins: "ट्रेंडिंग बुलेटिन",
    moreNationalUpdates: "राष्ट्रीय क्रीडा वार्ता आणि निवड अपडेट्स",
    activeUpdates: "सक्रिय अपडेट्स",
    haveTournamentUpdate: "स्पर्धेचे अपडेट आहे का?",
    submitNotice: "सूचना पाठवा",
    savedToReadingList: "वाचन यादीत सेव्ह केले",
    removedFromReadingList: "यादीतून हटवले",
    articleShared: "शेअर केले",
    analyticsHub: "अ‍ॅनालिटिक्स केंद्र",
    liveWireData: "थेट डेटा",
  },
  gu: {
    settings: "સેટિંગ્સ",
    language: "ભાષા (Language)",
    appearance: "દેખાવ (Appearance)",
    companyNetwork: "કંપની અને નેટવર્ક",
    allSettings: "બધા સેટિંગ્સ",
    feedbackSupport: "પ્રતિસાદ અને સહાય",
    sportsWire: "લાઇવ સ્પોર્ટ્સ વાયર",
    updatedLive: "લાઇવ અપડેટ",
    syncedJustNow: "હમણાં જ સિંક થયું",
    sportsUpdatesTitle: "રમતગમતના સમાચારો અને રાષ્ટ્રીય અપડેટ્સ",
    sportsUpdatesDesc: "ટ્રાયલ્સ, ખેલો ઇન્ડિયા અપડેટ્સ અને સ્ટેટ ચેમ્પિયનશિપ્સ.",
    refreshWire: "રીફ્રેશ કરો",
    reelView: "રીલ",
    listView: "યાદી",
    gridView: "ગ્રીડ",
    searchNewsPlaceholder: "સમાચાર શોધો...",
    allSports: "બધી રમતો",
    asianGames: "એશિયન ગેમ્સ",
    cricket: "ક્રિકેટ",
    football: "ફૂટબૉલ",
    badminton: "બેડમિન્ટન",
    athletics: "એથ્લેટિક્સ",
    grassroots: "ગ્રાસરૂટ્સ",
    swipeToBrowse: "જોવા માટે સ્વાઇપ કરો",
    updates: "અપડેટ્સ",
    articles: "લેખો",
    featuredLeadStory: "મુખ્ય સમાચાર",
    readFullAnalysis: "વિશ્લેષણ વાંચો",
    viewAnalytics: "આંકડા જુઓ",
    hideAnalytics: "છુપાવો",
    trendingBulletins: "ટ્રેન્ડિંગ બુલેટિન",
    moreNationalUpdates: "રાષ્ટ્રીય રમતગમત સમાચારો",
    activeUpdates: "સક્રિય અપડેટ્સ",
    haveTournamentUpdate: "ટૂર્નામેન્ટ અપડેટ છે?",
    submitNotice: "નોટિસ મોકલો",
    savedToReadingList: "સેવ કરવામાં આવ્યું",
    removedFromReadingList: "દૂર કરવામાં આવ્યું",
    articleShared: "શેર કર્યું",
    analyticsHub: "એનાલિટિક્સ હબ",
    liveWireData: "લાઇવ ડેટા",
  },
  pa: {
    settings: "ਸੈਟਿੰਗਾਂ",
    language: "ਭਾਸ਼ਾ (Language)",
    appearance: "ਦਿੱਖ (Appearance)",
    companyNetwork: "ਕੰਪਨੀ ਅਤੇ ਨੈੱਟਵਰਕ",
    allSettings: "ਸਾਰੀਆਂ ਸੈਟਿੰਗਾਂ",
    feedbackSupport: "ਫੀਡਬੈਕ ਅਤੇ ਸਹਾਇਤਾ",
    sportsWire: "ਲਾਈਵ ਖੇਡਾਂ ਵਾਇਰ",
    updatedLive: "ਲਾਈਵ ਅੱਪਡੇਟ",
    syncedJustNow: "ਹੁਣੇ ਸਿੰਕ ਹੋਇਆ",
    sportsUpdatesTitle: "ਖੇਡ ਖ਼ਬਰਾਂ ਅਤੇ ਰਾਸ਼ਟਰੀ ਅੱਪਡੇਟ",
    sportsUpdatesDesc: "ਚੋਣ ਟਰਾਇਲ, ਖੇਲੋ ਇੰਡੀਆ ਅੱਪਡੇਟ ਅਤੇ ਰਾਜ ਚੈਂਪੀਅਨਸ਼ਿਪਾਂ।",
    refreshWire: "ਤਾਜ਼ਾ ਕਰੋ",
    reelView: "ਰੀਲ",
    listView: "ਸੂਚੀ",
    gridView: "ਗ੍ਰਿਡ",
    searchNewsPlaceholder: "ਖ਼ਬਰਾਂ ਅਤੇ ਟਰਾਇਲ ਖੋਜੋ...",
    allSports: "ਸਾਰੀਆਂ ਖੇਡਾਂ",
    asianGames: "ਏਸ਼ੀਆਈ ਖੇਡਾਂ",
    cricket: "ਕ੍ਰਿਕਟ",
    football: "ਫੁੱਟਬਾਲ",
    badminton: "ਬੈਡਮਿੰਟਨ",
    athletics: "ਅਥਲੈਟਿਕਸ",
    grassroots: "ਜ਼ਮੀਨੀ ਪੱਧਰ",
    swipeToBrowse: "ਵੇਖਣ ਲਈ ਸਵਾਈਪ ਕਰੋ",
    updates: "ਅੱਪਡੇਟ",
    articles: "ਲੇਖ",
    featuredLeadStory: "ਮੁੱਖ ਖ਼ਬਰ",
    readFullAnalysis: "ਵਿਸ਼ਲੇਸ਼ਣ ਪੜ੍ਹੋ",
    viewAnalytics: "ਅੰਕੜੇ ਵੇਖੋ",
    hideAnalytics: "ਲੁਕਾਓ",
    trendingBulletins: "ਟ੍ਰੈਂਡਿੰਗ ਬੁਲੇਟਿਨ",
    moreNationalUpdates: "ਰਾਸ਼ਟਰੀ ਖੇਡ ਖ਼ਬਰਾਂ ਅਤੇ ਚੋਣ ਅੱਪਡੇਟ",
    activeUpdates: "ਸਰਗਰਮ ਅੱਪਡੇਟ",
    haveTournamentUpdate: "ਟੂਰਨਾਮੈਂਟ ਅੱਪਡੇਟ ਹੈ?",
    submitNotice: "ਨੋਟਿਸ ਜਮ੍ਹਾਂ ਕਰੋ",
    savedToReadingList: "ਸੁਰੱਖਿਅਤ ਕੀਤਾ ਗਿਆ",
    removedFromReadingList: "ਹਟਾਇਆ ਗਿਆ",
    articleShared: "ਸਾਂਝਾ ਕੀਤਾ ਗਿਆ",
    analyticsHub: "ਵਿਸ਼ਲੇਸ਼ਣ ਹੱਬ",
    liveWireData: "ਲਾਈਵ ਡਾਟਾ",
  },
};

const STORAGE_KEY = "khelgrid-language";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentLanguage: LanguageOption;
  supportedLanguages: LanguageOption[];
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        setLanguageState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      // storage unavailable
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // storage unavailable
    }
  };

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const fallbackDict = TRANSLATIONS.en;
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

const defaultContext: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  currentLanguage: SUPPORTED_LANGUAGES[0],
  supportedLanguages: SUPPORTED_LANGUAGES,
  t: (key: string, fallback?: string) => {
    return TRANSLATIONS.en[key] || fallback || key;
  },
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context || defaultContext;
}
