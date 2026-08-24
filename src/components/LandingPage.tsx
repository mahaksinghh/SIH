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
    <div className="w-full bg-[#0D0914] blossom-mesh-bg text-slate-100 selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* Ambient Floating Glow Orbs for Soft Feminine Atmosphere */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-ring -z-10" />
      <div className="absolute top-80 right-10 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none animate-float-gentle -z-10" />
      <div className="absolute top-[1400px] left-10 w-96 h-96 bg-pink-500/8 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>AI-Assisted Women's Health & PCOS Early Screening Care Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-pink-200">
                  STREESURE
                </span>
                <span className="block text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-rose-400 mt-2 tracking-normal italic">
                  "Listen. Screen. Understand. Connect."
                </span>
              </h1>

              <p className="text-base sm:text-lg text-rose-100/90 max-w-2xl font-normal leading-relaxed">
                {t('heroSubtitle')}
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  id="hero-btn-start-screening"
                  onClick={onStartScreening}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full btn-rose-primary text-sm font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Activity className="w-4 h-4 text-white" />
                  <span>{t('startScreening')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="hero-btn-voice-saathi"
                  onClick={onOpenVoiceSaathi}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#1e1329] hover:bg-[#2a1a3a] text-rose-100 text-sm font-bold border border-rose-500/30 shadow-sm transition hover:scale-[1.02] active:scale-95"
                >
                  <Mic className="w-4 h-4 text-pink-400 animate-pulse" />
                  <span>{t('talkToVoiceSaathi')}</span>
                </button>

                <button
                  type="button"
                  id="hero-btn-find-doctor"
                  onClick={onFindDoctor}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#180e24] hover:bg-[#251538] text-rose-300 text-sm font-bold border border-rose-500/30 transition"
                >
                  <Stethoscope className="w-4 h-4 text-rose-400" />
                  <span>{t('findDoctor')} (₹199)</span>
                </button>
              </div>

              {/* Secondary Stakeholder Portals */}
              <div className="pt-4 border-t border-rose-500/20 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-rose-200/80">
                <span className="font-semibold text-rose-300/60">Quick Access:</span>
                {onOpenAuth && (
                  <>
                    <button
                      type="button"
                      id="hero-btn-signin"
                      onClick={() => onOpenAuth('signin')}
                      className="px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 font-bold text-white transition flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3 text-rose-300" />
                      <span>Sign In / OTP</span>
                    </button>
                    <button
                      type="button"
                      id="hero-btn-register"
                      onClick={() => onOpenAuth('signup')}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-600/80 to-pink-600/80 hover:from-rose-600 hover:to-pink-600 border border-rose-400/40 font-bold text-white transition"
                    >
                      ✨ Create Free Account
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => onSwitchToRole('asha')}
                  className="px-3 py-1 rounded-full bg-[#1b1026] border border-rose-500/30 hover:border-rose-400 font-medium text-rose-200 hover:text-white transition"
                >
                  👩‍⚕️ {t('ashaWorkerLogin')}
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchToRole('ngo')}
                  className="px-3 py-1 rounded-full bg-[#1b1026] border border-rose-500/30 hover:border-teal-400 font-medium text-rose-200 hover:text-white transition"
                >
                  🤝 {t('ngoPartnerLogin')}
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchToRole('doctor')}
                  className="px-3 py-1 rounded-full bg-[#1b1026] border border-rose-500/30 hover:border-purple-400 font-medium text-rose-200 hover:text-white transition"
                >
                  🩺 {t('doctorLogin')}
                </button>
              </div>
            </div>

            {/* Right Column: 3D Anatomical Cycle Preview Card */}
            <div className="lg:col-span-5">
              <div className="glass-blossom-glow rounded-3xl p-5 shadow-2xl relative border border-rose-500/30">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <Layers className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-100 font-sans">
                        Interactive 3D Pelvic & Follicle Model
                      </h3>
                      <p className="text-[10px] text-rose-300/70 font-sans">
                        Real-time ovarian cycle biology & PCOS morphology
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpen3DModal}
                    className="text-[11px] font-bold text-pink-400 hover:text-pink-300 hover:underline"
                  >
                    Full View ↗
                  </button>
                </div>

                {/* 3D Canvas Embed */}
                <ThreeDModel initialMode="pcos" interactive={true} />

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-emerald-950/60 text-emerald-300 p-2.5 rounded-xl border border-emerald-500/30 font-semibold shadow-xs">
                    <span className="block font-bold">Level 1</span> Green (Low Concern)
                  </div>
                  <div className="bg-amber-950/60 text-amber-300 p-2.5 rounded-xl border border-amber-500/30 font-semibold shadow-xs">
                    <span className="block font-bold">Level 2</span> Orange (Evaluate)
                  </div>
                  <div className="bg-rose-950/60 text-rose-300 p-2.5 rounded-xl border border-rose-500/30 font-semibold shadow-xs">
                    <span className="block font-bold">Level 3</span> Red (Clinical Care)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE HEALTHCARE CHALLENGE */}
      <section className="py-16 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
              The Healthcare Challenge in India
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Early Screening & Multilingual Support Save Lives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-blossom-card p-6 rounded-2xl border border-rose-500/20 shadow-md hover:-translate-y-1 transition-all">
              <div className="text-4xl font-extrabold text-rose-400 mb-2">1 in 5</div>
              <h3 className="text-base font-bold text-slate-100 mb-2">
                High Prevalence in Young Women
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed">
                PCOS affects nearly 20% of Indian reproductive-age women, frequently manifesting as irregular cycles, adult acne, hirsutism, and metabolic variations.
              </p>
            </div>

            <div className="glass-blossom-card p-6 rounded-2xl border border-amber-500/20 shadow-md hover:-translate-y-1 transition-all">
              <div className="text-4xl font-extrabold text-amber-400 mb-2">70%</div>
              <h3 className="text-base font-bold text-slate-100 mb-2">
                Remain Undiagnosed for Years
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed">
                Due to social stigma around menstrual health and lack of accessible diagnostic facilities in tier-2/3 villages, many women delay seeking medical evaluation.
              </p>
            </div>

            <div className="glass-blossom-card p-6 rounded-2xl border border-teal-500/20 shadow-md hover:-translate-y-1 transition-all">
              <div className="text-4xl font-extrabold text-teal-400 mb-2">6+ Langs</div>
              <h3 className="text-base font-bold text-slate-100 mb-2">
                Bridging the Digital & Literacy Divide
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed">
                StreeSure enables voice-first interaction in Hindi, Marathi, Bengali, Tamil, Telugu & English, empowering grassroots ASHA workers and beneficiaries alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW STREESURE WORKS (4-STEP ECOSYSTEM) */}
      <section className="py-16 bg-[#120a1c]/60 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
              Our 4-Pillar Care Flow
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              How StreeSure Connects the Ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-blossom-card p-6 rounded-2xl relative hover:border-rose-400 transition hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center font-bold text-lg mb-4 shadow-inner">
                1
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Listen & Voice First</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Voice Saathi listens in native dialects. No complicated typing required. Converts spoken words into structured clinical screening factors.
              </p>
            </div>

            <div className="glass-blossom-card p-6 rounded-2xl relative hover:border-amber-400 transition hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-lg mb-4 shadow-inner">
                2
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Screen & Assess</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Rotterdam-aligned modular screening engine evaluates menstrual, hyperandrogenic, metabolic, and family indicators into Green, Orange, or Red levels.
              </p>
            </div>

            <div className="glass-blossom-card p-6 rounded-2xl relative hover:border-pink-400 transition hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center justify-center font-bold text-lg mb-4 shadow-inner">
                3
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Understand & Explain</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Transparent "Why did I receive this result?" breakdown with clear explanations of what the result means and does NOT mean.
              </p>
            </div>

            <div className="glass-blossom-card p-6 rounded-2xl relative hover:border-purple-400 transition hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold text-lg mb-4 shadow-inner">
                4
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Connect & Consult</h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Connect directly with nearby ASHA workers, book affordable ₹199 teleconsultations with verified Gynecologists, and track health over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VOICE SAATHI SPOTLIGHT */}
      <section className="py-16 bg-[#140b20] border-b border-rose-500/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <Mic className="w-3.5 h-3.5 text-pink-400" />
                <span>Multilingual Voice Navigation Engine</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                "Voice Saathi" — Speaking Your Mother Tongue
              </h2>
              <p className="text-rose-100/80 text-sm leading-relaxed max-w-xl">
                Specially crafted for rural and low-digital-literacy users. Speak in Hindi, Bengali, Marathi, Tamil, Telugu, or English. Voice Saathi understands cycle descriptions and guides you step-by-step.
              </p>

              <div className="p-4 rounded-2xl bg-[#1b1028] border border-rose-500/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Volume2 className="w-4 h-4 text-amber-400" /> Example Hindi Voice Interaction:
                </div>
                <div className="text-xs text-rose-100/90 italic">
                  <strong>User:</strong> "मेरी माहवारी पिछले तीन महीने से ठीक समय पर नहीं आ रही है।"
                </div>
                <div className="text-xs text-pink-300">
                  <strong>Voice Saathi:</strong> "समझ सकती हूँ। माहवारी में बदलाव कई कारणों से हो सकता है। मैं आपसे कुछ सरल सवाल पूछूँगी ताकि आपकी जानकारी के आधार पर स्क्रीनिंग में मदद कर सकूँ।"
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  id="btn-voice-spotlight"
                  onClick={onOpenVoiceSaathi}
                  className="flex items-center gap-2 px-6 py-3 rounded-full btn-rose-primary text-white text-sm font-bold shadow-lg transition hover:scale-102"
                >
                  <Mic className="w-4 h-4 text-white animate-pulse" />
                  <span>Try Voice Saathi Now</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-fuchsia-500/20 p-4 flex items-center justify-center border border-rose-500/30 shadow-2xl animate-float-gentle">
                <div className="w-48 h-48 rounded-full bg-[#180e24] border border-rose-500/40 flex flex-col items-center justify-center text-center p-4 shadow-2xl">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white mb-2 shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs font-bold text-white font-sans">Voice Saathi AI</span>
                  <span className="text-[10px] text-pink-300 font-sans">Empathetic Speech Companion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ASHA WORKER & RURAL COMMUNITY ENABLEMENT */}
      <section className="py-16 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Grassroots Healthcare Impact
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                ASHA Workers: Empowering the Frontline of Rural Health
              </h2>
              <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
                StreeSure gives ASHA workers a dedicated digital toolkit to conduct assisted screenings on their village rounds, track referrals to Primary Health Centres (PHCs), and coordinate awareness camps with local NGOs.
              </p>

              <div className="space-y-2 text-xs text-rose-100/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Beneficiary management with explicit health data consent.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Voice-assisted field screening mode for low-literacy women.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Offline sync support when internet connectivity is intermittent.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSwitchToRole('asha')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition shadow-md"
                >
                  <Users className="w-4 h-4" />
                  <span>Open ASHA Field Portal</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="glass-blossom-card rounded-2xl p-6 border border-rose-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-rose-200 uppercase">
                    Field Screening Status
                  </h4>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold px-2.5 py-0.5 rounded-full">
                    Chomu Block Cluster
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#12081a] p-3 rounded-xl border border-rose-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        Kavita Meena (22 yrs)
                      </span>
                      <span className="text-[11px] text-rose-300/70">
                        Govindgarh Ward 3 • Cycle delays (45d)
                      </span>
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      Level 2 (Orange)
                    </span>
                  </div>

                  <div className="bg-[#12081a] p-3 rounded-xl border border-rose-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        Pooja Choudhary (26 yrs)
                      </span>
                      <span className="text-[11px] text-rose-300/70">
                        Nangal Kalan • Skipped 3+ months
                      </span>
                    </div>
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      Level 3 (Red)
                    </span>
                  </div>

                  <div className="bg-[#12081a] p-3 rounded-xl border border-rose-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        Mamta Saini (19 yrs)
                      </span>
                      <span className="text-[11px] text-rose-300/70">
                        Morija Village • Hygiene counseling
                      </span>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      Level 1 (Green)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 HOLISTIC WELLNESS & PCOS CARE ECOSYSTEM */}
      <section className="py-16 bg-[#160c24]/90 border-b border-rose-500/20 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>Holistic Lifestyle & Long-Term Management</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              PCOS Progress, Movement & Home Remedies
            </h2>
            <p className="text-sm text-rose-100/80 mt-2">
              Empowering women with daily symptom tracking, clinical-grade low-cortisol workouts, and traditional evidence-based Ayush remedies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Daily Progress Tracker */}
            <div className="glass-blossom-card p-6 rounded-3xl border border-rose-500/30 flex flex-col justify-between hover:border-rose-400 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Activity className="w-6 h-6 text-rose-400" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold">
                    Daily Telemetry
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    Streak & Milestones
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">
                  PCOS Progress Tracker
                </h3>
                <p className="text-xs text-rose-200/80 leading-relaxed mb-4">
                  Log your daily water intake, sleep quality, stress, steps, and PCOS-specific symptoms (acne, bloating, mood swings). Visualize 30-day symptom reduction trends.
                </p>
                <div className="bg-[#100618] p-3 rounded-xl border border-rose-500/20 text-[11px] text-rose-300/90 space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span>Active Streak:</span>
                    <strong className="text-white">12 Days 🔥</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Symptom Reduction:</span>
                    <strong className="text-emerald-400">-42% vs Baseline</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenProgressTracker}
                className="w-full py-2.5 rounded-full btn-rose-primary text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <span>Open Progress Tracker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Exercise & Movement Portal */}
            <div className="glass-blossom-card p-6 rounded-3xl border border-teal-500/30 flex flex-col justify-between hover:border-teal-400 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Activity className="w-6 h-6 text-teal-400" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full font-bold">
                    Guided Player
                  </span>
                  <span className="text-[10px] text-teal-300 font-semibold">
                    Low-Cortisol Workouts
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">
                  PCOS Exercise Portal
                </h3>
                <p className="text-xs text-rose-200/80 leading-relaxed mb-4">
                  Curated yoga asanas, slow-paced resistance routines, and zone-2 cardio engineered specifically to lower insulin resistance without triggering cortisol spikes.
                </p>
                <div className="bg-[#100618] p-3 rounded-xl border border-teal-500/20 text-[11px] text-teal-200/90 space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span>Yoga & Strength:</span>
                    <strong className="text-white">6 Verified Routines</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Audio & Timer:</span>
                    <strong className="text-teal-300">Live Voice Coaching</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenExercisePortal}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <span>Explore Exercise Library</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Home Remedies Portal */}
            <div className="glass-blossom-card p-6 rounded-3xl border border-purple-500/30 flex flex-col justify-between hover:border-purple-400 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full font-bold">
                    Ayush & Kitchen Herbs
                  </span>
                  <span className="text-[10px] text-pink-300 font-semibold">
                    Clinical Backing
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">
                  Home Remedies Portal
                </h3>
                <p className="text-xs text-rose-200/80 leading-relaxed mb-4">
                  Evidence-based natural remedies (Spearmint tea for hirsutism, Methi water for insulin sensitivity, Cinnamon, Ashwagandha) with preparation recipes and contraindications.
                </p>
                <div className="bg-[#100618] p-3 rounded-xl border border-purple-500/20 text-[11px] text-purple-200/90 space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span>Evidence Level:</span>
                    <strong className="text-purple-300">Clinically Backed</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingredients:</span>
                    <strong className="text-white">100% Accessible</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenHomeRemedies}
                className="w-full py-2.5 rounded-full btn-berry-primary text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <span>Browse Natural Remedies</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DOCTOR TELECONSULTATION TEASER */}
      <section className="py-16 bg-[#130a1e]/60 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                Qualified Medical Care
              </h2>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                Consult Caring Gynecologists from Home
              </p>
            </div>
            <button
              type="button"
              id="landing-view-all-doctors"
              onClick={onFindDoctor}
              className="inline-flex items-center gap-1 text-xs font-bold text-pink-400 hover:text-pink-300"
            >
              <span>View All Specialists & Slots</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-blossom-card rounded-2xl p-5 border border-rose-500/20 shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1594824813681-3c7ff8b04a91?w=120&h=120&fit=crop&crop=faces"
                    alt="Dr. Ananya Sen"
                    className="w-14 h-14 rounded-2xl object-cover border border-rose-500/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Dr. Ananya Sen</h3>
                    <p className="text-xs text-rose-300 font-medium">MS (OB/GYN), AIIMS Fellow</p>
                    <span className="text-[10px] text-rose-200/60 font-sans">14 Years Experience</span>
                  </div>
                </div>
                <p className="text-xs text-rose-100/80 mb-4 line-clamp-2">
                  Specialist in adolescent menstrual variations, PCOS hormonal care, and reproductive health.
                </p>
              </div>
              <div className="pt-3 border-t border-rose-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-rose-300/70 block">Affordable Fee</span>
                  <span className="text-sm font-bold text-white font-sans">₹199</span>
                </div>
                <button
                  type="button"
                  onClick={onFindDoctor}
                  className="px-4 py-1.5 rounded-full btn-rose-primary text-xs font-bold transition"
                >
                  Book Video Call
                </button>
              </div>
            </div>

            <div className="glass-blossom-card rounded-2xl p-5 border border-rose-500/20 shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=faces"
                    alt="Dr. Meenakshi Sundaram"
                    className="w-14 h-14 rounded-2xl object-cover border border-rose-500/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Dr. Meenakshi Sundaram</h3>
                    <p className="text-xs text-teal-300 font-medium">DNB (OB/GYN), Community Health</p>
                    <span className="text-[10px] text-rose-200/60 font-sans">18 Years Experience</span>
                  </div>
                </div>
                <p className="text-xs text-rose-100/80 mb-4 line-clamp-2">
                  Speaks Tamil, Telugu, Hindi, and English. Extensive experience in rural women's health camps.
                </p>
              </div>
              <div className="pt-3 border-t border-rose-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-rose-300/70 block">Affordable Fee</span>
                  <span className="text-sm font-bold text-white font-sans">₹149</span>
                </div>
                <button
                  type="button"
                  onClick={onFindDoctor}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold transition"
                >
                  Book Video Call
                </button>
              </div>
            </div>

            <div className="glass-blossom-card rounded-2xl p-5 border border-rose-500/20 shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&h=120&fit=crop&crop=faces"
                    alt="Dr. Priya Kulkarni"
                    className="w-14 h-14 rounded-2xl object-cover border border-rose-500/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Dr. Priya Kulkarni</h3>
                    <p className="text-xs text-purple-300 font-medium">MD, DM (Endocrinology)</p>
                    <span className="text-[10px] text-rose-200/60 font-sans">11 Years Experience</span>
                  </div>
                </div>
                <p className="text-xs text-rose-100/80 mb-4 line-clamp-2">
                  Specialist in insulin resistance, thyroid disorders, and metabolic health management.
                </p>
              </div>
              <div className="pt-3 border-t border-rose-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-rose-300/70 block">Specialist Fee</span>
                  <span className="text-sm font-bold text-white font-sans">₹249</span>
                </div>
                <button
                  type="button"
                  onClick={onFindDoctor}
                  className="px-4 py-1.5 rounded-full btn-berry-primary text-xs font-bold transition"
                >
                  Book Video Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6.5 FUTURE SCOPE MODULE: STREESURE SMART SCREENING KIT */}
      <section className="py-16 border-b border-rose-500/20 bg-gradient-to-b from-[#13081c]/60 via-[#180b22]/90 to-[#100617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1d0d2a] via-[#241033] to-[#12081c] border-2 border-pink-500/30 shadow-2xl relative overflow-hidden">
            {/* Glowing background shapes */}
            <div className="absolute -right-16 -top-16 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Future Research & Development
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">
                    Coming Soon — Clinical Validation Required
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  StreeSure Smart Screening Kit
                </h2>

                <p className="text-base sm:text-lg font-semibold text-pink-300">
                  "The next step toward accessible, low-cost women's health screening."
                </p>

                <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed max-w-2xl">
                  An investigational multi-parameter companion hardware concept engineered for rural accessibility. Connecting non-invasive vitals (optical PPG, basal temperature, hemodynamic vitals) via encrypted BLE 5.3 directly into the StreeSure screening engine and ASHA worker workflows.
                </p>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
                  ⚠️ <strong>Investigational Notice:</strong> The kit is NOT currently a clinically validated diagnostic device. It supports preliminary multi-parameter screening in collaboration with healthcare professionals.
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenSmartKit}
                    className="px-6 py-3 rounded-2xl btn-berry-primary text-xs font-bold shadow-lg flex items-center gap-2 hover:scale-102 transition"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Explore Smart Kit Architecture & Simulator</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  <button
                    type="button"
                    onClick={onStartScreening}
                    className="px-5 py-3 rounded-2xl bg-rose-950/70 hover:bg-rose-900/70 text-rose-200 border border-rose-500/30 text-xs font-semibold transition"
                  >
                    Try Current Digital Screening
                  </button>
                </div>
              </div>

              {/* Right Mini Spec Card */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0d0614] border border-pink-500/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                  <span className="text-pink-400 font-bold">HARDWARE PROFILE</span>
                  <span className="text-[10px] text-emerald-400">TRL-3 R&D</span>
                </div>
                <div className="space-y-2 text-[11px] text-rose-200/80">
                  <div className="flex justify-between">
                    <span>Microcontroller:</span>
                    <strong className="text-white">ESP32-S3 Dual-Core</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Crypto Enclave:</span>
                    <strong className="text-white">ATECC608A AES-256</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Display:</span>
                    <strong className="text-white">0.96" OLED Daylight</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery Life:</span>
                    <strong className="text-white">7 Days (Solar/USB-C)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>ASHA Integration:</span>
                    <strong className="text-pink-300">Voice Saathi Audio</strong>
                  </div>
                </div>
                <div className="pt-2 text-[10px] text-center text-rose-400 border-t border-rose-500/20">
                  Non-Invasive First • Zero Diagnostic Claims
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AFFORDABLE CARE STORE HIGHLIGHT */}
      <section className="py-16 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                StreeSure Care Store
              </h2>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                Affordable & Sustainable Menstrual Hygiene
              </p>
            </div>
            <button
              type="button"
              id="landing-view-all-store"
              onClick={onOpenStore}
              className="inline-flex items-center gap-1 text-xs font-bold text-pink-400 hover:text-pink-300"
            >
              <span>Browse All Period Care Products</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-blossom-card rounded-2xl p-4 border border-rose-500/20 flex flex-col justify-between shadow-md hover:-translate-y-1 transition-all">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=350&h=220&fit=crop"
                  alt="Bio-Organic Pads"
                  className="w-full h-40 rounded-xl object-cover mb-3 border border-rose-500/20"
                />
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold px-2.5 py-0.5 rounded-full mb-1 inline-block">
                  Subsidized Rural Price
                </span>
                <h3 className="text-sm font-bold text-slate-100 mb-1">
                  Anandi Bio-Organic Sanitary Pads (Pack of 10)
                </h3>
                <p className="text-xs text-rose-200/70 mb-3">
                  100% plant-fibre core, rash-free, biodegradable.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-rose-500/20">
                <span className="text-base font-bold text-white">₹49</span>
                <button
                  type="button"
                  onClick={onOpenStore}
                  className="px-3.5 py-1.5 rounded-full bg-[#1b1028] text-rose-200 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/20 transition"
                >
                  View Details
                </button>
              </div>
            </div>

            <div className="glass-blossom-card rounded-2xl p-4 border border-rose-500/20 flex flex-col justify-between shadow-md hover:-translate-y-1 transition-all">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=350&h=220&fit=crop"
                  alt="Cloth Pad Kit"
                  className="w-full h-40 rounded-xl object-cover mb-3 border border-rose-500/20"
                />
                <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 font-semibold px-2.5 py-0.5 rounded-full mb-1 inline-block">
                  Lasts 3+ Years
                </span>
                <h3 className="text-sm font-bold text-slate-100 mb-1">
                  Reusable Cotton Cloth Pad Kit (Set of 4)
                </h3>
                <p className="text-xs text-rose-200/70 mb-3">
                  Washable, leak-proof organic cotton with snug snap buttons.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-rose-500/20">
                <span className="text-base font-bold text-white">₹189</span>
                <button
                  type="button"
                  onClick={onOpenStore}
                  className="px-3.5 py-1.5 rounded-full bg-[#1b1028] text-rose-200 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/20 transition"
                >
                  View Details
                </button>
              </div>
            </div>

            <div className="glass-blossom-card rounded-2xl p-4 border border-rose-500/20 flex flex-col justify-between shadow-md hover:-translate-y-1 transition-all">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=350&h=220&fit=crop"
                  alt="Menstrual Cup"
                  className="w-full h-40 rounded-xl object-cover mb-3 border border-rose-500/20"
                />
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold px-2.5 py-0.5 rounded-full mb-1 inline-block">
                  12-Hour Protection
                </span>
                <h3 className="text-sm font-bold text-slate-100 mb-1">
                  Medical Grade Silicone Menstrual Cup
                </h3>
                <p className="text-xs text-rose-200/70 mb-3">
                  FDA-approved ultra-soft silicone with sterilizer container.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-rose-500/20">
                <span className="text-base font-bold text-white">₹199</span>
                <button
                  type="button"
                  onClick={onOpenStore}
                  className="px-3.5 py-1.5 rounded-full bg-[#1b1028] text-rose-200 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/20 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. KNOWLEDGE HUB PREVIEW */}
      <section className="py-16 bg-[#130a1e]/60 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
              Busting Myths & Clinical Facts
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              StreeSure Knowledge Hub with Audio Support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-blossom-card p-6 rounded-2xl border border-rose-500/20 shadow-md">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-2">
                Common Stigma
              </span>
              <h3 className="text-base font-bold text-slate-100 mb-2">
                "Does PCOS mean I will never be able to have children?"
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed mb-4">
                <strong>Fact:</strong> No! While irregular ovulation may delay conception, most women with PCOS have healthy pregnancies through simple lifestyle guidance, cycle tracking, or mild medical ovulation support.
              </p>
              <button
                type="button"
                onClick={onExploreKnowledge}
                className="text-xs font-bold text-pink-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Read Full Evidence-Based Guide</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="glass-blossom-card p-6 rounded-2xl border border-rose-500/20 shadow-md">
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block mb-2">
                Metabolic Clarification
              </span>
              <h3 className="text-base font-bold text-slate-100 mb-2">
                "Are cysts in PCOS dangerous tumors that need surgery?"
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed mb-4">
                <strong>Fact:</strong> Absolutely not. They are simply small, benign, harmless fluid-filled egg follicles that paused development. They are not tumors and almost never require surgery.
              </p>
              <button
                type="button"
                onClick={onExploreKnowledge}
                className="text-xs font-bold text-pink-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Explore 3D Follicle Visualizer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SAFETY, PRIVACY & MEDICAL DISCLAIMER */}
      <section className="py-16 border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-blossom-glow text-white rounded-3xl p-8 lg:p-12 border border-rose-500/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 px-3.5 py-1 rounded-full text-xs font-semibold border border-rose-500/30">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Clinical Responsibility & Privacy Safeguards</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Medical Integrity & User Privacy at StreeSure
                </h2>

                <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
                  StreeSure strictly follows ethical healthcare AI principles. We perform preliminary non-diagnostic screening to identify patterns and facilitate timely access to doctors.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-rose-100/90 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No unverified medical diagnoses or auto-prescriptions.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Explicit user consent before sharing health summaries.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Separation of shopping store from clinical advice.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Compliant with Indian Digital Personal Data Protection.</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#140b1e]/90 border border-rose-500/30 rounded-2xl p-6 text-center shadow-lg">
                <Lock className="w-8 h-8 text-rose-300 mx-auto mb-2" />
                <span className="text-xs font-bold text-white block mb-1 font-sans">
                  Consent-First Architecture
                </span>
                <p className="text-[11px] text-rose-200/70 leading-relaxed">
                  Your menstrual and medical records remain private and encrypted. Only you and authorized doctors/ASHA workers you select can access your summary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="py-16 bg-[#130a1e]/60 border-b border-rose-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
              Got Questions?
            </h2>
            <p className="text-2xl font-extrabold text-white">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            <div className="glass-blossom-card p-5 rounded-2xl border border-rose-500/20">
              <h3 className="text-sm font-bold text-slate-100 mb-2">
                Does StreeSure diagnose me with PCOS?
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed">
                No. StreeSure provides a preliminary risk assessment level (Green, Orange, or Red) to identify whether your cycle and symptom patterns warrant a doctor consultation. Only a qualified doctor can perform physical exams, sonography, and blood tests to diagnose PCOS.
              </p>
            </div>

            <div className="glass-blossom-card p-5 rounded-2xl border border-rose-500/20">
              <h3 className="text-sm font-bold text-slate-100 mb-2">
                Can I use StreeSure if I cannot read or write easily?
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed">
                Yes! Voice Saathi allows you to complete the screening simply by speaking in your mother tongue (Hindi, Marathi, Bengali, Tamil, Telugu, English). A local ASHA worker can also guide you.
              </p>
            </div>

            <div className="glass-blossom-card p-5 rounded-2xl border border-rose-500/20">
              <h3 className="text-sm font-bold text-slate-100 mb-2">
                How much does a doctor teleconsultation cost?
              </h3>
              <p className="text-xs text-rose-100/80 leading-relaxed">
                Consultations are subsidized and accessible, starting at just ₹149–₹199 with senior registered gynecologists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. BOTTOM CTA BANNER */}
      <section className="py-14 bg-gradient-to-r from-rose-950/90 via-[#260f2c]/90 to-fuchsia-950/90 border-t border-rose-500/30 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Start Your Health Awareness Journey Today
          </h2>
          <p className="text-rose-200 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Free preliminary screening, voice navigation, period tracking, and caring community support.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              id="bottom-btn-screening"
              onClick={onStartScreening}
              className="px-7 py-3 rounded-full btn-rose-primary text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition hover:scale-102"
            >
              Start Free Screening
            </button>
            <button
              type="button"
              id="bottom-btn-voice"
              onClick={onOpenVoiceSaathi}
              className="px-5 py-3 rounded-full bg-[#1e1329] hover:bg-[#2a1a3a] text-rose-100 text-xs font-bold border border-rose-500/30 transition"
            >
              Talk to Voice Saathi
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
