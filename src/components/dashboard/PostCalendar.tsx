import React from "react";
import { CalendarRange, Clock, Send } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { t, translations } from "../../lib/translations";

// Inject specific scheduler translations
translations["Scheduled Broadcasts"] = {
  "Hindi (हिंदी)": "अनुसूचित प्रसारण",
  "Kannada (ಕನ್ನಡ)": "ನಿಗದಿಪಡಿಸಿದ ಪ್ರಸಾರಗಳು",
  "Tamil (தமிழ்)": "திட்டமிடப்பட்ட ஒளிபரப்புகள்"
};
translations["Queue: 3 Pending"] = {
  "Hindi (हिंदी)": "कतार: 3 लंबित",
  "Kannada (ಕನ್ನಡ)": "ಸರತಿ ಸಾಲು: 3 ಬಾಕಿ ಉಳಿದಿವೆ",
  "Tamil (தமிழ்)": "வரிசை: 3 நிலுவையில் உள்ளது"
};
translations["Payload:"] = {
  "Hindi (हिंदी)": "पेलोड:",
  "Kannada (ಕನ್ನಡ)": "ಮಾಹಿತಿ ವಿವರ:",
  "Tamil (தமிழ்)": "தரவு அளவுகோல்:"
};
translations["Reach:"] = {
  "Hindi (हिंदी)": "पहुंच:",
  "Kannada (ಕನ್ನಡ)": "ತಲುಪುವಿಕೆ:",
  "Tamil (தமிழ்)": "வரம்பு:"
};
translations["Special morning offer and product image carousel publication: 'Grown with care, delivered fresh direct.'"] = {
  "Hindi (हिंदी)": "विशेष सुबह की पेशकश और उत्पाद छवि हिंडोला प्रकाशन: 'देखभाल के साथ उगाया गया, सीधे ताजा पहुंचाया गया।'",
  "Kannada (ಕನ್ನಡ)": "ವಿಶೇಷ ಬೆಳಗಿನ ಕೊಡುಗೆ ಮತ್ತು ಗುಣಮಟ್ಟದ ಫೋಟೋ ಪ್ರಕಟಣೆ: 'ಕಾಳಜಿಯಿಂದ ಬೆಳೆಸಿದ, ನೇರವಾಗಿ ತಾಜಾ ತಲುಪಿಸಲಾಗಿದೆ.'",
  "Tamil (தமிழ்)": "சிறப்பு காலை சலுகை மற்றும் தயாரிப்பு படம் வெளியீடு: 'அன்புடன் வளர்க்கப்பட்டு, நேரடியாக புதியதாக விநியோகிக்கப்பட்டது.'"
};
translations["Open status updates: 'Open today 9 AM - 9 PM, Fresh stock of organic honey and Desi A2 Ghee is ready!'"] = {
  "Hindi (हिंदी)": "खुली स्थिति अपडेट: 'आज सुबह 9 बजे से रात 9 बजे तक खुला है, जैविक शहद और देसी ए2 घी का नया स्टॉक तैयार है!'",
  "Kannada (ಕನ್ನಡ)": "ಅಂಗಡಿ ಲಭ್ಯತೆ ಅಪ್‌ಡೇಟ್: 'ಇಂದು ಬೆಳಿಗ್ಗೆ 9 ರಿಂದ ರಾತ್ರಿ 9 ರವರೆಗೆ ತೆರೆದಿದೆ, ಸಾವಯವ ಜೇನುತುಪ್ಪ ಮತ್ತು ದೇಸಿ ಎ2 ತುಪ್ಪದ ಹೊಸ ದಾಸ್ತಾನು ಸಿದ್ಧವಾಗಿದೆ!'",
  "Tamil (தமிழ்)": "செயல்பாட்டு நிலை புதுப்பிப்பு: 'இன்று காலை 9 மணி முதல் இரவு 9 மணி வரை திறந்திருக்கும், ஆர்கானிக் தேன் மற்றும் ஏ2 நெய் புதிய இருப்பு தயாராக உள்ளது!'"
};
translations["Evening discount deals catalog broadcast alert to subscriber lists: 'Flat 10% off on first A2 Ghee order.'"] = {
  "Hindi (हिंदी)": "ग्राहक सूचियों के लिए शाम के डिस्काउंट डील कैटलॉग प्रसारण अलर्ट: 'पहले ए2 घी ऑर्डर पर फ्लैट 10% की छूट।'",
  "Kannada (ಕನ್ನಡ)": "ಗ್ರಾಹಕರಿಗೆ ಸಂಜೆ ರಿಯಾಯಿತಿ ಪ್ರಸಾರ ಅಧಿಸೂಚನೆ: 'ಮೊದಲ ಎ2 ತುಪ್ಪದ ಖರೀದಿಯ ಮೇಲೆ ಫ್ಲಾಟ್ 10% ರಿಯಾಯಿತಿ.'",
  "Tamil (தமிழ்)": "வாடிக்கையாளர் பட்டியல்களுக்கான மாலை தள்ளுபடி சலுகை ஒளிபரப்பு: 'முதல் ஏ2 நெய் ஆர்டருக்கு பிளாட் 10% தள்ளுபடி.'"
};
translations["Tomorrow 9:00 AM"] = { "Hindi (हिंदी)": "कल सुबह 9:00 बजे", "Kannada (ಕನ್ನಡ)": "ನಾಳೆ ಬೆಳಿಗ್ಗೆ 9:00", "Tamil (தமிழ்)": "நாளை காலை 9:00 மணி" };
translations["Tomorrow 10:00 AM"] = { "Hindi (हिंदी)": "कल सुबह 10:00 बजे", "Kannada (ಕನ್ನಡ)": "ನಾಳೆ ಬೆಳಿಗ್ಗೆ 10:00", "Tamil (தமிழ்)": "நாளை காலை 10:00 மணி" };
translations["Thursday 6:00 PM"] = { "Hindi (हिंदी)": "गुरुवार शाम 6:00 बजे", "Kannada (ಕನ್ನಡ)": "ಗುರುವಾರ ಸಂಜೆ 6:00", "Tamil (தமிழ்)": "வியாழக்கிழமை மாலை 6:00 மணி" };

