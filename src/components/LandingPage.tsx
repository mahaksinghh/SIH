import React from 'react';
import {
  Activity,
  Mic,
  Stethoscope,
  BookOpen,
  Heart,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShoppingBag,
  Globe2,
  HelpCircle,
  Clock,
  Award,
  Lock,
  ChevronRight,
  PhoneCall,
  Volume2,
  Calendar,
  TrendingUp,
  Dumbbell,
  Leaf,
  Cpu,
  RefreshCw,
  Share2,
  FileCheck,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { getTranslation } from '../services/translations';
import { ThreeDModel } from './ThreeDModel';

interface LandingPageProps {
  currentLanguage: LanguageCode;
  onStartScreening: () => void;
  onOpenVoiceSaathi: () => void;
  onFindDoctor: () => void;
  onExploreKnowledge: () => void;
  onOpen3DModal: () => void;
  onOpenStore: () => void;
  onOpenCommunity: () => void;
  onSwitchToRole: (roleKey: string) => void;
  onOpenAuth?: (mode?: 'signin' | 'signup' | 'otp') => void;
  onOpenSmartKit?: () => void;
  onOpenProgressTracker?: () => void;
  onOpenExercisePortal?: () => void;
  onOpenHomeRemedies?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentLanguage,
  onStartScreening,
  onOpenVoiceSaathi,
  onFindDoctor,
  onExploreKnowledge,
  onOpen3DModal,
  onOpenStore,
  onOpenCommunity,
  onSwitchToRole,
  onOpenAuth,
  onOpenSmartKit,
  onOpenProgressTracker,
  onOpenExercisePortal,
  onOpenHomeRemedies,
}) => {
  const t = (key: string) => getTranslation(currentLanguage, key);

  return (
    <div className="w-full bg-[#0D0914] text-slate-100 overflow-hidden font-sans">
      {/* ========================================================
          1. HERO SECTION
          ======================================================== */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-rose-500/20 overflow-hidden">
        {/* Soft atmospheric background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-rose-600/10 via-pink-600/10 to-purple-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>{t('heroPill')}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-white leading-[1.15]">
                {t('heroTitlePrefix')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-purple-300">
                  {t('heroTitleGradient')}
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-rose-100/80 leading-relaxed max-w-2xl">
                {t('heroSubtitle')}
              </p>

              {/* Primary & Secondary Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  id="hero-primary-cta"
                  onClick={onStartScreening}
                  className="px-8 py-4 rounded-full btn-rose-primary text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:scale-[1.02] active:scale-95 transition flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>{t('startScreening')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="hero-secondary-cta"
                  onClick={() => {
                    const el = document.getElementById('how-it-works-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-4 rounded-full bg-[#1b1026]/90 hover:bg-[#251336] text-rose-100 font-bold text-sm border border-rose-500/30 transition hover:border-rose-400 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-pink-400" />
                  <span>{t('exploreHealth')}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenVoiceSaathi}
                  className="px-5 py-4 rounded-full bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 font-bold text-sm border border-purple-500/30 transition flex items-center gap-2"
                >
                  <Mic className="w-4 h-4 text-pink-400 animate-pulse" />
                  <span>{t('talkToVoiceSaathi')}</span>
                </button>
              </div>

              {/* Quick Role Switcher Pill Bar for SIH Presentation */}
              <div className="pt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-rose-300/70 font-medium">{t('quickRoleDemo')}</span>
                <button
                  type="button"
                  onClick={() => onSwitchToRole('asha')}
                  className="px-3 py-1 rounded-full bg-[#170e22] border border-teal-500/40 hover:bg-teal-950/50 font-semibold text-teal-300 transition"
                >
                  👩🏽‍⚕️ {t('ashaWorkerLogin')}
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchToRole('doctor')}
                  className="px-3 py-1 rounded-full bg-[#170e22] border border-purple-500/40 hover:bg-purple-950/50 font-semibold text-purple-300 transition"
                >
                  🩺 {t('doctorLogin')}
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchToRole('ngo')}
                  className="px-3 py-1 rounded-full bg-[#170e22] border border-rose-500/40 hover:bg-rose-950/50 font-semibold text-rose-300 transition"
                >
                  🤝 {t('ngoPartnerLogin')}
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Dashboard Mockup Card */}
            <div className="lg:col-span-5">
              <div className="glass-blossom-glow rounded-3xl p-5 sm:p-6 border border-rose-500/30 shadow-2xl relative space-y-4">
                {/* Mockup Header */}
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-bold text-white tracking-wide">Live Screening Summary Preview</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    Screening ≠ Diagnosis
                  </span>
                </div>

                {/* Simulated Menstrual & Metabolic Cycle Card */}
                <div className="p-3.5 rounded-2xl bg-[#140b1e] border border-rose-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-rose-200 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-pink-400" />
                      Cycle Regularity Pattern
                    </span>
                    <span className="text-amber-300 font-bold">42 Days Interval</span>
                  </div>
                  {/* Progress Bar (Questionnaire Completion) */}
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 h-full w-4/5 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] text-rose-300/70">
                    <span>Screening Progress: 10 / 12 questions</span>
                    <span>85% completed</span>
                  </div>
                </div>

                {/* 3 Contributing Factor Pills */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-rose-200">
                    Contributing Factors Identified:
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-xl bg-amber-950/60 text-amber-200 border border-amber-500/30">
                      <span className="block font-bold text-amber-300">Ovulatory</span>
                      Delayed Rhythm
                    </div>
                    <div className="p-2 rounded-xl bg-rose-950/60 text-rose-200 border border-rose-500/30">
                      <span className="block font-bold text-rose-300">Androgenic</span>
                      Facial Hair Cues
                    </div>
                    <div className="p-2 rounded-xl bg-purple-950/60 text-purple-200 border border-purple-500/30">
                      <span className="block font-bold text-purple-300">Metabolic</span>
                      Weight Trend
                    </div>
                  </div>
                </div>

                {/* Recommendation Strip */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/50 to-rose-950/50 border border-rose-500/30 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-[11px]">Recommended Next Step:</div>
                    <div className="text-[10px] text-rose-200/80">Talk to a qualified healthcare professional</div>
                  </div>
                  <button
                    type="button"
                    onClick={onFindDoctor}
                    className="px-3 py-1.5 rounded-full btn-rose-primary text-[10px] font-bold text-white shrink-0"
                  >
                    View Doctors ↗
                  </button>
                </div>

                {/* Quick Voice Saathi trigger banner inside mockup */}
                <button
                  type="button"
                  onClick={onOpenVoiceSaathi}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#1d1028] hover:bg-[#281538] border border-pink-500/30 text-xs font-semibold text-pink-300 flex items-center justify-center gap-2 transition"
                >
                  <Mic className="w-3.5 h-3.5 text-pink-400" />
                  <span>Speak with Voice Saathi in Hindi, Bengali, Tamil...</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. TRUST STRIP
          ======================================================== */}
      <section className="py-8 bg-[#11081a] border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-300/80">
              {t('featuresSubheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#160c22] border border-rose-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">{t('statExplainable')}</h4>
                <p className="text-[11px] text-rose-200/70">{t('statExplainableDesc')}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#160c22] border border-rose-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">{t('statLanguages')}</h4>
                <p className="text-[11px] text-rose-200/70">{t('statLanguagesDesc')}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#160c22] border border-rose-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">{t('statSubsidized')}</h4>
                <p className="text-[11px] text-rose-200/70">{t('statSubsidizedDesc')}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#160c22] border border-rose-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">{t('statOffline')}</h4>
                <p className="text-[11px] text-rose-200/70">{t('statOfflineDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. HOW STREESURE WORKS (4 STEPS)
          ======================================================== */}
      <section id="how-it-works-section" className="py-16 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              {t('howItWorksHeading')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {t('howItWorksHeading')}
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/80 mt-2">
              {t('howItWorksSubheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="glass-blossom-card p-6 rounded-2xl border border-rose-500/20 relative hover:border-rose-400 transition">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step1Title')}</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-blossom-card p-6 rounded-2xl border border-amber-500/20 relative hover:border-amber-400 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step2Title')}</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-blossom-card p-6 rounded-2xl border border-teal-500/20 relative hover:border-teal-400 transition">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step3Title')}</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-blossom-card p-6 rounded-2xl border border-purple-500/20 relative hover:border-purple-400 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t('step4Title')}</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                {t('step4Desc')}
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={onStartScreening}
              className="px-8 py-3.5 rounded-full btn-rose-primary text-white font-bold text-xs shadow-lg transition hover:scale-[1.02]"
            >
              {t('startScreening')}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. WHY PCOS AWARENESS MATTERS
          ======================================================== */}
      <section className="py-16 bg-[#12091b] border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Grassroots Realities in India
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Why PCOS Awareness Matters
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/80 mt-2">
              Breaking silence and taboos around reproductive health in rural and urban communities alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-blossom-card p-6 rounded-2xl border border-rose-500/20">
              <div className="text-4xl font-black text-rose-400 mb-2">1 in 5</div>
              <h3 className="text-base font-bold text-white mb-2">High Prevalence in Indian Women</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                PCOS affects nearly 20% of reproductive-age women in India, often accompanied by menstrual irregularity, hormonal acne, or metabolic variation.
              </p>
            </div>

            <div className="glass-blossom-card p-6 rounded-2xl border border-amber-500/20">
              <div className="text-4xl font-black text-amber-400 mb-2">70%</div>
              <h3 className="text-base font-bold text-white mb-2">Remain Undiagnosed for Years</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Due to social stigma, lack of privacy, and scarce specialist care in rural areas, many women silently endure manageable symptoms for years.
              </p>
            </div>

            <div className="glass-blossom-card p-6 rounded-2xl border border-teal-500/20">
              <div className="text-4xl font-black text-teal-400 mb-2">Early Care</div>
              <h3 className="text-base font-bold text-white mb-2">Empowering Informed Actions</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Early symptom awareness and timely clinical consultations help prevent long-term metabolic, fertility, and cardiovascular complications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. VOICE SAATHI (AI VOICE COMPANION)
          ======================================================== */}
      <section className="py-16 bg-[#160c24] border-b border-rose-500/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                <Mic className="w-3.5 h-3.5 text-pink-400" />
                <span>{t('medicalNotice')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {t('voiceBannerHeading')}
              </h2>
              <p className="text-lg font-medium text-pink-300">
                {t('voiceBannerSubheading')}
              </p>
              <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed max-w-xl">
                {t('statLanguagesDesc')}
              </p>

              {/* Conversational Speech Bubbles */}
              <div className="p-4 rounded-2xl bg-[#1b1028] border border-purple-500/30 space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-[10px] font-bold">User:</span>
                  <p className="text-xs text-rose-100 italic">
                    {t('sampleVoicePrompt1')}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold">Voice Saathi:</span>
                  <p className="text-xs text-pink-200">
                    {t('sampleVoicePrompt2')}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  id="btn-voice-saathi-feature"
                  onClick={onOpenVoiceSaathi}
                  className="px-6 py-3.5 rounded-full btn-rose-primary text-white font-bold text-xs shadow-lg flex items-center gap-2 hover:scale-[1.02] transition"
                >
                  <Mic className="w-4 h-4 text-white animate-pulse" />
                  <span>{t('voiceBannerBtn')}</span>
                </button>
              </div>
            </div>

            {/* Right: Visual Microphone Wave Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-purple-500/20 p-4 flex items-center justify-center border border-rose-500/30 shadow-2xl">
                <div className="w-48 h-48 rounded-full bg-[#180e24] border border-rose-500/40 flex flex-col items-center justify-center text-center p-4 shadow-2xl">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white mb-2 shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs font-bold text-white">{t('talkToVoiceSaathi')}</span>
                  <span className="text-[10px] text-pink-300">{t('tagline')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. ASHA / COMMUNITY HEALTHCARE MODE
          ======================================================== */}
      <section className="py-16 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                {t('featCommunityTitle')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t('ashaFieldPortal')}
              </h2>
              <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
                {t('featCommunityDesc')}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSwitchToRole('asha')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition shadow-md"
                >
                  <Users className="w-4 h-4" />
                  <span>{t('ashaFieldPortal')}</span>
                </button>
              </div>
            </div>

            {/* ASHA Field Card Preview */}
            <div className="lg:col-span-6">
              <div className="glass-blossom-card rounded-2xl p-6 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                  <h4 className="text-xs font-bold text-rose-200 uppercase">
                    {t('beneficiaryScreening')}
                  </h4>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold px-2.5 py-0.5 rounded-full">
                    {t('demoModeNotice')}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="bg-[#12081a] p-3 rounded-xl border border-rose-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Kavita Meena (22 yrs)</span>
                      <span className="text-[10px] text-rose-300/70">Govindgarh Ward 3 • Cycle delays (45d)</span>
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {t('levelOrange')}
                    </span>
                  </div>

                  <div className="bg-[#12081a] p-3 rounded-xl border border-rose-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Pooja Choudhary (26 yrs)</span>
                      <span className="text-[10px] text-rose-300/70">Nangal Kalan • Skipped 3+ months</span>
                    </div>
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {t('levelRed')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. EXPLAINABLE SCREENING (ROTTERDAM 2023 BREAKDOWN)
          ======================================================== */}
      <section className="py-16 bg-[#12091b] border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              {t('rotterdamHeading')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {t('rotterdamHeading')}
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/80 mt-2">
              {t('rotterdamSubheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-blossom-card p-5 rounded-2xl border border-rose-500/20">
              <h3 className="text-sm font-bold text-white mb-1">{t('rotterdamPillar1')}</h3>
              <p className="text-xs text-rose-200/70">
                {t('rotterdamPillar1Desc')}
              </p>
            </div>

            <div className="glass-blossom-card p-5 rounded-2xl border border-rose-500/20">
              <h3 className="text-sm font-bold text-white mb-1">{t('rotterdamPillar2')}</h3>
              <p className="text-xs text-rose-200/70">
                {t('rotterdamPillar2Desc')}
              </p>
            </div>

            <div className="glass-blossom-card p-5 rounded-2xl border border-rose-500/20">
              <h3 className="text-sm font-bold text-white mb-1">{t('rotterdamPillar3')}</h3>
              <p className="text-xs text-rose-200/70">
                {t('rotterdamPillar3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. 3D EDUCATION & ANATOMY VIEWER
          ======================================================== */}
      <section className="py-16 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                {t('navAnatomy3D')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t('feat3DTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
                {t('feat3DDesc')}
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpen3DModal}
                  className="px-5 py-2.5 rounded-full btn-rose-primary text-white text-xs font-bold flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>{t('feat3DBtn')}</span>
                </button>
                <button
                  type="button"
                  onClick={onExploreKnowledge}
                  className="px-5 py-2.5 rounded-full bg-[#1b1028] text-rose-200 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/20 transition"
                >
                  <span>{t('navKnowledgeHub')}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="glass-blossom-card p-4 rounded-3xl border border-rose-500/30">
                <ThreeDModel initialMode="pcos" interactive={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. REFERRAL + FOLLOW-UP TIMELINE
          ======================================================== */}
      <section className="py-16 bg-[#130a1e]/60 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Continuous Care Pathway
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Referral & Follow-Up Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/80 mt-2">
              StreeSure bridges the gap between self-screening and real-world clinical resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-[#170e22] border border-emerald-500/30 text-center space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-300 uppercase block">Step 1</span>
              <h4 className="text-xs font-bold text-white">SCREENING</h4>
              <p className="text-[10px] text-rose-200/70">Initial questionnaire completed</p>
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">Completed</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#170e22] border border-amber-500/30 text-center space-y-1.5">
              <span className="text-[10px] font-bold text-amber-300 uppercase block">Step 2</span>
              <h4 className="text-xs font-bold text-white">RESULT EXPLAINED</h4>
              <p className="text-[10px] text-rose-200/70">Contributing factors broken down</p>
              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold">Understood</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#170e22] border border-rose-500/30 text-center space-y-1.5">
              <span className="text-[10px] font-bold text-rose-300 uppercase block">Step 3</span>
              <h4 className="text-xs font-bold text-white">REFERRAL</h4>
              <p className="text-[10px] text-rose-200/70">Guided connection to doctor / PHC</p>
              <span className="inline-block px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-bold">Referred</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#170e22] border border-purple-500/30 text-center space-y-1.5">
              <span className="text-[10px] font-bold text-purple-300 uppercase block">Step 4</span>
              <h4 className="text-xs font-bold text-white">CONSULTATION</h4>
              <p className="text-[10px] text-rose-200/70">Medical evaluation & advice</p>
              <span className="inline-block px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold">In Progress</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#170e22] border border-teal-500/30 text-center space-y-1.5">
              <span className="text-[10px] font-bold text-teal-300 uppercase block">Step 5</span>
              <h4 className="text-xs font-bold text-white">FOLLOW-UP</h4>
              <p className="text-[10px] text-rose-200/70">30/90-day progress check</p>
              <span className="inline-block px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[9px] font-bold">Scheduled</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          10. STREESURE SENSE — RESEARCH PROTOTYPE
          ======================================================== */}
      <section className="py-16 border-b border-rose-500/20 bg-gradient-to-b from-[#13081c]/60 via-[#180b22]/90 to-[#100617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1d0d2a] via-[#241033] to-[#12081c] border-2 border-pink-500/30 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Hardware R&D Prototype
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">
                    Research / Engineering Prototype • Clinical Validation Required
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  StreeSure Sense — Research Prototype
                </h2>

                <p className="text-base font-semibold text-pink-300">
                  An experimental low-cost optical sensing module designed to explore colorimetric and metabolic measurements.
                </p>

                <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
                  Architecture: ESP32-S3 + TCS34725 Colorimeter Sensor + Controlled Light Chamber + BLE Connectivity to the StreeSure screening app.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenSmartKit}
                    className="px-6 py-3 rounded-full btn-berry-primary text-xs font-bold shadow-lg flex items-center gap-2 hover:scale-[1.02] transition"
                  >
                    <Cpu className="w-4 h-4 text-white" />
                    <span>Explore Hardware Specs & Simulator</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0d0614] border border-pink-500/30 space-y-2 text-xs font-mono">
                <div className="text-pink-300 font-bold border-b border-rose-500/20 pb-1">
                  PROTOTYPE SPECS
                </div>
                <div className="flex justify-between text-rose-200/80">
                  <span>Controller:</span>
                  <span className="text-white font-bold">ESP32-S3</span>
                </div>
                <div className="flex justify-between text-rose-200/80">
                  <span>Colorimeter:</span>
                  <span className="text-white font-bold">TCS34725 RGBC</span>
                </div>
                <div className="flex justify-between text-rose-200/80">
                  <span>Connection:</span>
                  <span className="text-white font-bold">BLE 5.3 Encrypted</span>
                </div>
                <div className="text-[10px] text-amber-300 pt-2 border-t border-rose-500/20">
                  ⚠️ Prototype for exploratory research only. Not for independent diagnosis.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          11. STREESURE ESSENTIALS (CARE STORE)
          ======================================================== */}
      <section className="py-16 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                StreeSure Essentials
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Need Period Essentials? Find Affordable Products Near You.
              </h2>
              <p className="text-xs text-rose-200/70 mt-1">
                Subsidized eco-friendly menstrual care for rural and community access (Sample Catalog).
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenStore}
              className="inline-flex items-center gap-1 text-xs font-bold text-pink-400 hover:text-pink-300"
            >
              <span>View All Essentials</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-blossom-card rounded-2xl p-4 border border-rose-500/20 space-y-3">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Subsidized ₹49
              </span>
              <h4 className="text-sm font-bold text-white">Anandi Bio-Organic Sanitary Pads (Pack of 10)</h4>
              <p className="text-xs text-rose-200/70">100% plant-fibre, chemical-free, biodegradable.</p>
              <button
                type="button"
                onClick={onOpenStore}
                className="w-full py-2 rounded-xl bg-rose-500/20 text-rose-200 text-xs font-bold hover:bg-rose-500/30 transition"
              >
                View in Essentials
              </button>
            </div>

            <div className="glass-blossom-card rounded-2xl p-4 border border-rose-500/20 space-y-3">
              <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-bold">
                Long-lasting ₹189
              </span>
              <h4 className="text-sm font-bold text-white">Reusable Cotton Cloth Pad Kit (Set of 4)</h4>
              <p className="text-xs text-rose-200/70">Washable, leak-proof organic cotton with snap buttons.</p>
              <button
                type="button"
                onClick={onOpenStore}
                className="w-full py-2 rounded-xl bg-pink-500/20 text-pink-200 text-xs font-bold hover:bg-pink-500/30 transition"
              >
                View in Essentials
              </button>
            </div>

            <div className="glass-blossom-card rounded-2xl p-4 border border-rose-500/20 space-y-3">
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                FDA-grade ₹199
              </span>
              <h4 className="text-sm font-bold text-white">Medical-Grade Silicone Menstrual Cup</h4>
              <p className="text-xs text-rose-200/70">Ultra-soft hypoallergenic silicone with sterilizer case.</p>
              <button
                type="button"
                onClick={onOpenStore}
                className="w-full py-2 rounded-xl bg-purple-500/20 text-purple-200 text-xs font-bold hover:bg-purple-500/30 transition"
              >
                View in Essentials
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          12. PRIVACY & SECURITY
          ======================================================== */}
      <section className="py-16 bg-[#12091b] border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-blossom-glow rounded-3xl p-8 lg:p-10 border border-rose-500/30 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy-First Architecture</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold">
                  Your Privacy & Data Confidentiality
                </h2>
                <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
                  Your health information is never sold or shared without your explicit consent. StreeSure enforces role-based access control so only you and authorized health workers can view your screening records.
                </p>
              </div>

              <div className="lg:col-span-4 bg-[#140b1e] p-5 rounded-2xl border border-rose-500/30 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-xs font-bold text-white">Consent-Driven Access</h4>
                <p className="text-[11px] text-rose-200/70">
                  Data Protection compliant with local and national privacy standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          13. FREQUENTLY ASKED QUESTIONS
          ======================================================== */}
      <section className="py-16 bg-[#130a1e]/60 border-b border-rose-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              {t('faqHeading')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {t('faqHeading')}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="glass-blossom-card p-5 rounded-2xl border border-rose-500/20">
              <h3 className="text-sm font-bold text-white mb-1">
                {t('faqQ1')}
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed">
                {t('faqA1')}
              </p>
            </div>

            <div className="glass-blossom-card p-5 rounded-2xl border border-rose-500/20">
              <h3 className="text-sm font-bold text-white mb-1">
                {t('faqQ2')}
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed">
                {t('faqA2')}
              </p>
            </div>

            <div className="glass-blossom-card p-5 rounded-2xl border border-rose-500/20">
              <h3 className="text-sm font-bold text-white mb-1">
                {t('faqQ3')}
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed">
                {t('faqA3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          14. BOTTOM CALL TO ACTION
          ======================================================== */}
      <section className="py-16 bg-gradient-to-r from-rose-950/90 via-[#260f2c]/90 to-fuchsia-950/90 border-t border-rose-500/30 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black">
            {t('ctaHeading')}
          </h2>
          <p className="text-rose-200 text-xs sm:text-sm max-w-xl mx-auto">
            {t('ctaSubheading')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              type="button"
              onClick={onStartScreening}
              className="px-8 py-4 rounded-full btn-rose-primary text-white font-bold text-sm shadow-xl hover:scale-[1.02] transition"
            >
              {t('startScreening')}
            </button>
            <button
              type="button"
              onClick={onOpenVoiceSaathi}
              className="px-6 py-4 rounded-full bg-[#1e1329] hover:bg-[#2a1a3a] text-rose-100 font-bold text-sm border border-rose-500/30 transition flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>{t('talkToVoiceSaathi')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
