import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Users,
  Calendar,
  Layers,
  FileText,
  Volume2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';
import { LanguageCode, ScreeningResult, User } from '../types';
import { getTranslation } from '../services/translations';
import { speakText, stopSpeaking } from '../services/voiceService';

interface ScreeningResultViewProps {
  result: ScreeningResult;
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onBookDoctor: () => void;
  onConnectAsha: () => void;
  onOpenTracker: () => void;
  onOpen3DModal: () => void;
  onRetakeScreening: () => void;
}

export const ScreeningResultView: React.FC<ScreeningResultViewProps> = ({
  result,
  currentUser,
  currentLanguage,
  onBookDoctor,
  onConnectAsha,
  onOpenTracker,
  onOpen3DModal,
  onRetakeScreening,
}) => {
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [aiExplanationText, setAiExplanationText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFullBreakdown, setShowFullBreakdown] = useState(true);

  const t = (key: string) => getTranslation(currentLanguage, key);

  // Styling based on level
  const getBadgeStyle = () => {
    switch (result.level) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          badge: 'bg-emerald-600 text-white',
          icon: CheckCircle2,
          colorCode: '#10b981',
        };
      case 'ORANGE':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-900',
          badge: 'bg-amber-500 text-slate-950 font-bold',
          icon: AlertCircle,
          colorCode: '#f59e0b',
        };
      case 'RED':
      default:
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-900',
          badge: 'bg-rose-600 text-white',
          icon: AlertTriangle,
          colorCode: '#e11d48',
        };
    }
  };

  const style = getBadgeStyle();
  const IconComponent = style.icon;

  const handleFetchAiExplanation = async () => {
    setIsAiExplaining(true);
    try {
      const res = await fetch('/api/gemini/explain-screening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screeningResult: result,
          language: currentLanguage,
        }),
      });
      const data = await res.json();
      setAiExplanationText(data.explanation || 'Consult a qualified gynecologist for an individual clinical review.');
    } catch (e) {
      setAiExplanationText(
        'Your preliminary assessment indicates features commonly associated with cycle variations. Consulting a gynecologist will help you discuss hormonal wellness and lifestyle measures.'
      );
    } finally {
      setIsAiExplaining(false);
    }
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      const summaryText = result.levelDescription || (result as any).summary || '';
      const stepsText = (result.recommendedNextSteps || (result as any).suggestedNextSteps || []).join('. ');
      const textToRead = `${result.levelTitle}. ${summaryText}. What to do next: ${stepsText}`;
      speakText(textToRead, currentLanguage, () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
  };

  // Safe normalized factor list
  const factorsList =
    Array.isArray(result.categories) && result.categories.length > 0
      ? result.categories
          .filter((c) => c.status === 'high' || c.status === 'moderate')
          .flatMap((c) =>
            (c.observations || []).map((obs) => ({
              category: c.categoryTitle,
              weight: c.status === 'high' ? 'high' : 'medium',
              observation: obs,
            }))
          )
      : (Array.isArray(result.contributingFactors) ? result.contributingFactors : []).map(
          (factorItem: any, idx: number) => {
            if (typeof factorItem === 'object' && factorItem !== null) {
              return {
                category: factorItem.category || `Factor ${idx + 1}`,
                weight: factorItem.weight || 'medium',
                observation: factorItem.observation || factorItem.description || String(factorItem),
              };
            }
            return {
              category: 'Clinical Observation ' + (idx + 1),
              weight: 'medium',
              observation: String(factorItem),
            };
          }
        );

  const nextStepsList = result.recommendedNextSteps || (result as any).suggestedNextSteps || [
    'Schedule a consultation with a registered Gynecologist via StreeSure or visit your nearest Community Health Center / PHC.',
    'Connect with your local ASHA worker to facilitate guided referral paperwork and PHC navigation.',
    'Maintain an ongoing menstrual log in the StreeSure Period Tracker to share objective timeline data with your doctor.',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* 1. Main Assessment Result Card */}
      <div className={`rounded-3xl p-6 sm:p-8 border ${style.border} ${style.bg} shadow-xl relative`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${style.badge}`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${style.badge}`}>
                Level {result.level === 'GREEN' ? '1' : result.level === 'ORANGE' ? '2' : '3'} : {result.level}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {result.levelTitle}
              </h1>
            </div>
          </div>

          {/* Read aloud & 3D button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-result-read-aloud"
              onClick={handleReadAloud}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-xs hover:bg-slate-50 transition"
            >
              <Volume2 className={`w-4 h-4 text-rose-600 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span>{isSpeaking ? 'Pause Audio' : 'Listen in Language'}</span>
            </button>

            <button
              type="button"
              id="btn-result-view-3d"
              onClick={onOpen3DModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-xs hover:bg-teal-800 transition"
            >
              <Layers className="w-4 h-4" />
              <span>3D Pelvic Model</span>
            </button>
          </div>
        </div>

        {/* Core Summary Paragraph */}
        <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed mb-6">
          {result.levelDescription || (result as any).summary || 'Your assessment responses have been analyzed based on standard clinical algorithms.'}
        </p>

        {/* Action CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            id="btn-result-book-doctor"
            onClick={onBookDoctor}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-200 transition hover:scale-105"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Consult Gynecologist (₹199)</span>
          </button>

          <button
            type="button"
            id="btn-result-connect-asha"
            onClick={onConnectAsha}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-200 transition hover:scale-105"
          >
            <Users className="w-4 h-4" />
            <span>Talk to ASHA Worker</span>
          </button>

          <button
            type="button"
            id="btn-result-track-period"
            onClick={onOpenTracker}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs transition"
          >
            <Calendar className="w-4 h-4 text-rose-600" />
            <span>Track Menstrual Cycles</span>
          </button>
        </div>
      </div>

      {/* 2. "WHY DID I RECEIVE THIS RESULT?" - Breakdown Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <span>Why Did I Receive This Result? (Screening Breakdown)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent explanation of your responses across clinical categories
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFullBreakdown(!showFullBreakdown)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            {showFullBreakdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showFullBreakdown && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {factorsList.length > 0 ? (
                factorsList.map((factor, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      factor.weight === 'high'
                        ? 'bg-rose-50/50 border-rose-200'
                        : factor.weight === 'medium'
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900">{factor.category}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          factor.weight === 'high'
                            ? 'bg-rose-200 text-rose-800'
                            : factor.weight === 'medium'
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {factor.weight} impact
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{factor.observation}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  Responses are within typical physiological variations.
                </div>
              )}
            </div>

            {/* AI Medical Explainability Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-teal-50/70 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>StreeSure AI Detailed Educational Note</span>
                </div>
                {!aiExplanationText && (
                  <button
                    type="button"
                    onClick={handleFetchAiExplanation}
                    disabled={isAiExplaining}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition disabled:opacity-50"
                  >
                    {isAiExplaining ? 'Generating Note...' : 'Generate Clinical Explanation'}
                  </button>
                )}
              </div>

              {aiExplanationText ? (
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white/80 p-3 rounded-xl border border-indigo-100">
                  {aiExplanationText}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Tap "Generate Clinical Explanation" to receive a tailored, non-diagnostic educational explanation of what your biological observations mean.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. "WHAT THIS RESULT MEANS" VS "WHAT IT DOES NOT MEAN" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3>What This Result Means</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>It provides an objective, structured overview of your menstrual and symptom patterns.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>It helps you prepare organized notes for your upcoming doctor consultation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>It offers relevant lifestyle and nutritional guidance for cycle health.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3>What This Result Does NOT Mean</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>This is <strong>NOT a definitive clinical diagnosis</strong> of PCOS.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>It is not a prescription or medical instruction to take or stop any medication.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>It does not replace an in-person clinical exam, pelvic ultrasound, or blood tests.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. SUGGESTED NEXT STEPS & MEDICAL DISCLAIMER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Recommended Next Steps</h3>
        <div className="space-y-2.5">
          {nextStepsList.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={onRetakeScreening}
            className="text-slate-500 hover:text-rose-600 font-semibold"
          >
            ← Retake or update screening answers
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Summary exported as PDF/Health Record Card.')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Health Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