export const PostCalendar: React.FC = () => {
  const { language } = useLanguage();

  const posts = [
    {
      id: 1,
      channel: "Instagram",
      desc: t("Special morning offer and product image carousel publication: 'Grown with care, delivered fresh direct.'", language),
      time: t("Tomorrow 9:00 AM", language),
      badgeColor: "bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]",
      estReach: "1.2K followers",
      payloadSize: "1 Image, 4 Tags",
    },
    {
      id: 2,
      channel: "Google Maps",
      desc: t("Open status updates: 'Open today 9 AM - 9 PM, Fresh stock of organic honey and Desi A2 Ghee is ready!'", language),
      time: t("Tomorrow 10:00 AM", language),
      badgeColor: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
      estReach: "350 localized Map queries",
      payloadSize: "Geo-coded Update",
    },
    {
      id: 3,
      channel: "WhatsApp Business",
      desc: t("Evening discount deals catalog broadcast alert to subscriber lists: 'Flat 10% off on first A2 Ghee order.'", language),
      time: t("Thursday 6:00 PM", language),
      badgeColor: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
      estReach: "480 registered consumers",
      payloadSize: "B2B Catalog Push",
    },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-brand-beige bg-white shadow-sm flex flex-col justify-between h-[360px] text-left">
      <div>
        <div className="flex items-center justify-between border-b border-brand-beige/50 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-brand-gold" />
            <span className="font-serif font-black text-base text-brand-primary block">{t("Scheduled Broadcasts", language)}</span>
          </div>
          <span className="text-[10px] font-mono text-brand-secondary inline-flex items-center gap-1">
            {t("Queue: 3 Pending", language)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {posts.map((post) => (
          <div key={post.id} className="p-3 rounded-xl bg-brand-bg/15 border border-brand-beige/60 text-left space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between w-full">
              <span className={`text-[9.5px] uppercase font-mono font-black px-2 py-0.5 border rounded ${post.badgeColor}`}>
                {post.channel}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-brand-secondary font-mono">
                <Clock className="h-3.5 w-3.5 text-brand-gold" />
                <span>{post.time}</span>
              </div>
            </div>
            
            <p className="text-xs text-brand-primary font-semibold leading-relaxed text-left">
              {post.desc}
            </p>

            <div className="border-t border-brand-beige/30 pt-1.5 mt-1 flex items-center justify-between text-[9px] font-mono text-brand-secondary leading-tight w-full">
              <span>{t("Payload:", language)} {post.payloadSize}</span>
              <span className="font-bold text-brand-primary flex items-center gap-1">
                <Send className="h-2.5 w-2.5 text-brand-gold" /> {t("Reach:", language)} {post.estReach}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
