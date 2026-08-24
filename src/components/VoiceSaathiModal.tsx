import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Layers,
  Calendar,
  Stethoscope,
  Activity,
  Globe,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  BookOpen,
  ShoppingBag,
  Users,
  Eye,
  Trash2,
  Dumbbell,
  Leaf,
  TrendingUp,
} from 'lucide-react';
import { LanguageCode, User } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/translations';
import { speakText, stopSpeaking } from '../services/voiceService';

interface VoiceSaathiModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigateTab: (tab: string) => void;
  onOpen3DModal: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  keyTakeaways?: string[];
  followUpQuestions?: string[];
  actionIntent?: string;
  actionLabel?: string;
  timestamp: string;
}

type TopicCategory = 'symptoms' | 'myths' | 'nutrition' | 'exercise' | 'remedies' | 'tracker' | 'tests' | 'doctor';

export const VoiceSaathiModal: React.FC<VoiceSaathiModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentLanguage,
  onLanguageChange,
  onNavigateTab,
  onOpen3DModal,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'saathi',
      text:
        currentLanguage === 'hi'
          ? 'नमस्ते! मैं स्त्रीश्योर वॉयस साथी हूँ। मैं पीसीओएस, माहवारी स्वास्थ्य, हार्मोनल कारणों, डाइट, 3D मॉडल और डॉक्टर परामर्श पर वैज्ञानिक व सहज जानकारी देती हूँ। आप मुझसे कुछ भी पूछ सकती हैं।'
          : "Hello! I am StreeSure Voice Saathi. I am equipped with comprehensive clinical knowledge on PCOS root causes, symptoms, myths vs facts, inositol nutrition, 3D anatomy, and care navigation. How can I help you today?",
      keyTakeaways: [
        currentLanguage === 'hi'
          ? 'वैज्ञानिक और सुरक्षित: रॉटरडैम गाइडलाइंस और पोषण विज्ञान पर आधारित।'
          : 'Evidence-Based & Safe: Grounded in Rotterdam 2023 guidelines and nutrition science.',
        currentLanguage === 'hi'
          ? 'गोपनीय और संवेदनशील: बिना किसी संकोच के अपनी भाषा में पूछें।'
          : 'Private & Empathetic: Ask any sensitive cycle question in your mother tongue.',
      ],
      followUpQuestions:
        currentLanguage === 'hi'
          ? [
              'माहवारी 2 महीने से लेट क्यों होती है?',
              'पीसीओएस के मुख्य लक्षण और कारण क्या हैं?',
              'क्या दुबली महिलाओं को भी पीसीओएस हो सकता है?',
            ]
          : [
              'Why is my period delayed by 45 days?',
              'What are the 4 main types of PCOS?',
              'Can lean or thin women have PCOS?',
            ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<TopicCategory>('symptoms');
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingAi]);

  if (!isOpen) return null;

  // Curated PCOS topic queries for deep exploration
  const categoryPCOSQuestions: Record<
    TopicCategory,
    { label: string; icon: any; prompts: Record<string, string[]> }
  > = {
    symptoms: {
      label: currentLanguage === 'hi' ? 'लक्षण व मूल कारण' : 'Symptoms & Causes',
      icon: Activity,
      prompts: {
        hi: [
          'माहवारी 35 दिनों से अधिक लेट क्यों होती है?',
          'चेहरे और ठुड्डी पर अनचाहे बाल (हर्सुटिज़्म) क्यों आते हैं?',
          'जबड़े पर जिद्दी हार्मोनल मुंहासे (पिंपल्स) का क्या कारण है?',
          'गर्दन पर काले मखमली निशान (Acanthosis Nigricans) क्यों होते हैं?',
          'क्या सामान्य वजन वाली महिलाओं को भी पीसीओएस (Lean PCOS) हो सकता है?',
        ],
        en: [
          'Why does PCOS cause cycles delayed beyond 35 days?',
          'Why do I get excess facial/chin hair (hirsutism)?',
          'What causes persistent jawline cystic acne in PCOS?',
          'Why are there dark velvety patches on the neck (Acanthosis Nigricans)?',
          'Can normal-weight or thin women have Lean PCOS?',
        ],
      },
    },
    myths: {
      label: currentLanguage === 'hi' ? 'मिथक बनाम सच' : 'Myths vs Facts',
      icon: HelpCircle,
      prompts: {
        hi: [
          'क्या पीसीओएस में कभी गर्भधारण (Pregnancy) नहीं हो सकता?',
          'क्या पीसीओएस सिर्फ मोटे लोगों को ही होता है?',
          'क्या गर्भनिरोधक गोलियां (Birth Control) ही पीसीओएस का एकमात्र इलाज हैं?',
          'क्या अंडाशय में खतरनाक सिस्ट या ट्यूमर होते हैं?',
          'क्या पीसीओएस में रोटी, चावल और दूध पूरी तरह छोड़ना जरूरी है?',
        ],
        en: [
          'Myth vs Fact: Does PCOS cause permanent infertility?',
          'Myth vs Fact: Do only overweight women get PCOS?',
          'Myth vs Fact: Are birth control pills the only cure for PCOS?',
          'Myth vs Fact: Are the cysts on ovaries dangerous tumors?',
          'Myth vs Fact: Do I need to eliminate all carbs, gluten, and dairy?',
        ],
      },
    },
    nutrition: {
      label: currentLanguage === 'hi' ? 'आहार व इनोसिटोल' : 'Diet & Inositol',
      icon: Sparkles,
      prompts: {
        hi: [
          'मायो-इनोसिटोल और डी-काइरो इनोसिटोल (40:1) कैसे काम करता है?',
          'स्पीयरमिंट (पुदीने की चाय) चेहरे के बाल कम करने में कैसे मदद करती है?',
          'पीसीओएस के लिए कम ग्लाइसेमिक इंडेक्स (Low GI) डाइट क्या है?',
          'सीड साइकलिंग (Seed Cycling) क्या है और इसे कैसे करें?',
          'पीसीओएस में कौन सी स्ट्रेंथ और वेट एक्सरसाइज सबसे फायदेमंद है?',
        ],
        en: [
          'How does Myo-Inositol & D-Chiro-Inositol (40:1 ratio) restore periods?',
          'How does Spearmint tea naturally lower free testosterone?',
          'What is a Low Glycemic Index (GI) balanced PCOS meal plan?',
          'What is Seed Cycling and how does it support hormones?',
          'Why is strength & resistance training best for insulin sensitivity?',
        ],
      },
    },
    exercise: {
      label: currentLanguage === 'hi' ? 'व्यायाम व योग' : 'Exercise & Yoga',
      icon: Dumbbell,
      prompts: {
        hi: [
          'पीसीओएस में लो-कोर्टिसोल एक्सरसाइज क्यों जरूरी है?',
          'माहवारी नियमित करने के लिए कौन से योगासन सबसे अच्छे हैं?',
          'स्ट्रेंथ ट्रेनिंग से इंसुलिन संवेदनशीलता कैसे सुधरती है?',
          'क्या पीसीओएस में रोजाना भारी कार्डियो या ज़ुम्बा करना ठीक है?',
          'गाइडेड एक्सरसाइज पोर्टल कैसे शुरू करें?',
        ],
        en: [
          'Why are low-cortisol workouts essential for PCOS hormonal balance?',
          'What are the best pelvic yoga asanas for irregular periods?',
          'How does progressive strength training improve insulin sensitivity?',
          'Should I avoid high-intensity HIIT burnout cardio with PCOS?',
          'How do I explore guided routines in the Exercise Portal?',
        ],
      },
    },
    remedies: {
      label: currentLanguage === 'hi' ? 'घरेलू उपचार' : 'Home Remedies',
      icon: Leaf,
      prompts: {
        hi: [
          'स्पीयरमिंट टी (पुदीना चाय) चेहरे के अनचाहे बाल कैसे कम करती है?',
          'मेथी दाना पानी रातभर भिगोकर पीने के क्या फायदे हैं?',
          'दालचीनी (Cinnamon) चाय ब्लड शुगर और पीरियड्स में कैसे मदद करती है?',
          'क्या अश्वगंधा अधिवृक्क तनाव (Adrenal PCOS) को कम करता है?',
          'घरेलू उपचार पोर्टल में क्या-क्या नुस्खे उपलब्ध हैं?',
        ],
        en: [
          'How does Spearmint tea reduce facial hair and free testosterone?',
          'What are the clinical benefits of overnight soaked fenugreek (methi) water?',
          'How does Ceylon Cinnamon tea improve cellular insulin receptors?',
          'Can Ashwagandha reduce adrenal cortisol in Lean PCOS?',
          'What evidence-based remedies are in the Home Remedies Portal?',
        ],
      },
    },
    tracker: {
      label: currentLanguage === 'hi' ? 'प्रोग्रेस ट्रैकर' : 'Progress Tracker',
      icon: TrendingUp,
      prompts: {
        hi: [
          'प्रोग्रेस ट्रैकर में रोजाना कौन से लक्षण दर्ज करने चाहिए?',
          'नींद, पानी और तनाव को ट्रैक करने से पीसीओएस में क्या सुधार होता है?',
          '30 दिनों का लक्षण सुधार स्कोर (Symptom Severity) कैसे देखें?',
          'अपनी प्रोग्रेस रिपोर्ट डॉक्टर के साथ कैसे शेयर करें?',
        ],
        en: [
          'What biometrics and symptoms should I log in the Progress Tracker?',
          'How does tracking sleep, water, and stress correlate with cycle health?',
          'How does the 30-day symptom severity reduction graph work?',
          'How can I export my wellness report for my gynecologist?',
        ],
      },
    },
    tests: {
      label: currentLanguage === 'hi' ? 'जांच व 3D मॉडल' : 'Tests & 3D Anatomy',
      icon: Layers,
      prompts: {
        hi: [
          '3D मॉडल में पीसीओएस वाले अंडाशय की बनावट कैसे देखें?',
          'पीसीओएस जांचने के लिए रॉटरडैम क्राइटेरिया क्या है?',
          'फास्टिंग इंसुलिन और HOMA-IR टेस्ट क्यों जरूरी है?',
          'LH और FSH का अनुपात 2:1 या 3:1 होने का क्या मतलब है?',
          'सोनोग्राफी में मोतियों की माला (String of Pearls) फॉलिकल्स क्या होते हैं?',
        ],
        en: [
          'Show me the 3D Ovarian Model and immature follicle anatomy',
          'What is the Rotterdam 2023 diagnostic criteria for PCOS?',
          'Why is Fasting Insulin more important than normal blood sugar?',
          'What does an elevated LH to FSH ratio (2:1 or 3:1) mean?',
          'What is the ultrasound "string of pearls" follicle sign?',
        ],
      },
    },
    doctor: {
      label: currentLanguage === 'hi' ? 'डॉक्टर व आशा दीदी' : 'Doctor & ASHA Care',
      icon: Stethoscope,
      prompts: {
        hi: [
          'स्त्रीश्योर पर ₹199 में गायनेकोलॉजिस्ट से परामर्श कैसे बुक करें?',
          'आशा दीदी से सैनिटरी पैड और पोषण सहायता कैसे लें?',
          'डॉक्टर से परामर्श से पहले मुझे क्या-क्या तैयारी करनी चाहिए?',
          'क्या डॉक्टर मेरी पिछली अल्ट्रासाउंड और ब्लड रिपोर्ट की जांच करेंगी?',
        ],
        en: [
          'How to book a confidential gynecologist teleconsult for ₹199?',
          'How can local ASHA workers help with menstrual hygiene and tests?',
          'What questions should I ask my gynecologist during consultation?',
          'Can the doctor review my previous lab and ultrasound reports?',
        ],
      },
    },
  };

  const currentCategoryData = categoryPCOSQuestions[activeCategory];
  const categoryPrompts =
    currentCategoryData.prompts[currentLanguage] || currentCategoryData.prompts.en || [];

  const handleSendMessage = async (userTextToSend?: string) => {
    const text = userTextToSend || inputText;
    if (!text.trim()) return;

    // Check if the user is asking to open 3D model directly
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes('3d') ||
      lowerText.includes('three d') ||
      lowerText.includes('मॉडल') ||
      lowerText.includes('3डी')
    ) {
      // Still send message to get smart description, but also offer 3d modal trigger
    }

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoadingAi(true);

    try {
      const res = await fetch('/api/gemini/voice-saathi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          language: currentLanguage,
          context: {
            userRole: currentUser?.role || 'USER',
            userName: currentUser?.fullName || 'Guest',
          },
        }),
      });

      const data = await res.json();
      const reply =
        data.reply ||
        (currentLanguage === 'hi'
          ? 'माहवारी में देरी और हार्मोनल बदलावों को संतुलित पोषण और डॉक्टर की सलाह से प्रबंधित किया जा सकता है।'
          : 'Cycle variations can be managed through balanced nutrition, inositol, and specialized gynecological care.');

      const saathiMsg: Message = {
        id: 'saathi_' + Date.now(),
        sender: 'saathi',
        text: reply,
        keyTakeaways: data.keyTakeaways || [],
        followUpQuestions: data.followUpQuestions || [],
        actionIntent: data.actionIntent || 'none',
        actionLabel: data.actionLabel || '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, saathiMsg]);

      // Automatically speak the response
      setCurrentlySpeakingId(saathiMsg.id);
      speakText(reply, currentLanguage, () => {
        setCurrentlySpeakingId(null);
      });
    } catch (e) {
      console.error('Error fetching Voice Saathi response:', e);
      const fallbackMsg: Message = {
        id: 'saathi_' + Date.now(),
        sender: 'saathi',
        text:
          currentLanguage === 'hi'
            ? 'माहवारी में देरी हार्मोनल बदलाव या इंसुलिन रेजिस्टेंस से हो सकती है। आप स्त्री रोग विशेषज्ञ से परामर्श ले सकती हैं।'
            : 'Cycle variations can be caused by hormonal imbalances or insulin resistance. Consulting a gynecologist is recommended.',
        keyTakeaways: [
          currentLanguage === 'hi'
            ? 'इंसुलिन और हार्मोन का संतुलन बनाए रखें।'
            : 'Maintain balanced blood sugar and insulin sensitivity.',
          currentLanguage === 'hi'
            ? 'मायो-इनोसिटोल और सही पोषण से लाभ होता है।'
            : 'Myo-Inositol and low-glycemic nutrition are clinically beneficial.',
        ],
        followUpQuestions:
          currentLanguage === 'hi'
            ? ['मायो-इनोसिटोल कैसे काम करता है?', 'डॉक्टर से परामर्श कैसे लें?']
            : ['How does Myo-Inositol work?', 'How to consult a doctor on StreeSure?'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleToggleSpeakMessage = (msg: Message) => {
    if (currentlySpeakingId === msg.id) {
      stopSpeaking();
      setCurrentlySpeakingId(null);
    } else {
      stopSpeaking();
      setCurrentlySpeakingId(msg.id);
      speakText(msg.text, currentLanguage, () => {
        setCurrentlySpeakingId(null);
      });
    }
  };

  const startVoiceInput = () => {
    if (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang =
        currentLanguage === 'hi'
          ? 'hi-IN'
          : currentLanguage === 'bn'
          ? 'bn-IN'
          : currentLanguage === 'mr'
          ? 'mr-IN'
          : currentLanguage === 'ta'
          ? 'ta-IN'
          : currentLanguage === 'te'
          ? 'te-IN'
          : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const sampleSpoken =
          currentLanguage === 'hi'
            ? 'माहवारी 35 दिनों से अधिक लेट क्यों होती है?'
            : 'Why does PCOS cause cycles delayed beyond 35 days?';
        handleSendMessage(sampleSpoken);
      }, 1500);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleActionClick = (action: string) => {
    if (action === '3d') {
      onOpen3DModal();
    } else if (action === 'screening') {
      onNavigateTab('screening');
      onClose();
    } else if (action === 'doctors') {
      onNavigateTab('doctors');
      onClose();
    } else if (action === 'knowledge') {
      onNavigateTab('knowledge');
      onClose();
    } else if (action === 'community' || action === 'asha') {
      onNavigateTab('community');
      onClose();
    } else if (action === 'tracker' || action === 'progress_tracker') {
      onNavigateTab('progress_tracker');
      onClose();
    } else if (action === 'exercise_portal') {
      onNavigateTab('exercise_portal');
      onClose();
    } else if (action === 'home_remedies') {
      onNavigateTab('home_remedies');
      onClose();
    } else if (action === 'store') {
      onNavigateTab('store');
      onClose();
    }
  };

  const handleClearHistory = () => {
    stopSpeaking();
    setCurrentlySpeakingId(null);
    setMessages([
      {
        id: 'msg_welcome_reset',
        sender: 'saathi',
        text:
          currentLanguage === 'hi'
            ? 'बातचीत रीसेट हो गई है। आप पीसीओएस, माहवारी स्वास्थ्य, आहार, 3D मॉडल या डॉक्टर परामर्श के बारे में नया प्रश्न पूछ सकती हैं।'
            : 'Conversation cleared. You can ask a fresh question about PCOS root causes, nutrition, 3D anatomy, or doctor consultations.',
        keyTakeaways: [
          currentLanguage === 'hi'
            ? 'किसी भी विषय को नीचे दिए गए टैब से चुनें।'
            : 'Select any category below to explore specific PCOS topics.',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full h-[90vh] max-h-[780px] shadow-2xl border border-rose-100 flex flex-col overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-200 shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Voice Saathi AI</h3>
                <span className="bg-emerald-400 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  PCOS Specialist
                </span>
              </div>
              <p className="text-[11px] text-rose-100">
                Evidence-Based PCOS Knowledge, 3D Anatomy & Care Navigation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Clear history */}
            <button
              type="button"
              onClick={handleClearHistory}
              title="Clear Conversation"
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition text-xs flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-white/30 cursor-pointer focus:outline-hidden"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-slate-900 font-medium">
                  {l.nativeLabel}
                </option>
              ))}
            </select>

            <button
              type="button"
              id="btn-close-voice-modal"
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Navigation Bar for Deep PCOS Topics */}
        <div className="bg-slate-100 border-b border-slate-200/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {(
            [
              { key: 'symptoms', label: categoryPCOSQuestions.symptoms.label, icon: Activity },
              { key: 'myths', label: categoryPCOSQuestions.myths.label, icon: HelpCircle },
              { key: 'nutrition', label: categoryPCOSQuestions.nutrition.label, icon: Sparkles },
              { key: 'exercise', label: categoryPCOSQuestions.exercise.label, icon: Dumbbell },
              { key: 'remedies', label: categoryPCOSQuestions.remedies.label, icon: Leaf },
              { key: 'tracker', label: categoryPCOSQuestions.tracker.label, icon: TrendingUp },
              { key: 'tests', label: categoryPCOSQuestions.tests.label, icon: Layers },
              { key: 'doctor', label: categoryPCOSQuestions.doctor.label, icon: Stethoscope },
            ] as const
          ).map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Audio Visualizer & Waveform Animation Bar */}
        {(isListening || currentlySpeakingId || isLoadingAi) && (
          <div className="bg-rose-50 border-b border-rose-100 py-2 px-4 flex items-center justify-between text-xs font-bold text-rose-800 animate-in fade-in">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 h-4">
                <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_100ms] h-3" />
                <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_200ms] h-4" />
                <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_300ms] h-2" />
                <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_400ms] h-5" />
                <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_150ms] h-3" />
              </div>
              <span>
                {isListening
                  ? currentLanguage === 'hi'
                    ? 'आपकी आवाज़ सुनी जा रही है...'
                    : 'Listening in your mother tongue...'
                  : isLoadingAi
                  ? currentLanguage === 'hi'
                    ? 'वॉयस साथी उत्तर तैयार कर रही है...'
                    : 'Voice Saathi is preparing response...'
                  : currentLanguage === 'hi'
                  ? 'उत्तर बोला जा रहा है...'
                  : 'Speaking answer aloud...'}
              </span>
            </div>

            {currentlySpeakingId && (
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setCurrentlySpeakingId(null);
                }}
                className="text-slate-600 hover:text-rose-600 flex items-center gap-1 font-semibold text-[11px] bg-white px-2 py-0.5 rounded-lg border border-rose-200 shadow-2xs"
              >
                <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                <span>Mute Voice</span>
              </button>
            )}
          </div>
        )}

        {/* Messages Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60">
          {(messages || []).map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'saathi' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-700 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white font-medium rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                }`}
              >
                {/* Main text message */}
                <div className="flex items-start justify-between gap-2">
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.sender === 'saathi' && (
                    <button
                      type="button"
                      onClick={() => handleToggleSpeakMessage(msg)}
                      title={currentlySpeakingId === msg.id ? 'Stop Voice' : 'Read Aloud'}
                      className={`p-1.5 rounded-lg transition shrink-0 ${
                        currentlySpeakingId === msg.id
                          ? 'bg-rose-100 text-rose-700'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                      }`}
                    >
                      {currentlySpeakingId === msg.id ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Key Takeaways Card if present */}
                {msg.sender === 'saathi' &&
                  msg.keyTakeaways &&
                  msg.keyTakeaways.length > 0 && (
                    <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5 font-bold text-rose-900 text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                        <span>
                          {currentLanguage === 'hi' ? 'मुख्य बिंदु (Key Facts)' : 'Key Takeaways'}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {(msg.keyTakeaways || []).map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5 text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Action Button Trigger if present */}
                {msg.sender === 'saathi' && msg.actionIntent && msg.actionIntent !== 'none' && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleActionClick(msg.actionIntent!)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs shadow-xs transition"
                    >
                      <span className="flex items-center gap-1.5">
                        {msg.actionIntent === '3d' && <Layers className="w-4 h-4 text-amber-300" />}
                        {msg.actionIntent === 'screening' && (
                          <Activity className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'doctors' && (
                          <Stethoscope className="w-4 h-4 text-amber-300" />
                        )}
                        {(msg.actionIntent === 'tracker' || msg.actionIntent === 'progress_tracker') && (
                          <TrendingUp className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'exercise_portal' && (
                          <Dumbbell className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'home_remedies' && (
                          <Leaf className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'store' && (
                          <ShoppingBag className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'community' && (
                          <Users className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'knowledge' && (
                          <BookOpen className="w-4 h-4 text-amber-300" />
                        )}
                        <span>
                          {msg.actionLabel ||
                            (msg.actionIntent === '3d'
                              ? 'Launch 3D Ovarian Model'
                              : msg.actionIntent === 'screening'
                              ? 'Take 3-Min Risk Assessment'
                              : msg.actionIntent === 'doctors'
                              ? 'Consult Gynecologist (₹199)'
                              : msg.actionIntent === 'exercise_portal'
                              ? 'Open Exercise & Yoga Portal'
                              : msg.actionIntent === 'home_remedies'
                              ? 'Open Home Remedies Portal'
                              : msg.actionIntent === 'progress_tracker' || msg.actionIntent === 'tracker'
                              ? 'Open PCOS Progress Tracker'
                              : 'Explore Platform Feature')}
                        </span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Dynamic Smart Follow-up Questions */}
                {msg.sender === 'saathi' &&
                  msg.followUpQuestions &&
                  msg.followUpQuestions.length > 0 && (
                    <div className="pt-1 space-y-1.5 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {currentLanguage === 'hi'
                          ? 'आगे क्या पूछना चाहती हैं?'
                          : 'Suggested Follow-Up Questions:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(msg.followUpQuestions || []).map((q, qIdx) => (
                          <button
                            key={qIdx}
                            type="button"
                            onClick={() => handleSendMessage(q)}
                            className="text-left px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-[11px] font-medium border border-slate-200/80 transition"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                <span
                  className={`block text-[10px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-rose-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoadingAi && (
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-3 text-xs text-slate-500 rounded-tl-none flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>
                  {currentLanguage === 'hi'
                    ? 'स्त्रीश्योर एआई जानकारी का विश्लेषण कर रही है...'
                    : 'Voice Saathi is synthesizing medical evidence...'}
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Dynamic Category Suggested Prompts Bar */}
        <div className="p-2.5 sm:p-3 bg-white border-t border-slate-200">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
              {currentCategoryData.label}:
            </span>
            {(categoryPrompts || []).map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (
                    prompt.toLowerCase().includes('3d') ||
                    prompt.toLowerCase().includes('अंडाशय')
                  ) {
                    handleSendMessage(prompt);
                  } else {
                    handleSendMessage(prompt);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-50/70 hover:bg-rose-100 text-rose-900 text-[11px] font-semibold whitespace-nowrap border border-rose-100 transition shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input & Voice Trigger Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2">
          {/* Big Microphone Push-to-Talk / Toggle */}
          <button
            type="button"
            id="btn-voice-mic-modal"
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            className={`p-3.5 rounded-2xl transition shadow-md flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-300 ring-4 ring-rose-200'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
            title="Tap to speak in your language"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              currentLanguage === 'hi'
                ? 'पीसीओएस, लक्षण, डाइट या डॉक्टर के बारे में पूछें (यहाँ लिखें या माइक दबाएं)...'
                : 'Ask about PCOS symptoms, inositol, diet, myths, or tests (type or tap mic)...'
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden shadow-inner"
          />

          <button
            type="button"
            id="btn-voice-send"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoadingAi}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white transition shrink-0 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

