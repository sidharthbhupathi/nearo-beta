import { useState, useEffect } from "react";

export function useLanguage() {
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem("nearo_language") || "English";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const currentVal = localStorage.getItem("nearo_language") || "English";
      setLanguage(currentVal);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("nearo_language_changed", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("nearo_language_changed", handleStorageChange);
    };
  }, []);

  const changeLanguage = (newLang: string) => {
    localStorage.setItem("nearo_language", newLang);
    setLanguage(newLang);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("nearo_language_changed"));
  };

  return { language, setLanguage: changeLanguage };
}
