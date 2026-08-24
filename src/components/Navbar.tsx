import React, { useState } from 'react';
import {
  Heart,
  Globe,
  Mic,
  Calendar,
  User as UserIcon,
  ShoppingBag,
  Stethoscope,
  BookOpen,
  Users,
  Shield,
  Activity,
  LogOut,
  Bell,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  Layers,
  Cpu,
  TrendingUp,
  Dumbbell,
  Leaf,
} from 'lucide-react';
import { LanguageCode, Role, User } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/translations';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLanguage: LanguageCode;
  setCurrentLanguage: (lang: LanguageCode) => void;
  onOpenVoiceSaathi: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup' | 'otp') => void;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpen3DModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  currentLanguage,
  setCurrentLanguage,
  onOpenVoiceSaathi,
  onOpenAuth,
  onLogout,
  cartCount,
  onOpenCart,
  onOpen3DModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const t = (key: string) => getTranslation(currentLanguage, key);

  // Role-based Nav items
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { id: 'landing', label: t('navHome'), icon: Heart },
        { id: 'screening', label: t('navScreen'), icon: Activity },
        { id: 'progress_tracker', label: t('navProgressTracker'), icon: TrendingUp },
        { id: 'exercise_portal', label: t('navExercisePortal'), icon: Dumbbell },
        { id: 'home_remedies', label: t('navHomeRemedies'), icon: Leaf },
        { id: 'smart_kit', label: t('navSmartKit'), icon: Cpu },
        { id: 'anatomy3d', label: t('navAnatomy3D'), icon: Layers, isAction: true },
        { id: 'doctors', label: t('navDoctors'), icon: Stethoscope },
        { id: 'knowledge', label: t('navKnowledgeHub'), icon: BookOpen },
        { id: 'store', label: t('navCareStore'), icon: ShoppingBag },
        { id: 'community', label: t('navCommunity'), icon: Users },
      ];
    }

    if (currentUser.role === 'ASHA') {
      return [
        { id: 'asha_dashboard', label: t('ashaFieldPortal'), icon: Users },
        { id: 'screening', label: t('beneficiaryScreening'), icon: Activity },
        { id: 'progress_tracker', label: t('beneficiaryProgress'), icon: TrendingUp },
        { id: 'home_remedies', label: t('ayushRemedies'), icon: Leaf },
        { id: 'smart_kit', label: t('communityKit'), icon: Cpu },
        { id: 'anatomy3d', label: t('pelvicDemo'), icon: Layers, isAction: true },
        { id: 'community', label: t('villageCamps'), icon: Globe },
        { id: 'knowledge', label: t('trainingGuides'), icon: BookOpen },
      ];
    }

    if (currentUser.role === 'DOCTOR') {
      return [
        { id: 'doctor_dashboard', label: t('doctorLogin'), icon: Stethoscope },
        { id: 'progress_tracker', label: t('patientTelemetry'), icon: TrendingUp },
        { id: 'doctors', label: t('doctorDirectory'), icon: UserIcon },
        { id: 'smart_kit', label: t('navSmartKit'), icon: Cpu },
        { id: 'anatomy3d', label: t('navAnatomy3D'), icon: Layers, isAction: true },
        { id: 'knowledge', label: t('clinicalHub'), icon: BookOpen },
      ];
    }

    if (currentUser.role === 'NGO') {
      return [
        { id: 'ngo_dashboard', label: t('ngoOperations'), icon: Users },
        { id: 'community', label: t('ruralCampaigns'), icon: Globe },
        { id: 'home_remedies', label: t('navHomeRemedies'), icon: Leaf },
        { id: 'smart_kit', label: t('navSmartKit'), icon: Cpu },
        { id: 'anatomy3d', label: t('navAnatomy3D'), icon: Layers, isAction: true },
        { id: 'store', label: t('subsidizedKits'), icon: ShoppingBag },
      ];
    }

    if (currentUser.role === 'ADMIN') {
      return [
        { id: 'admin_dashboard', label: t('adminAnalytics'), icon: Shield },
        { id: 'screening', label: t('screeningEngine'), icon: Activity },
        { id: 'progress_tracker', label: t('navProgressTracker'), icon: TrendingUp },
        { id: 'smart_kit', label: t('navSmartKit'), icon: Cpu },
        { id: 'doctors', label: t('navDoctors'), icon: Stethoscope },
        { id: 'community', label: t('villageCamps'), icon: Globe },
        { id: 'store', label: t('navCareStore'), icon: ShoppingBag },
      ];
    }

    // Default USER
    return [
      { id: 'landing', label: t('navHome'), icon: Heart },
      { id: 'screening', label: t('navScreen'), icon: Activity },
      { id: 'progress_tracker', label: t('navProgressTracker'), icon: TrendingUp },
      { id: 'exercise_portal', label: t('navExercisePortal'), icon: Dumbbell },
      { id: 'home_remedies', label: t('navHomeRemedies'), icon: Leaf },
      { id: 'period_tracker', label: t('navPeriodTracker'), icon: Calendar },
      { id: 'health_journey', label: t('navHealthJourney'), icon: Activity },
      { id: 'doctors', label: t('navDoctors'), icon: Stethoscope },
      { id: 'smart_kit', label: t('navSmartKit'), icon: Cpu },
      { id: 'anatomy3d', label: t('navAnatomy3D'), icon: Layers, isAction: true },
      { id: 'knowledge', label: t('navKnowledgeHub'), icon: BookOpen },
      { id: 'store', label: t('navCareStore'), icon: ShoppingBag },
      { id: 'community', label: t('navCommunity'), icon: Users },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 bg-[#140c1d]/90 backdrop-blur-md border-b border-rose-500/20 text-slate-100 shadow-lg shadow-rose-950/20">
      {/* Top Emergency & ASHA Support Quick Bar */}
      <div className="bg-[#0b0611] border-b border-rose-950/80 text-rose-200/80 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
              StreeSure Care
            </span>
            <span className="hidden sm:inline text-rose-200/70 text-[11px]">
              {t('disclaimerBar')}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <a
              href="tel:104"
              className="flex items-center gap-1.5 hover:underline text-rose-200 font-medium"
              title="National Women Health Helpline"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>{t('helplineText')}</span>
            </a>
            <span className="text-rose-900">|</span>
            <button
              onClick={onOpenVoiceSaathi}
              className="flex items-center gap-1 font-bold text-pink-300 hover:text-pink-200 transition"
            >
              <Mic className="w-3 h-3 text-rose-400 animate-pulse" />
              <span>{t('talkToVoiceSaathi')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="brand-logo-btn"
              onClick={() => setActiveTab(currentUser ? (currentUser.role === 'USER' ? 'landing' : `${currentUser.role.toLowerCase()}_dashboard`) : 'landing')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden group"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-500 to-fuchsia-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] group-hover:scale-105 transition-transform font-black text-lg border border-white/20">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-pink-200 font-sans">
                    STREESURE
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                    v1.4
                  </span>
                </div>
                <p className="text-[10px] text-rose-300/70 font-medium leading-none">
                  {t('tagline')}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;

              if (link.isAction) {
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={onOpen3DModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 transition border border-pink-500/30 hover:border-pink-500/50 shadow-sm"
                  >
                    <Icon className="w-3.5 h-3.5 text-pink-400" />
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    isActive
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5">
            {/* Voice Saathi Quick Trigger Button */}
            <button
              type="button"
              id="btn-voice-saathi-nav"
              onClick={onOpenVoiceSaathi}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-rose-primary text-xs font-bold transition-all hover:scale-102"
            >
              <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
              <span className="hidden sm:inline">{t('talkToVoiceSaathi')}</span>
              <span className="text-[9px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono font-bold">AI</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <select
                id="select-language"
                aria-label="Select Application Language"
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as LanguageCode)}
                className="appearance-none bg-[#1e1329] hover:bg-[#281938] text-rose-100 text-xs font-semibold pl-7 pr-4 py-1.5 rounded-full border border-rose-500/30 cursor-pointer focus:outline-none focus:border-rose-400 transition"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#190e24] text-slate-100">
                    {lang.nativeLabel} ({lang.label})
                  </option>
                ))}
              </select>
              <Globe className="w-3.5 h-3.5 text-rose-400 absolute left-2.5 top-2 pointer-events-none" />
            </div>

            {/* Shopping Cart Button */}
            <button
              type="button"
              id="btn-cart"
              onClick={onOpenCart}
              className="relative p-2 rounded-full text-rose-200 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition"
              title="Affordable Care Store Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-100 truncate max-w-[140px]">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-300 uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-logout"
                  onClick={onLogout}
                  title={t('signOut')}
                  className="p-2 rounded-full text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  id="btn-sign-in-nav"
                  onClick={() => onOpenAuth('signin')}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-rose-100 border border-rose-500/30 text-xs font-semibold transition"
                >
                  {t('signIn')}
                </button>
                <button
                  type="button"
                  id="btn-register-nav"
                  onClick={() => onOpenAuth('signup')}
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-full btn-rose-primary text-white text-xs font-bold transition shadow-xs"
                >
                  {t('register')}
                </button>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              type="button"
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-rose-200 hover:bg-rose-500/20 border border-rose-500/30 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-rose-500/20 bg-[#160d21] px-4 pt-3 pb-5 shadow-2xl space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;

            return (
              <button
                key={link.id}
                onClick={() => {
                  if (link.isAction) {
                    onOpen3DModal();
                  } else {
                    setActiveTab(link.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-200 font-bold border border-rose-500/40'
                    : 'text-slate-300 hover:bg-rose-500/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-rose-500/20 flex items-center justify-between">
            <span className="text-xs text-rose-300/70">Emergency 24x7:</span>
            <a href="tel:104" className="text-xs font-bold text-rose-400">
              Dial 104 / 181
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
