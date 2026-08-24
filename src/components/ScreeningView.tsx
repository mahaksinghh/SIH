import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  Volume2,
  HelpCircle,
  Shield,
  Sparkles,
  Info,
} from 'lucide-react';
import { LanguageCode, ScreeningAnswers, ScreeningResult, User } from '../types';
import { calculateScreeningResult, defaultMockScreeningAnswers } from '../services/screeningEngine';
import { getTranslation } from '../services/translations';
import { parseVoiceScreeningAnswer, speakText, stopSpeaking } from '../services/voiceService';

interface ScreeningViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onScreeningComplete: (result: ScreeningResult) => void;
  onOpenVoiceSaathi: () => void;
}

export const ScreeningView: React.FC<ScreeningViewProps> = ({
  currentUser,
  currentLanguage,
  onScreeningComplete,
  onOpenVoiceSaathi,
}) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState<ScreeningAnswers>(defaultMockScreeningAnswers);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceRecognizedText, setVoiceRecognizedText] = useState('');

  const t = (key: string) => getTranslation(currentLanguage, key);

  const categories = [
    {
      id: 'menstrual',
      title: 'Category A: Menstrual Patterns',
      subtitle: 'Understanding timing, cycle regularity, and flow characteristics',
      explanation: 'Menstrual cycle regularity is a key primary indicator of healthy, predictable ovulation.',
    },
    {
      id: 'hyperandrogen',
      title: 'Category B: Hyperandrogen-Related Features',
      subtitle: 'Exploring skin, facial hair, and scalp hair patterns',
      explanation: 'Slightly elevated androgens (male-type hormones present in all women) can influence hair distribution and sebaceous activity.',
    },
    {
      id: 'metabolic',
      title: 'Category C: Metabolic & General Health',
      subtitle: 'Weight changes, energy, sleep, and physical activity',
      explanation: 'Insulin dynamics and metabolic factors frequently interact with ovarian hormone receptors.',
    },
    {
      id: 'reproductive',
      title: 'Category D: Reproductive & Gynecological History',
      subtitle: 'Previous ultrasounds, lab investigations, or subfertility factors',
      explanation: 'Previous clinician tests (such as pelvic sonography) provide helpful non-diagnostic context.',
    },
    {
      id: 'differential',
      title: 'Category E: Differential Context & Other Factors',
      subtitle: 'Thyroid, major acute stress, or medication influences',
      explanation: 'Thyroid shifts or acute stress can temporarily cause menstrual delays independent of PCOS.',
    },
    {
      id: 'family',
      title: 'Category F: Family History',
      subtitle: 'First-degree relatives with PCOS, diabetes, or metabolic conditions',
      explanation: 'Genetic factors can play a supportive role in understanding hormonal predispositions.',
    },
  ];

  const currentCategory = categories[currentCategoryIndex];

  // Voice-first question answering simulation / Speech recognition
  const handleVoiceListenForCurrent = () => {
    setIsVoiceActive(true);
    setVoiceRecognizedText('Listening to your spoken response in your language...');

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceRecognizedText(`Recognized: "${transcript}"`);
        
        // Match current active question
        let targetField = 'cycleRegularity';
        if (currentCategoryIndex === 1) targetField = 'increasedFacialHair';
        if (currentCategoryIndex === 2) targetField = 'unexplainedWeightGain';
        if (currentCategoryIndex === 5) targetField = 'familyDiabetesHistory';

        const { updatedAnswers } = parseVoiceScreeningAnswer(transcript, targetField, answers);
        setAnswers((prev) => ({ ...prev, ...updatedAnswers }));
        setIsVoiceActive(false);
      };

      recognition.onerror = () => {
        setIsVoiceActive(false);
        setVoiceRecognizedText('Voice recognition paused. You can click the options directly.');
      };

      recognition.start();
    } else {
      // Fallback simulation for browsers without Web Speech API
      setTimeout(() => {
        const simulatedText = currentLanguage === 'hi' ? 'मेरी माहवारी 40 दिन के अंतराल पर आती है।' : 'My cycles are delayed by 40 days.';
        setVoiceRecognizedText(`Simulated recognized voice: "${simulatedText}"`);
        setAnswers((prev) => ({ ...prev, cycleRegularity: 'infrequent_over_35', daysBetweenPeriods: 40 }));
        setIsVoiceActive(false);
      }, 1500);
    }
  };

  const handleNext = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      // Complete screening
      const result = calculateScreeningResult(currentUser?.id || 'usr_guest', answers);
      onScreeningComplete(result);
    }
  };

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header & Disclaimer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/60 mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>StreeSure Comprehensive Screening Assessment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Women's Health & PCOS Risk Screening
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Step {currentCategoryIndex + 1} of {categories.length}: {currentCategory.title}
            </p>
          </div>

          <button
            type="button"
            id="btn-screening-voice-saathi-modal"
            onClick={onOpenVoiceSaathi}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-xs font-bold shadow-md shadow-rose-200 hover:scale-105 transition self-start"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span>Voice Screening Mode</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-rose-500 via-rose-600 to-teal-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentCategoryIndex + 1) / categories.length) * 100}%` }}
          />
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            <strong>Medical Notice:</strong> This questionnaire identifies clinical pattern correlations. It does not constitute a medical diagnosis.
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-6">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            {currentCategory.title}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {currentCategory.subtitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentCategory.explanation}
          </p>
        </div>

        {/* Voice Assistant Shortcut for this Category */}
        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-600 text-white shadow-xs">
              <Mic className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Answer this step using voice in your language
              </span>
              <span className="text-[11px] text-slate-500">
                {voiceRecognizedText || 'Tap the microphone to speak your answer.'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleVoiceListenForCurrent}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              isVoiceActive
                ? 'bg-rose-700 text-white animate-pulse'
                : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-rose-600" />
            <span>{isVoiceActive ? 'Listening...' : 'Speak Answer'}</span>
          </button>
        </div>

        {/* CATEGORY A: MENSTRUAL PATTERNS */}
        {currentCategoryIndex === 0 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. How would you describe your typical menstrual cycle frequency?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'regular_21_35', label: 'Regular (Every 21 to 35 days)' },
                  { key: 'infrequent_over_35', label: 'Infrequent (Cycles take >35 to 60+ days)' },
                  { key: 'frequent_under_21', label: 'Frequent (Periods return in under 21 days)' },
                  { key: 'absent_3_months_plus', label: 'Absent for months (No period for >3 months)' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setAnswers({ ...answers, cycleRegularity: opt.key as any })}
                    className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition ${
                      answers.cycleRegularity === opt.key
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  2. Average days between your periods?
                </label>
                <input
                  type="number"
                  min={15}
                  max={120}
                  value={answers.daysBetweenPeriods}
                  onChange={(e) =>
                    setAnswers({ ...answers, daysBetweenPeriods: parseInt(e.target.value, 10) || 28 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  3. Approximate date of last period?
                </label>
                <input
                  type="date"
                  value={answers.lastPeriodDate}
                  onChange={(e) => setAnswers({ ...answers, lastPeriodDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                4. Cycle skipping and recent pattern shifts:
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={answers.heavyProlongedBleeding}
                    onChange={(e) => setAnswers({ ...answers, heavyProlongedBleeding: e.target.checked })}
                    className="rounded-sm text-rose-600 focus:ring-rose-500"
                  />
                  <span>I experience unusually heavy or prolonged bleeding (&gt;7 days)</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={answers.recentPatternChange}
                    onChange={(e) => setAnswers({ ...answers, recentPatternChange: e.target.checked })}
                    className="rounded-sm text-rose-600 focus:ring-rose-500"
                  />
                  <span>My menstrual cycle regularity has noticeably worsened in the past 6–12 months</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY B: HYPERANDROGEN-RELATED FEATURES */}
        {currentCategoryIndex === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. Excess coarse facial hair growth (Chin, upper lip, jawline)?
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { key: 'none', label: 'None / Fine peach fuzz' },
                  { key: 'mild', label: 'Mild (A few coarse hairs)' },
                  { key: 'moderate_to_severe', label: 'Moderate to noticeable coarse growth' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setAnswers({ ...answers, increasedFacialHair: opt.key as any })}
                    className={`p-3 rounded-xl border text-center text-xs font-semibold transition ${
                      answers.increasedFacialHair === opt.key
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                2. Adult acne or persistent facial/body breakouts?
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { key: 'none', label: 'None / Clear skin' },
                  { key: 'mild_occasional', label: 'Mild occasional premenstrual pimples' },
                  { key: 'persistent_adult_cystic', label: 'Persistent adult / cystic breakouts on jawline' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setAnswers({ ...answers, persistentAcne: opt.key as any })}
                    className={`p-3 rounded-xl border text-center text-xs font-semibold transition ${
                      answers.persistentAcne === opt.key
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                3. Scalp hair thinning or excessive shedding?
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { key: 'none', label: 'Normal hair density' },
                  { key: 'mild_shedding', label: 'Mild seasonal shedding' },
                  { key: 'noticeable_crown_thinning', label: 'Noticeable crown thinning / widening part' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setAnswers({ ...answers, scalpHairThinning: opt.key as any })}
                    className={`p-3 rounded-xl border text-center text-xs font-semibold transition ${
                      answers.scalpHairThinning === opt.key
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY C: METABOLIC / GENERAL HEALTH */}
        {currentCategoryIndex === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. Unexplained weight gain or difficulty managing weight?
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { key: 'none', label: 'Stable weight' },
                  { key: 'moderate', label: 'Moderate fluctuations' },
                  { key: 'significant_difficulty_losing', label: 'Significant gain / hard to lose weight' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setAnswers({ ...answers, unexplainedWeightGain: opt.key as any })}
                    className={`p-3 rounded-xl border text-center text-xs font-semibold transition ${
                      answers.unexplainedWeightGain === opt.key
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={answers.familyDiabetesHistory}
                  onChange={(e) => setAnswers({ ...answers, familyDiabetesHistory: e.target.checked })}
                  className="rounded-sm text-rose-600 focus:ring-rose-500"
                />
                <span>Family history of Type 2 Diabetes or insulin resistance</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={answers.elevatedBloodSugarHistory}
                  onChange={(e) => setAnswers({ ...answers, elevatedBloodSugarHistory: e.target.checked })}
                  className="rounded-sm text-rose-600 focus:ring-rose-500"
                />
                <span>Personal history of borderline high fasting blood glucose</span>
              </label>
            </div>
          </div>
        )}

        {/* CATEGORY D: REPRODUCTIVE & CLINICAL HISTORY */}
        {currentCategoryIndex === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. Prior Pelvic / Ovarian Ultrasound Findings (if ever done):
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { key: 'never', label: 'Never had an ultrasound' },
                  { key: 'normal', label: 'Ultrasound was reported normal' },
                  { key: 'polyfollicular_cysts_seen', label: 'Report noted multicystic / polyfollicular ovaries' },
                  { key: 'unsure', label: 'Unsure / Prefer not to say' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setAnswers({ ...answers, previousPelvicUltrasound: opt.key as any })}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                      answers.previousPelvicUltrasound === opt.key
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                2. Difficulty conceiving / subfertility (if actively trying):
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { key: 'not_applicable', label: 'Not applicable / Not trying' },
                  { key: 'no', label: 'No difficulty' },
                  { key: 'trying_over_6_months', label: 'Trying for 6–12 months' },
                  { key: 'trying_over_12_months', label: 'Trying for over 12 months' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setAnswers({ ...answers, difficultyConceiving: opt.key as any })}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                      answers.difficultyConceiving === opt.key
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY E: DIFFERENTIAL CONTEXT */}
        {currentCategoryIndex === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs text-slate-600">
              Certain non-PCOS conditions can also cause cycle delays or fatigue. Please select if applicable:
            </p>
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={answers.knownThyroidDisorder}
                  onChange={(e) => setAnswers({ ...answers, knownThyroidDisorder: e.target.checked })}
                  className="rounded-sm text-rose-600 focus:ring-rose-500"
                />
                <span>Known thyroid disorder (Hypothyroidism / Hyperthyroidism)</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={answers.highStressRecentEvents}
                  onChange={(e) => setAnswers({ ...answers, highStressRecentEvents: e.target.checked })}
                  className="rounded-sm text-rose-600 focus:ring-rose-500"
                />
                <span>Recent high physical/emotional stress or severe sleep disruptions</span>
              </label>
            </div>
          </div>
        )}

        {/* CATEGORY F: FAMILY HISTORY */}
        {currentCategoryIndex === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs text-slate-600">
              Family history helps evaluate inherited metabolic or hormonal patterns:
            </p>
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={answers.familyPcosHistory}
                  onChange={(e) => setAnswers({ ...answers, familyPcosHistory: e.target.checked })}
                  className="rounded-sm text-rose-600 focus:ring-rose-500"
                />
                <span>Mother or sister with documented PCOS or irregular cycles</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={answers.familyCardiovascularMetabolic}
                  onChange={(e) => setAnswers({ ...answers, familyCardiovascularMetabolic: e.target.checked })}
                  className="rounded-sm text-rose-600 focus:ring-rose-500"
                />
                <span>Family history of cardiovascular / metabolic concerns</span>
              </label>
            </div>
          </div>
        )}

        {/* Footer Navigation Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            id="btn-screening-back"
            onClick={handleBack}
            disabled={currentCategoryIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold transition ${
              currentCategoryIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            type="button"
            id="btn-screening-next"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-200 transition hover:scale-105"
          >
            <span>{currentCategoryIndex === categories.length - 1 ? 'Generate StreeSure Assessment' : 'Next Category'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
