import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  Info,
  Layers,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  Volume2,
  Zap,
  Check,
} from 'lucide-react';
import {
  CyclePhase,
  ExerciseCategory,
  ExerciseRoutine,
  LanguageCode,
  User,
} from '../types';
import { SEED_EXERCISE_ROUTINES } from '../data/wellnessData';

interface ExercisePortalViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onOpenProgressTracker: () => void;
  onOpenHomeRemedies: () => void;
}

export const ExercisePortalView: React.FC<ExercisePortalViewProps> = ({
  currentUser,
  currentLanguage,
  onOpenProgressTracker,
  onOpenHomeRemedies,
}) => {
  const [routines, setRoutines] = useState<ExerciseRoutine[]>(SEED_EXERCISE_ROUTINES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Guided Player State
  const [activeRoutine, setActiveRoutine] = useState<ExerciseRoutine | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedRoutineToast, setCompletedRoutineToast] = useState(false);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Auto advance to next step if available
      if (activeRoutine && currentStepIndex < activeRoutine.steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        setTimerSecondsLeft(activeRoutine.steps[currentStepIndex + 1].durationSeconds);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft, activeRoutine, currentStepIndex]);

  const handleStartWorkout = (routine: ExerciseRoutine) => {
    setActiveRoutine(routine);
    setCurrentStepIndex(0);
    setTimerSecondsLeft(routine.steps[0]?.durationSeconds || 180);
    setIsTimerRunning(true);
  };

  const handleFinishWorkout = () => {
    setIsTimerRunning(false);
    setActiveRoutine(null);
    setCompletedRoutineToast(true);
    setTimeout(() => setCompletedRoutineToast(false), 4000);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Filter routines
  const filteredRoutines = routines.filter((r) => {
    const matchesCategory =
      selectedCategory === 'all' || r.category === selectedCategory;
    const matchesPhase =
      selectedPhase === 'all' || r.cyclePhase === selectedPhase || r.cyclePhase === 'all';
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.pcosBenefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesPhase && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Toast notification */}
      {completedRoutineToast && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 animate-in slide-in-from-top-4">
          <Trophy className="w-6 h-6 text-amber-300 shrink-0" />
          <div>
            <p className="font-black text-sm">Workout Completed! +25 Mins Logged</p>
            <p className="text-xs text-emerald-100">
              GLUT4 metabolic activation logged in your Daily Progress Tracker.
            </p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-950 via-[#240c2e] to-rose-950 border border-pink-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>
                {currentLanguage === 'hi'
                  ? 'हार्मोनल व इंसुलिन-फ्रेंडली व्यायाम'
                  : 'Cortisol-Safe & GLUT4 Movement'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {currentLanguage === 'hi'
                ? 'पीसीओएस एक्सरसाइज व योग पोर्टल'
                : 'PCOS Exercise & Yoga Portal'}
            </h1>
            <p className="text-sm text-pink-200/80 leading-relaxed">
              {currentLanguage === 'hi'
                ? 'अंडाशय में रक्त संचार बढ़ाने वाले योगासन, इंसुलिन संवेदनशीलता बढ़ाने वाले लो-इम्पैक्ट स्ट्रेंथ वर्कआउट और चक्र-संरेखित रूटीन।'
                : 'Evidence-based movement engineered for PCOS: pelvic circulation yoga, skeletal muscle GLUT4 glucose uptake, and cycle-synced restorative flows.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenProgressTracker}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-sm font-bold shadow-lg shadow-rose-900/40 transition transform active:scale-95"
            >
              <Activity className="w-4 h-4" />
              <span>{currentLanguage === 'hi' ? 'प्रोग्रेस ट्रैकर में जाएं' : 'View Progress Tracker'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenHomeRemedies}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-pink-200 text-sm font-semibold border border-pink-500/30 transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{currentLanguage === 'hi' ? 'घरेलू उपचार' : 'Herbal Remedies'}</span>
            </button>
          </div>
        </div>

        {/* Informational Guidelines Badges */}
        <div className="mt-8 pt-6 border-t border-pink-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-pink-500/15 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">GLUT4 Insulin Sensitization</p>
              <p className="text-[11px] text-pink-200/70">Resistance movements clear glucose directly into muscles without spike.</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-pink-500/15 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Cortisol-Safe Zone</p>
              <p className="text-[11px] text-purple-200/70">No inflammatory burnout: workouts designed below anaerobic stress threshold.</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-pink-500/15 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Cycle-Synced Rhythm</p>
              <p className="text-[11px] text-emerald-200/70">Match exercise intensity to your follicular, ovulatory, and luteal phases.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-[#140c1e] rounded-3xl p-6 border border-rose-500/20 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-rose-300/60 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLanguage === 'hi'
                  ? 'व्यायाम, योग या लाभ खोजें (जैसे तितली आसन, स्ट्रेंथ, पेल्विक)...'
                  : 'Search workouts, asanas, or benefits (e.g. Pelvic Flow, GLUT4, Squats)...'
              }
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-rose-500/20 text-white placeholder-rose-200/40 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Cycle Phase Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-rose-200/70 whitespace-nowrap font-medium">Cycle Phase:</span>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#1d122b] border border-rose-500/20 text-white text-xs font-semibold focus:outline-hidden"
            >
              <option value="all">All Cycle Phases</option>
              <option value="follicular">Follicular Phase (Days 6–13)</option>
              <option value="ovulatory">Ovulatory Phase (Days 14–17)</option>
              <option value="luteal">Luteal Phase (Days 18–28)</option>
              <option value="menstrual">Menstrual Phase (Days 1–5)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Routines' },
            { id: 'yoga', label: 'PCOS Yoga & Asanas' },
            { id: 'strength', label: 'Low-Impact Strength & GLUT4' },
            { id: 'liss_cardio', label: 'Zone-2 Steady Cardio' },
            { id: 'pelvic_core', label: 'Pelvic Floor & Core' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                  : 'bg-white/5 text-rose-200/70 hover:bg-white/10 hover:text-white border border-rose-500/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoutines.map((routine) => (
          <div
            key={routine.id}
            className="group bg-[#140c1e] rounded-3xl overflow-hidden border border-rose-500/20 hover:border-pink-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Card Image Banner */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={routine.thumbnailUrl}
                  alt={routine.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140c1e] via-[#140c1e]/40 to-transparent" />

                {/* Floating Tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-pink-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md uppercase">
                    {routine.category.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-pink-300 text-[11px] font-semibold border border-pink-500/30">
                    Phase: {routine.cyclePhase}
                  </span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-amber-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{routine.durationMinutes} Mins</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-black text-white leading-snug drop-shadow-md">
                    {currentLanguage === 'hi' ? routine.titleHi : routine.title}
                  </h3>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-6 space-y-4">
                {/* Hormonal impact badge */}
                <div className="p-3 rounded-2xl bg-pink-950/40 border border-pink-500/20 text-xs text-pink-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                  <span className="font-semibold">
                    {currentLanguage === 'hi' ? routine.hormonalImpactHi : routine.hormonalImpact}
                  </span>
                </div>

                {/* Benefits list */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  <p className="font-bold text-rose-300 uppercase text-[11px] tracking-wider">
                    PCOS Clinical Benefits:
                  </p>
                  <ul className="space-y-1">
                    {(currentLanguage === 'hi' ? routine.pcosBenefitsHi : routine.pcosBenefits).map(
                      (benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-rose-100/90">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Equipment & Instructor */}
                <div className="pt-3 border-t border-rose-500/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <span>Instructor: <strong className="text-slate-200">{routine.instructorName}</strong></span>
                  <span>Calories: <strong className="text-amber-300">~{routine.caloriesBurnEstimate} kcal</strong></span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-6 pt-0">
              <button
                type="button"
                onClick={() => handleStartWorkout(routine)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-pink-950/50 transition transform active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Interactive Guided Routine ({routine.steps.length} Steps)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: INTERACTIVE GUIDED WORKOUT PLAYER */}
      {activeRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg overflow-y-auto">
          <div className="bg-[#180e26] rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-pink-500/30 shadow-2xl space-y-6 my-auto text-slate-100 max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-pink-500/20">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveRoutine(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-rose-300 transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {currentLanguage === 'hi' ? activeRoutine.titleHi : activeRoutine.title}
                  </h3>
                  <p className="text-xs text-pink-200/70">
                    Step {currentStepIndex + 1} of {activeRoutine.steps.length} · {activeRoutine.difficulty}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveRoutine(null)}
                className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            {/* Active Step Details */}
            {activeRoutine.steps[currentStepIndex] && (
              <div className="space-y-6">
                {/* Step Name & Timer Card */}
                <div className="bg-gradient-to-br from-[#241038] to-[#150a22] rounded-3xl p-6 sm:p-8 border border-pink-500/30 text-center space-y-4 shadow-xl">
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
                    Current Asana / Movement
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {currentLanguage === 'hi'
                      ? activeRoutine.steps[currentStepIndex].nameHi
                      : activeRoutine.steps[currentStepIndex].name}
                  </h2>

                  {/* Big Timer Display */}
                  <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-black/40 border border-pink-500/20 shadow-inner">
                    <span className="text-5xl sm:text-6xl font-mono font-black text-pink-400 tracking-tight">
                      {formatSeconds(timerSecondsLeft)}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 uppercase font-semibold">Remaining Timer</span>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-sm font-bold shadow-lg shadow-pink-900/40 transition"
                    >
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      <span>{isTimerRunning ? 'Pause Timer' : 'Resume Timer'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerSecondsLeft(activeRoutine.steps[currentStepIndex].durationSeconds);
                      }}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                      title="Reset Step Timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Instructions & Form Cue */}
                <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-pink-500/15">
                  <div>
                    <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider mb-1">
                      Execution & Breathing Instructions:
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {currentLanguage === 'hi'
                        ? activeRoutine.steps[currentStepIndex].instructionsHi
                        : activeRoutine.steps[currentStepIndex].instructions}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-pink-950/40 border border-pink-500/30 text-xs text-pink-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-pink-300">Biomechanical Focus Cue: </strong>
                      <span>{activeRoutine.steps[currentStepIndex].focusCue}</span>
                    </div>
                  </div>
                </div>

                {/* Step Navigator Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-pink-500/20">
                  <button
                    type="button"
                    disabled={currentStepIndex === 0}
                    onClick={() => {
                      const prevIdx = currentStepIndex - 1;
                      setCurrentStepIndex(prevIdx);
                      setTimerSecondsLeft(activeRoutine.steps[prevIdx].durationSeconds);
                      setIsTimerRunning(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition"
                  >
                    Previous Step
                  </button>

                  {currentStepIndex < activeRoutine.steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = currentStepIndex + 1;
                        setCurrentStepIndex(nextIdx);
                        setTimerSecondsLeft(activeRoutine.steps[nextIdx].durationSeconds);
                        setIsTimerRunning(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                    >
                      <span>Next Movement</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinishWorkout}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finish & Log Routine</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
