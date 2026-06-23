import React, { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { Pricing } from "./pages/Pricing";
import { Dashboard } from "./pages/Dashboard";
import { Waitlist } from "./pages/Waitlist";
import { Profile } from "./pages/Profile";
import { Admin } from "./pages/Admin";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return <Home onPageChange={handlePageChange} />;
      case "pricing":
        return <Pricing onPageChange={handlePageChange} />;
      case "dashboard":
        return <Dashboard onPageChange={handlePageChange} />;
      case "waitlist":
        return <Waitlist />;
      case "profile":
        return <Profile onPageChange={handlePageChange} />;
      case "admin":
        return <Admin onPageChange={handlePageChange} />;
      default:
        return <Home onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-brand-bg font-sans overflow-x-hidden selection:bg-brand-gold/35 selection:text-brand-primary">
      <div className="ambient-bg" aria-hidden="true" />
      <div className="noise-overlay" />

      {/* 2. Notification Provider */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: "glass-card border border-brand-gold/30 text-brand-primary font-sans text-sm rounded-xl shadow-lg",
          style: {
            background: "#FDFBF7",
            color: "#1A1A1A",
          },
        }}
      />

      <Navbar currentPage={currentPage} onPageChange={handlePageChange} />

      <main className="flex-grow relative z-[1]">
        {renderContent()}
      </main>

      {/* 5. Footer */}
      <Footer onPageChange={handlePageChange} />
    </div>
  );
}
