import React from 'react';
import {
  Activity,
  Calendar,
  Stethoscope,
  BookOpen,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { LanguageCode, User } from '../types';

interface HealthJourneyViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onStartScreening: () => void;
  onBookDoctor: () => void;
  onOpenTracker: () => void;
  onOpen3DModal: () => void;
}

export const HealthJourneyView: React.FC<HealthJourneyViewProps> = ({
  currentUser,
  currentLanguage,
  onStartScreening,
  onBookDoctor,
  onOpenTracker,
  onOpen3DModal,
}) => {
  const steps = [
    {
      id: 'step_1',
      title: '1. Preliminary StreeSure Screening',
      date: 'Aug 23, 2026',
      status: 'completed',
      summary: 'Completed Rotterdam-aligned assessment. Categorized as Level 2 Orange (Evaluation Recommended).',
      actionLabel: 'View Screening Summary',
      action: onStartScreening,
    },
    {
      id: 'step_2',
      title: '2. Gynecologist Teleconsultation',
      date: 'Aug 25, 2026',
      status: 'in_progress',
      summary: 'Teleconsultation scheduled with Dr. Ananya Sen (MS OB/GYN) to review cycle delays and metabolic health.',
      actionLabel: 'Check Appointment Details',
      action: onBookDoctor,
    },
    {
      id: 'step_3',
      title: '3. Menstrual Cycle & Symptom Diary',
      date: 'Ongoing',
      status: 'in_progress',
      summary: '3 cycle intervals logged. Monitoring ovulation symptoms and flow intensity over the next 90 days.',
      actionLabel: 'Log Current Symptoms',
      action: onOpenTracker,
    },
    {
      id: 'step_4',
      title: '4. Lifestyle & Nutrition Plan',
      date: 'Upcoming',
      status: 'pending',
      summary: 'Low-glycemic meal guidelines and inositol supplementation under physician supervision.',
      actionLabel: '3D Ovarian Model',
      action: onOpen3DModal,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-bold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Lifelong Health Journey</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Care Pathway & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
            A continuous record of your health screenings, doctor consultations, cycle logs, and wellness goals.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen3DModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-rose-700 text-xs font-bold shadow-md hover:bg-rose-50 transition shrink-0"
        >
          <Layers className="w-4 h-4" />
          <span>3D Cycle Tracker</span>
        </button>
      </div>

      {/* Pathway Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Your Personalized Health Timeline</h2>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 sm:before:left-6 before:w-0.5 before:bg-slate-200">
          {(steps || []).map((step) => (
            <div key={step.id} className="relative flex items-start gap-4 sm:gap-6">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-xs ${
                  step.status === 'completed'
                    ? 'bg-emerald-600 text-white'
                    : step.status === 'in_progress'
                    ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : step.status === 'in_progress' ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-bold">4</span>
                )}
              </div>

              <div className="flex-1 bg-slate-50/70 hover:bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 transition space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{step.title}</h3>
                  <span className="text-xs font-semibold text-slate-400">{step.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{step.summary}</p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={step.action}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
