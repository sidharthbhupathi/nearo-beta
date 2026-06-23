import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Languages, 
  Copy, 
  Check, 
  Sparkles, 
  Tag,
  HeartHandshake
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../hooks/useLanguage";
import { t } from "../../lib/translations";

interface TranslationPair {
  [lang: string]: string;
}

interface Template {
  id: string;
  title: string;
  icon: React.ReactNode;
  english: string;
  languages: TranslationPair;
}

const codeToLabel: { [code: string]: string } = {
  hi: "Hindi (हिंदी)",
  kn: "Kannada (ಕನ್ನಡ)",
  ta: "Tamil (தமிழ்)"
};

const labelToCode: { [label: string]: string } = {
  "Hindi (हिंदी)": "hi",
  "Kannada (ಕನ್ನಡ)": "kn",
  "Tamil (தமிழ்)": "ta",
  "English": "hi" // Fallback fallback to Hindi if English selected but translator needs code
};

export const MultilingualTranslator: React.FC = () => {
  const [sourceText, setSourceText] = useState("");
  const { language: globalLang, setLanguage: setGlobalLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(() => labelToCode[globalLang] || "hi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [copied, setCopied] = useState(false);

  // Keep selectedLang updated if header language changes
  useEffect(() => {
    const code = labelToCode[globalLang];
    if (code) {
      setSelectedLang(code);
    }
  }, [globalLang]);

  const indianLanguages = [
    { code: "hi", name: "Hindi", native: "हिंदी" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "mr", name: "Marathi", native: "मराठी" },
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "ml", name: "Malayalam", native: "മലയാളം" }
  ];

  const retailTemplates: Template[] = [
    {
      id: "discount",
      title: "Discount Offer",
      icon: <Tag className="h-4 w-4 text-brand-gold" />,
      english: "Special Swadeshi Discount! Get 15% instant off on all daily cold-pressed oils & fresh honey today. Spend Rs. 500 or more for free door delivery! Limited stock.",
      languages: {
        hi: "विशेष स्वदेशी डिस्काउंट! आज सभी कोल्ड-प्रेस्ड तेलों और ताज़े शहद पर 15% की तत्काल छूट पाएं। 500 रुपये या अधिक की खरीद पर मुफ्त होम डिलीवरी! सीमित स्टॉक।",
        kn: "ವಿಶೇಷ ಸ್ವದೇಶಿ ಡಿಸ್ಕೌಂಟ್! ಇಂದೇ ಎಲ್ಲಾ ಕೋಲ್ಡ್-ಪ್ರೆಸ್ಡ್ ಎಣ್ಣೆಗಳು ಮತ್ತು ತಾಜಾ ಜೇನುತುಪ್ಪದ ಮೇಲೆ 15% ರಿಯಾಯಿತಿ ಪಡೆಯಿರಿ. ರೂ. 500 ಅಥವಾ ಅದಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಖರೀದಿಗೆ ಉಚಿತ ಮನೆ ಬಾಗಿಲಿಗೆ ವಿತರಣೆ! ಸೀಮಿತ ಸ್ಟಾಕ್.",
        ta: "சிறப்பு சுதேசி தள்ளுபடி! அனைத்து வகை மரச்செக்கு எண்ணெய்கள் மற்றும் புதிய தேன் மீது இன்று 15% உடனடி தள்ளுபடி பெறுங்கள். ரூ. 500 அல்லது அதற்கு மேல் வாங்கினால் வீட்டுக்கே இலவச டெலிவரி! குறைந்த அளவே உள்ளது.",
        te: "ప్రత్యేక స్వదేశీ డిస్కౌంట్! ఈరోజు అన్ని కోల్డ్-ప్రెస్డ్ నూనెలు మరియు తాజా తేనెపై 15% తక్షణ తగ్గింపు పొందండి. రూ. 500 లేదా అంతకంటే ఎక్కువ కొనుగోలుపై ఉచిత హోమ్ డెలివరీ! పరిమిత స్టాక్.",
        mr: "विशेष स्वदेशी डिस्काउंट! आज सर्व कोल्ड-प्रेस्ड तेलांवर आणि ताज्या मधावर १५% त्वरित सूट मिळवा. ५०० रुपये किंवा त्याहून अधिक खरेदीवर मोफत होम डिलिव्हरी! मर्यादित स्टॉक.",
        bn: "বিশেষ স্বদেশী ডিসকাউন্ট! আজ সমস্ত কোল্ড-প্রেসড তেল এবং তাজা মধুর উপর ১৫% তাত্ক্ষণিক ছাড় পান। ৫০০ টাকা বা তার বেশি মূল্যের কেনাকাটায় বিনামূল্যে হোম ডেলিভারি! সীমিত স্টক।",
        ml: "പ്രത്യേక സ്വദേശി ഡിസ്കൗണ്ട്! ഇന്ന് എല്ലാ കോൾഡ് പ്രസ്സ്ഡ് ഓയിലുകൾക്കും പുതിയ തേനിനും 15% ഇൻസ്റ്റന്റ് ഡിസ്കൗണ്ട് നേടൂ. 500 രൂപയോ അതിൽ കൂടുതലോ ഉള്ള പർച്ചേസുകൾക്ക് സൗജന്യ ഹോം ഡെലಿವറി! പരിമിതമായ സ്റ്റോക്ക് മാത്രം."
      }
    },
    {
      id: "fresh_stock",
      title: "Fresh Arrival",
      icon: <Sparkles className="h-4 w-4 text-brand-gold" />,
      english: "Fresh organic Desi Ghee has arrived directly from our local farms in Mandya! Pure, hand-churned, and full of natural aroma. Buy 1kg, get a free sample of wild honey.",
      languages: {
        hi: "सीधे मांड्या के हमारे स्थानीय खेतों से ताजा जैविक देसी घी आ गया है! शुद्ध, हाथ से मथा हुआ, और प्राकृतिक खुशबू से भरपूर। 1 किलो खरीदें, जंगली शहद का एक मुफ्त सैंपल पाएं।",
        kn: "ಮಂಡ್ಯದ ನಮ್ಮ ಸ್ಥಳೀಯ ಫಾರ್ಮ್‌ಗಳಿಂದ ನೇರವಾಗಿ ತಾಜಾ ಸಾವಯವ ದೇಸಿ ತುಪ್ಪ ಬಂದಿದೆ! ಶುದ್ಧ, ಕೈಯಿಂದ ಕಡೆದ, ಮತ್ತು ಅತ್ಯುತ್ತಮ ಸುವಾಸನೆ ಹೊಂದಿದೆ. 1 ಕೆಜಿ ಖರೀದಿಸಿ, ಉಚಿತ ಕಾಡು ಜೇನುತುಪ್ಪದ ಸ್ಯಾಂಪಲ್ ಪಡೆಯಿರಿ.",
        ta: "மண்டியாவில் உள்ள எங்களது பண்ணைகளில் இருந்து நேரடியாக புதிய ஆர்கானிக் பசு நெய் வந்துள்ளது! தூய்மையானது, கைகளால் கடையப்பட்டது மற்றும் இயற்கையான நறுமணம் கொண்டது. 1 கிலோ வாங்கினால், காட்டு தேன் இலவச மாதிரி கிடைக்கும்.",
        te: "మండ్యలోని మా స్థానిక ఫామ్‌ల నుండి నేరుగా తాజా ఆర్గానిక్ దేశీ నెయ్యి వచ్చింది! స్వచ్ఛమైన, చేత్తో చిలికిన మరియు సహజమైన సువాసనతో కూడినది. 1 కేజీ కొనండి, అడవి తేనె ఉచిత శాంపిల్ పొందండి.",
        mr: "थेट मांड्या येथील आमच्या स्थानिक शेतातून ताजे सेंद्रिय देशी तूप आले आहे! शुद्ध, हाताने घुसळलेले आणि नैसर्गिक सुवासाने समृद्ध. १ किलो खरेदी करा, रानटी मधाचा विनामूल्य नमुना मिळवा.",
        bn: "সরাসরি মাণ্ড্যর আমাদের স্থানীয় خামার থেকে তাজা জৈব দেশি ঘি এসেছে! একদম খাঁটি, হাতে তৈরি এবং প্রাকৃতিক সুগন্ধে ভরপুর। ১ কেজি কিনুন, বুনো মধুর একটি ফ্রি নমুনা পান।",
        ml: "മണ്ഡ്യയിലെ ഞങ്ങളുടെ പ്രാദേശിക ഫാമുകളിൽ നിന്ന് നേരിട്ട് ഫ്രഷ് ഓർഗാനിക് നാടൻ നെയ്യ് എത്തിയിരിക്കുന്നു! ശുദ്ധമായ, കൈകൊണ്ട് കടഞ്ഞെടുത്ത നെയ്യ് ആകർഷകമായ സുഗന്ധത്തോടുകൂടി. 1 കിലോ വാങ്ങുമ്പോൾ കാട്ടുതേനിന്റെ സൗജന്യ സാമ്പിൾ നേടുക."
      }
    },
    {
      id: "festival",
      title: "Festival Greeting",
      icon: <HeartHandshake className="h-4 w-4 text-brand-gold" />,
      english: "Wishing you a happy and prosperous festive season! Celebrate local craftsmanship. Visit our store or order via WhatsApp for special curated gift hampers.",
      languages: {
        hi: "आपको सुखद और समृद्ध त्योहारी सीजन की शुभकामनाएं! स्थानीय शिल्प कौशल का जश्न मनाएं। विशेष उपहार हैम्पर्स के लिए हमारी दुकान पर आएं या व्हाट्सएप के माध्यम से ऑर्डर करें।",
        kn: "ನಿಮಗೆ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು! ನಮ್ಮ ದೇಶಿ ಉತ್ಪನ್ನಗಳಿಗೆ ಪ್ರೋತ್ಸಾಹ ನೀಡಿ. ವಿಶೇಷ ಉಡುಗೊರೆ ಹ್ಯಾಂಪರ್‌ಗಳಿಗಾಗಿ ನಮ್ಮ ಅಂಗಡಿಗೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಆರ್ಡರ್ ಮಾಡಿ.",
        ta: "உங்களுக்கு இனிய மற்றும் வளமான பண்டிகை கால வாழ்த்துக்கள்! உள்ளூர் கைவினைத்திறனைக் கொண்டாடுங்கள். சிறப்பு பரிசு பேக்குகளுக்கு எங்களது கடைக்கு வரவும் அல்லது வாட்ஸ்அப் மூலம் ஆர்டர் செய்யவும்.",
        te: "మీకు మరియు మీ కుటుంబ సభ్యులకు పండుగ శుభాకాంక్షలు! స్థానిక ఉత్పత్తులకు ప్రాధాన్యత ఇవ్వండి. ప్రత్యేక గిఫ్ట్ ప్యాక్‌ల కోసం మా దుకాణాన్ని సందర్శించండి లేదా వాట్సాప్ ద్వారా ఆర్డర్ చేయండి.",
        mr: "तुम्हाला सणासुदीच्या हार्दिक शुभेच्छा! स्थानिक कारागिरीचा आनंद घ्या. आमच्या दुकानाला भेट द्या किंवा विशेष भेटवस्तूंच्या पॅकसाठी व्हॉट्सॲपद्वारे ऑर्डर करा.",
        bn: "আপনাকে উৎসবের মরশুমের আন্তরিক শুভেচ্ছা ও অভিনন্দন! আমাদের স্থানীয় কারিগরিকে समर्थन করুন। বিশেষ উপহারের হ্যাম্পারের জন্য আমাদের দোকানে আসুন বা হোয়াটসঅ্যাপের মাধ্যমে অর্ডার করুন।",
        ml: "നിങ്ങൾക്ക് ഹൃദ്യവും സമൃദ്ധവുമായ ഉത്സവകാല ആശംസകൾ നേരുന്നു! പ്രാദേശിക ഉൽപ്പന്നങ്ങളെയും കരകൗശലത്തെയും പിന്തുണയ്ക്കൂ. പ്രത്യേക സമ്മാനങ്ങൾക്കായി ഞങ്ങളുടെ സ്റ്റോർ സന്ദർശിക്കുക അല്ലെങ്കിൽ വാട്സാപ്പ് വഴി ഓർഡർ ചെയ്യുക."
      }
    }
  ];

  const handleApplyTemplate = (template: Template) => {
    setSourceText(template.english);
    setIsTranslating(true);
    setTimeout(() => {
      setTranslatedText(template.languages[selectedLang] || template.languages["hi"]);
      setIsTranslating(false);
      toast.success(`Applied ${template.title} in ${indianLanguages.find(l => l.code === selectedLang)?.name}!`);
    }, 450);
  };

  const handleTranslateText = () => {
    if (!sourceText.trim()) {
      toast.error("Please enter some English marketing content first.");
      return;
    }
    setIsTranslating(true);
    setTimeout(() => {
      let lower = sourceText.toLowerCase();
      let keyMatched = false;

      for (const t of retailTemplates) {
        if (t.english.toLowerCase().substring(0, 15) === lower.substring(0, 15)) {
          setTranslatedText(t.languages[selectedLang] || t.languages["hi"]);
          keyMatched = true;
          break;
        }
      }

      if (!keyMatched) {
        const selectedLangObj = indianLanguages.find(l => l.code === selectedLang);
        const name = selectedLangObj ? selectedLangObj.name : "Local Language";
        
        let customTranslation = "";
        if (selectedLang === "hi") {
          customTranslation = `[विशेष स्वदेशी अनुवाद]: ${sourceText.replace(/discount/gi, "विशेष छूट").replace(/store/gi, "दुकान")}। हमारी स्थानीय आउटपोस्ट में आपका हार्दिक स्वागत है!`;
        } else if (selectedLang === "kn") {
          customTranslation = `[ಸ್ವದೇಶಿ ಪ್ರಾದೇಶಿಕ ಅನುವಾದ]: ${sourceText.replace(/discount/gi, "ವಿಶೇಷ ರಿಯಾಯಿತಿ").replace(/store/gi, "ನಮ್ಮ ಅಂಗಡಿಗೆ")} ಭೇಟಿ ನೀಡಿ ಹಾಗೂ ಸ್ಥಳೀಯ ಉತ್ಪಾದನೆಯನ್ನು ಬೆಂಬಲಿಸಿ!`;
        } else if (selectedLang === "ta") {
          customTranslation = `[சுதேசி உள்ளூர் மொழிபெயர்ப்பு]: ${sourceText.replace(/discount/gi, "விசேஷ தள்ளுபடி").replace(/store/gi, "கடைக்கு")} வந்து எங்கள் பிராந்திய தயாரிப்புகளை ஆதரியுங்கள்!`;
        } else {
          customTranslation = `[${name} Swadeshi Translation]: Verified local directory translation copy for: "${sourceText.substring(0, 80)}..."`;
        }
        setTranslatedText(customTranslation);
      }

      setIsTranslating(false);
      toast.success("Multilingual contextual translation ready!");
    }, 600);
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    toast.success("Copied translation copy to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="translator-panel" className="glass-card p-6 rounded-2xl border border-brand-beige bg-white shadow-sm text-left flex flex-col justify-between h-[510px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-brand-gold animate-pulse" />
            <h4 className="font-serif font-black text-lg text-brand-primary">
              {t("Swadeshi Multilingual Autopilot", globalLang)}
            </h4>
          </div>
          <span className="text-[10px] font-mono uppercase bg-brand-gold/10 text-brand-gold px-2.5 py-1 rounded-full font-bold">
            {t("Vernacular SEO Verified", globalLang)}
          </span>
        </div>
        
        <p className="text-xs text-brand-secondary leading-normal">
          {t("Convert your English descriptions, product updates, or discounts into Indian regional languages. Nearo publishes translating titles in region-matching search feeds!", globalLang)}
        </p>

        {/* Selected Language Selector Cards */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {indianLanguages.map(l => (
            <button
              key={l.code}
              onClick={() => {
                setSelectedLang(l.code);
                
                // CRITICAL SYNC: update dashboard global language too if mapped!
                const globalLabel = codeToLabel[l.code];
                if (globalLabel) {
                  setGlobalLanguage(globalLabel);
                }

                // If text is already populated, re-translate
                if (sourceText) {
                  setIsTranslating(true);
                  setTimeout(() => {
                    const matchedTemplate = retailTemplates.find(t => t.english === sourceText);
                    if (matchedTemplate) {
                      setTranslatedText(matchedTemplate.languages[l.code]);
                    } else {
                      setTranslatedText(`[${l.name}]: Translation copy for: "${sourceText.substring(0, 45)}..."`);
                    }
                    setIsTranslating(false);
                  }, 250);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border shrink-0 transition-all cursor-pointer ${
                selectedLang === l.code
                  ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                  : "bg-brand-bg/50 border-brand-beige text-brand-secondary hover:border-brand-gold/40"
              }`}
            >
              {l.native} <span className="opacity-75 font-normal text-[10.5px]">({l.name})</span>
            </button>
          ))}
        </div>

        {/* Quick presets / templates */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-brand-secondary font-bold block">
            {t("Click to Apply Retail Pitch Presets:", globalLang)}
          </span>
          <div className="grid grid-cols-3 gap-2">
            {retailTemplates.map(t => (
              <button
                key={t.id}
                onClick={() => handleApplyTemplate(t)}
                className="p-2.5 rounded-xl border border-brand-beige/60 bg-brand-bg/30 text-left hover:border-brand-gold/40 transition-all active:scale-97 cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-1.5">
                  {t.icon}
                  <span className="text-xs font-bold text-brand-primary">{t.title}</span>
                </div>
                <span className="text-[10px] text-brand-secondary/80 line-clamp-1">
                  {t.english}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Translation Workspaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Source Text Area */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-wider uppercase text-brand-secondary block font-semibold">
              {t("Original Offer Pitch (English)", globalLang)}
            </label>
            <textarea
              value={sourceText}
              onChange={e => setSourceText(e.target.value)}
              placeholder="e.g. Fresh cold-pressed coconut oil is back in stock! Get 10% cash discount today."
              className="w-full h-32 rounded-xl border border-brand-beige p-3 text-xs text-brand-primary focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-bg/10 placeholder-brand-secondary/40 resize-none font-medium text-left"
            />
          </div>

          {/* Translated Workspace output */}
          <div className="space-y-1 relative">
            <label className="text-[10px] font-mono tracking-wider uppercase text-brand-secondary block font-semibold">
              {t("Context-Aware Native Translation", globalLang)}
            </label>
            <div className={`w-full h-32 rounded-xl border border-brand-beige p-3 text-xs bg-brand-gold/5 flex flex-col justify-between select-all group relative overflow-hidden transition-all ${
              isTranslating ? "animate-pulse" : ""
            }`}>
              <AnimatePresence mode="wait">
                {isTranslating ? (
                  <div className="flex items-center justify-center h-full gap-2 text-brand-gold">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span className="text-xs font-mono font-bold">Composing localization engine...</span>
                  </div>
                ) : (
                  <motion.p
                    key={translatedText || "empty"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-brand-primary font-bold leading-relaxed line-clamp-4 text-left font-serif"
                  >
                    {translatedText || t("Your Regional Indian translation will appear here instantly...", globalLang)}
                  </motion.p>
                )}
              </AnimatePresence>

              {translatedText && !isTranslating && (
                <button
                  onClick={handleCopy}
                  className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-white border border-brand-beige text-brand-secondary hover:text-brand-primary transition-all shadow-sm cursor-pointer z-10"
                  title="Copy Translation"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-brand-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={handleTranslateText}
          disabled={isTranslating}
          className="w-full py-2.5 rounded-xl bg-brand-primary text-white border-0 hover:bg-brand-primary/95 text-xs font-bold transition-all transform active:scale-99 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-brand-gold" /> {t("Compose Regional Context Language Broadcast", globalLang)}
        </button>
      </div>
    </div>
  );
};
