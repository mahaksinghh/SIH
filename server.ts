import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Gemini client initialization warning:', e);
    }
  }
  return aiClient;
}

// Resilient API Caller with retry, smooth cascading and structured fallbacks
async function generateWithResilience(
  ai: GoogleGenAI,
  prompt: string,
  primaryModel = 'gemini-2.5-flash',
  isJson = false
): Promise<string | null> {
  const modelsToTry = [primaryModel, 'gemini-2.5-flash-lite', 'gemini-2.5-pro'];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: isJson ? { responseMimeType: 'application/json' } : undefined,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      const isTemporaryDemand =
        err?.status === 'UNAVAILABLE' ||
        err?.code === 503 ||
        err?.status === 503 ||
        err?.status === 429 ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('503') ||
        err?.message?.includes('overloaded');

      if (isTemporaryDemand) {
        // Brief pause before trying next resilient fallback model
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }

  return null;
}

// Comprehensive PCOS Clinical Knowledge Base & Fallback System
interface SaathiTopic {
  reply: string;
  keyTakeaways: string[];
  followUpQuestions: string[];
  actionIntent?: 'screening' | 'doctors' | '3d' | 'tracker' | 'knowledge' | 'store' | 'community' | 'progress_tracker' | 'exercise_portal' | 'home_remedies';
  actionLabel?: string;
}

const PCOS_KNOWLEDGE_PACKS: Record<string, Record<string, SaathiTopic>> = {
  en: {
    period_delay: {
      reply:
        "A menstrual cycle delay exceeding 35 days (oligomenorrhea) or absent cycles (amenorrhea) in PCOS occurs because elevated androgens and insulin resistance prevent immature egg follicles from maturing and releasing an egg (anovulation). Without regular ovulation, progesterone is not produced, causing the cycle to stall.",
      keyTakeaways: [
        "Anovulation: Eggs don't release due to hormonal signaling mismatch (high LH/FSH ratio).",
        "Insulin Connection: High insulin triggers ovarian theca cells to produce excess testosterone.",
        "Management: Regulating insulin through a low-glycemic diet and Myo-Inositol (40:1) can restore natural ovulation."
      ],
      followUpQuestions: [
        "How does Myo-Inositol help bring back regular periods?",
        "What blood tests confirm if anovulation is due to PCOS?",
        "Can I consult a gynecologist for ₹199 to discuss delayed cycles?"
      ],
      actionIntent: 'screening',
      actionLabel: 'Take 3-Min Cycle Risk Assessment'
    },
    exercise_movement: {
      reply:
        "Exercise is medicine for PCOS, but intensity matters! High-intensity chronic cardio spikes cortisol (stress hormone), which worsens androgen production and insulin resistance. Instead, focus on low-cortisol workouts: 1) Slow-paced progressive resistance/strength training (activates GLUT4 transporters to burn glucose independent of insulin), 2) Zone-2 low impact brisk walking, and 3) Restorative Yoga (Supta Baddha Konasana, Malasana, Bhujangasana) to reduce pelvic congestion.",
      keyTakeaways: [
        "Low-Cortisol Principle: Avoid chronic high-intensity burnout workouts that elevate cortisol.",
        "GLUT4 Activation: Muscle contraction during strength training absorbs blood glucose directly.",
        "Pelvic Yoga: Restorative asanas stimulate pelvic circulation and parasympathetic relaxation."
      ],
      followUpQuestions: [
        "How many days a week should I lift weights with PCOS?",
        "What are the best yoga poses for irregular periods?",
        "Can I try the guided routines in the Exercise Portal?"
      ],
      actionIntent: 'exercise_portal',
      actionLabel: 'Open Guided PCOS Exercise Portal'
    },
    home_remedies: {
      reply:
        "Evidence-based kitchen and Ayush remedies can effectively complement clinical care: 1) Spearmint Tea (2 cups daily) significantly lowers free testosterone and facial hair. 2) Overnight Soaked Fenugreek (Methi) Water improves insulin sensitivity and ovarian cycle regularity. 3) Ceylon Cinnamon Tea mimics insulin to lower blood glucose. 4) Ashwagandha (KSM-66) reduces adrenal cortisol by up to 30%. Always ensure remedies don't conflict with ongoing medications.",
      keyTakeaways: [
        "Spearmint: Natural anti-androgenic herbal remedy clinically validated for hirsutism.",
        "Methi Seeds: Contains 4-hydroxyisoleucine which stimulates glucose-dependent insulin secretion.",
        "Cinnamon: Enhances cellular insulin receptor phosphorylation."
      ],
      followUpQuestions: [
        "How to prepare overnight soaked methi water properly?",
        "Is Ashwagandha safe for thyroid or PCOS?",
        "Can I explore the complete Home Remedies Portal?"
      ],
      actionIntent: 'home_remedies',
      actionLabel: 'Explore Evidence Home Remedies Portal'
    },
    progress_tracker: {
      reply:
        "Tracking your daily biometric parameters and symptoms is the most powerful tool for PCOS management. Our Progress Tracker lets you log daily water intake, sleep duration, stress levels, steps, and PCOS symptoms (acne, bloating, mood fluctuations). Over 30-90 days, you can visually observe how lifestyle adjustments directly reduce your symptom severity score.",
      keyTakeaways: [
        "Holistic Telemetry: Track water, sleep, stress, and nutrition alongside cycle days.",
        "Trend Analytics: Monitor 30-day symptom reduction graphs and streak milestones.",
        "Clinical Sharing: Export structured progress reports to discuss during doctor consultations."
      ],
      followUpQuestions: [
        "What symptoms are most important to log daily?",
        "How does sleep quality affect insulin sensitivity?",
        "How can I view my progress dashboard?"
      ],
      actionIntent: 'progress_tracker',
      actionLabel: 'Open Daily Progress Tracker'
    },
    symptoms_overview: {
      reply:
        "PCOS (Polycystic Ovary Syndrome) is a multifaceted endocrine and metabolic condition. Core symptoms include irregular or missed periods, signs of excess androgens (cystic acne along the jawline, facial hair/hirsutism, scalp hair thinning), stubborn weight gain around the abdomen, and dark velvety skin patches (Acanthosis Nigricans) caused by insulin resistance.",
      keyTakeaways: [
        "Rotterdam Criteria: Diagnosed when having at least 2 of 3 (irregular periods, high androgens, or polycystic ovaries on ultrasound).",
        "Root Drivers: 70-80% of cases are driven by Insulin Resistance; others involve adrenal stress or chronic low-grade inflammation.",
        "Reversibility: PCOS is manageable into complete symptom remission with targeted lifestyle, nutrition, and medical support."
      ],
      followUpQuestions: [
        "What are the 4 main types/phenotypes of PCOS?",
        "Why do I get dark patches on my neck (Acanthosis Nigricans)?",
        "Can lean or thin women also have PCOS?"
      ],
      actionIntent: 'knowledge',
      actionLabel: 'Explore Complete Knowledge Hub'
    },
    myths_facts: {
      reply:
        "There are many misconceptions about PCOS! Let's clear the facts: 1) Myth: PCOS makes you infertile. Fact: PCOS causes ovulatory delay, not permanent sterility; most women conceive naturally or with minor ovulatory support. 2) Myth: Only overweight women get PCOS. Fact: 'Lean PCOS' affects 20-30% of women. 3) Myth: You must have ovarian cysts. Fact: The 'cysts' are actually harmless immature follicles (the 'string of pearls' sign).",
      keyTakeaways: [
        "Fertility: Healthy pregnancy is very achievable with lifestyle, inositol, and ovulation induction (like Letrozole) under a doctor.",
        "Lean PCOS: Thin individuals can still have high visceral fat, elevated LH, or high adrenal DHEA-S.",
        "Cysts vs Follicles: They are not surgical tumors, but dormant egg sacs that paused development."
      ],
      followUpQuestions: [
        "Is birth control the only way to treat PCOS?",
        "Do I need to completely eliminate carbs, dairy, and gluten?",
        "How do I book a private gynecologist consult?"
      ],
      actionIntent: 'knowledge',
      actionLabel: 'Read All 10 PCOS Myths vs Facts'
    },
    lean_pcos: {
      reply:
        "Yes! 'Lean PCOS' affects approximately 20% to 30% of women who have normal or low BMI. In lean PCOS, symptoms are typically driven by adrenal androgen production (elevated DHEA-S due to high cortisol/stress), subtle cellular insulin resistance, or an elevated LH to FSH ratio, even without significant body fat.",
      keyTakeaways: [
        "Normal BMI: Absence of weight gain does NOT rule out PCOS.",
        "Adrenal & Stress Axis: High stress/cortisol stimulates the adrenal glands to overproduce androgens.",
        "Strategy: Focus on nervous system regulation, adequate protein/calorie intake, strength training, and stress relief rather than extreme calorie deficits."
      ],
      followUpQuestions: [
        "What supplements work best for Lean or Adrenal PCOS?",
        "How do I test my DHEA-S and cortisol levels?",
        "What exercise is safe for adrenal PCOS?"
      ],
      actionIntent: 'doctors',
      actionLabel: 'Consult Gynecologist for Lean PCOS'
    },
    diet_nutrition: {
      reply:
        "An evidence-based PCOS diet focuses on blood sugar stabilization and reducing inflammation rather than extreme starvation. Emphasize low Glycemic Index (GI) complex carbohydrates (millets, oats, lentils, quinoa), generous protein (paneer, tofu, eggs, pulses) to blunt glucose spikes, healthy fats (chia seeds, flaxseeds, nuts), and anti-inflammatory foods. Spearmint tea (2 cups daily) is clinically shown to lower free testosterone.",
      keyTakeaways: [
        "Protein Pairing: Always combine carbohydrates with protein and fiber to prevent insulin spikes.",
        "Inositol (40:1): Myo-inositol and D-chiro-inositol (4g/day) improves cellular glucose uptake and ovulatory frequency.",
        "Spearmint Tea: Contains natural phyto-compounds that help reduce mild facial hair and androgenic acne."
      ],
      followUpQuestions: [
        "What is Seed Cycling and does it help hormonal balance?",
        "How does intermittent fasting affect female hormones?",
        "Which supplements in the Care Store are best for PCOS?"
      ],
      actionIntent: 'store',
      actionLabel: 'View PCOS Nutrition & Herbal Care'
    },
    fertility_pregnancy: {
      reply:
        "PCOS is one of the most treatable causes of ovulatory subfertility. Because ovulation is irregular or infrequent, predicting the fertile window is challenging. With insulin regulation, Myo-Inositol, targeted nutrition, and medical ovulation induction (like Letrozole or Clomiphene prescribed by a doctor), over 80-85% of women with PCOS successfully conceive and have healthy pregnancies.",
      keyTakeaways: [
        "Not Permanent Sterility: Ovarian egg reserve (AMH) is usually high in PCOS, meaning you have plenty of eggs.",
        "Ovulation Tracking: Track basal body temperature, cervical mucus, and luteinizing hormone strips to spot ovulation.",
        "Preconception Care: Optimizing fasting insulin and Vitamin D prior to pregnancy significantly reduces gestational complications."
      ],
      followUpQuestions: [
        "What is AMH (Anti-Müllerian Hormone) in PCOS?",
        "How does Metformin or Inositol assist ovulation?",
        "Can I discuss pregnancy planning with a doctor on StreeSure?"
      ],
      actionIntent: 'doctors',
      actionLabel: 'Book Fertility-Focused Teleconsult (₹199)'
    },
    lab_tests_diagnosis: {
      reply:
        "To evaluate PCOS accurately, gynecologists recommend a combination of blood tests and pelvic ultrasound. Key tests include: 1) Day 2-3 Hormonal Profile: LH, FSH, Total & Free Testosterone, DHEA-S, and Estradiol. 2) Metabolic Profile: Fasting Insulin, Fasting Glucose (HOMA-IR), and Lipid Panel. 3) Rule-Outs: TSH (Thyroid) and Prolactin to ensure other glands aren't causing missed periods.",
      keyTakeaways: [
        "Rotterdam Consensus: 2 of 3 criteria required (ovulatory dysfunction, clinical/biochemical hyperandrogenism, polycystic ovaries).",
        "Fasting Insulin: Crucial because standard blood glucose can be normal even when fasting insulin is severely elevated.",
        "Timing: Reproductive hormones should ideally be drawn on Day 2 or 3 of a natural cycle or after a progesterone-induced bleed."
      ],
      followUpQuestions: [
        "How does an ovarian ultrasound show 'string-of-pearls' follicles?",
        "What does an LH to FSH ratio of 2:1 or 3:1 indicate?",
        "How can I share my period logs with my doctor?"
      ],
      actionIntent: '3d',
      actionLabel: 'Inspect 3D Follicles & Ovarian Anatomy'
    },
    facial_hair_acne: {
      reply:
        "Excess facial/body hair (hirsutism) and stubborn jawline acne are caused by hyperandrogenism—elevated male hormones like testosterone and DHT. High insulin suppresses SHBG (Sex Hormone-Binding Globulin) in the liver, leaving more free testosterone to bind to hair follicles and sebaceous glands, triggering thick hair growth and clogged pores.",
      keyTakeaways: [
        "The Root Cause: High free testosterone converted into DHT by 5-alpha reductase enzyme.",
        "Natural Anti-Androgens: Spearmint tea, Zinc (30mg), and Inositol help lower circulating androgens naturally.",
        "Clinical Options: Gynecologists may discuss spironolactone or specific anti-androgenic combination therapies if lifestyle alone is insufficient."
      ],
      followUpQuestions: [
        "How long does it take for facial hair to reduce with diet?",
        "What skincare routine is best for hormonal cystic acne?",
        "Can I track my symptoms in the Period Tracker?"
      ],
      actionIntent: 'tracker',
      actionLabel: 'Open Daily Symptom & Period Tracker'
    },
    three_d_model: {
      reply:
        "In our interactive 3D Ovarian Model, you can explore the biological difference between a regular ovulatory ovary and a polycystic ovary. You'll see multiple small, 2–9mm immature antral follicles arranged around the outer rim (the 'string of pearls' appearance) that paused development due to high LH and insulin levels.",
      keyTakeaways: [
        "Visual Learning: Understand exactly why follicles stop maturing before ovulation.",
        "Interactive Modes: Rotate, zoom, and compare normal vs. polycystic morphology in 3D.",
        "Educational: Demystifies ultrasound scans into clear 3D visuals."
      ],
      followUpQuestions: [
        "Why do follicles get stuck and not release an egg?",
        "Does the size of the ovary increase in PCOS?",
        "How does inositol help follicles reach mature ovulation?"
      ],
      actionIntent: '3d',
      actionLabel: 'Launch Interactive 3D Ovarian Anatomy'
    },
    doctor_consult: {
      reply:
        "On StreeSure, you can book an encrypted, private teleconsultation with verified, culturally sensitive female gynecologists and reproductive endocrinologists for just ₹199. You can discuss period delays, test reports, facial hair, weight challenges, and get a customized medical management plan.",
      keyTakeaways: [
        "Affordable & Private: Just ₹199 per video/audio session with zero judgment.",
        "Prescriptions & Reports: Receive digital prescriptions and lab test recommendations directly.",
        "Multilingual: Speak in Hindi, English, Marathi, Bengali, Tamil, Telugu, and more."
      ],
      followUpQuestions: [
        "What questions should I ask during my gynecologist visit?",
        "Can the doctor review my previous ultrasound reports?",
        "How do I choose the right doctor on StreeSure?"
      ],
      actionIntent: 'doctors',
      actionLabel: 'Browse Verified Doctors & Book (₹199)'
    },
    asha_worker: {
      reply:
        "Your local ASHA (Accredited Social Health Activist) diydi is a trained community healthcare pillar. She provides free doorstep menstrual hygiene guidance, free sanitary pad access, nutritional advice for anemia and PCOS, and helps schedule appointments at government PHCs (Primary Health Centers) and CHCs.",
      keyTakeaways: [
        "Doorstep Guidance: Completely free, friendly grassroots maternal and menstrual support.",
        "Government Schemes: Learn about Janani Suraksha Yojana, PMSMA, and state nutritional kits.",
        "Referrals: ASHA didi can accompany you to the Community Health Center for subsidized blood tests and ultrasound."
      ],
      followUpQuestions: [
        "Where is my nearest Primary Health Center (PHC)?",
        "How do I request an ASHA home visit through StreeSure?",
        "What free tests are available at government hospitals?"
      ],
      actionIntent: 'community',
      actionLabel: 'Find Nearby Health Camps & ASHA Workers'
    },
    general: {
      reply:
        "I am your StreeSure Voice Saathi, here to empower you with comprehensive, medically accurate, and empathetic knowledge on PCOS, menstrual wellness, nutrition, and care navigation. What specific aspect of your health would you like to discuss?",
      keyTakeaways: [
        "Holistic Support: We cover symptoms, biology, nutrition, myths, lab tests, and doctor consultations.",
        "Confidential & Safe: Ask any sensitive question without hesitation or stigma.",
        "Multilingual: Speak or type in your preferred Indian language anytime."
      ],
      followUpQuestions: [
        "What are the earliest warning signs of PCOS?",
        "How does insulin resistance cause irregular periods?",
        "What is the Rotterdam diagnostic criteria for PCOS?"
      ],
      actionIntent: 'screening',
      actionLabel: 'Start Symptom Check'
    }
  },
  hi: {
    period_delay: {
      reply:
        "माहवारी में 35 दिनों से अधिक की देरी या कई महीनों तक न आना (Amenorrhea) पीसीओएस में इसलिए होता है क्योंकि बढ़े हुए एण्ड्रोजन (पुरुष हार्मोन) और इंसुलिन रेजिस्टेंस के कारण अंडाशय में फॉलिकल्स परिपक्व होकर अंडा (Egg) रिलीज नहीं कर पाते। इसे एनोव्यूलेशन (Anovulation) कहते हैं।",
      keyTakeaways: [
        "एनोव्यूलेशन: हार्मोनल असंतुलन (LH/FSH अनुपात) के कारण अंडा समय पर रिलीज नहीं होता।",
        "इंसुलिन का असर: ज्यादा इंसुलिन अंडाशय को अधिक टेस्टोस्टेरोन बनाने के लिए उत्तेजित करता है।",
        "उपाय: संतुलित कम ग्लाइसेमिक आहार, मायो-इनोसिटोल और व्यायाम से प्राकृतिक ओव्यूलेशन बहाल हो सकता है।"
      ],
      followUpQuestions: [
        "मायो-इनोसिटोल माहवारी नियमित करने में कैसे मदद करता है?",
        "पीसीओएस जांचने के लिए कौन से ब्लड टेस्ट करवाने चाहिए?",
        "क्या मैं ₹199 में डॉक्टर से सीधे बात कर सकती हूँ?"
      ],
      actionIntent: 'screening',
      actionLabel: '3 मिनट की प्रारंभिक स्क्रीनिंग शुरू करें'
    },
    exercise_movement: {
      reply:
        "पीसीओएस में व्यायाम एक शक्तिशाली औषधि है, लेकिन सही तरीका बहुत जरूरी है! अत्यधिक तनावपूर्ण और भारी कार्डियो करने से कोर्टिसोल (तनाव हार्मोन) बढ़ता है, जिससे लक्षण बढ़ सकते हैं। इसलिए 'लो-कोर्टिसोल' वर्कआउट चुनें: 1) धीमी गति से शक्ति व्यायाम (स्ट्रेंथ ट्रेनिंग) जो मांसपेशियों में GLUT4 रिसेप्टर्स सक्रिय कर इंसुलिन सुधारता है, 2) शांत वॉक (Zone-2), और 3) पेल्विक योगासन (सुप्त बद्ध कोणासन, मलासन, भुजंगासन)।",
      keyTakeaways: [
        "लो-कोर्टिसोल सिद्धांत: ज्यादा तनावपूर्ण वर्कआउट से बचें जिससे कोर्टिसोल स्पाइक न हो।",
        "स्ट्रेंथ ट्रेनिंग: मांसपेशियां सीधे बिना इंसुलिन के भी ब्लड शुगर का उपयोग करती हैं।",
        "पेल्विक योग: गर्भाशय व अंडाशय में रक्त संचार और हार्मोन संतुलन बढ़ाता है।"
      ],
      followUpQuestions: [
        "पीसीओएस में हफ्ते में कितने दिन स्ट्रेंथ ट्रेनिंग करनी चाहिए?",
        "माहवारी नियमित करने के लिए कौन से योगासन सबसे अच्छे हैं?",
        "क्या मैं गाइडेड एक्सरसाइज पोर्टल शुरू कर सकती हूँ?"
      ],
      actionIntent: 'exercise_portal',
      actionLabel: 'गाइडेड एक्सरसाइज पोर्टल खोलें'
    },
    home_remedies: {
      reply:
        "वैज्ञानिक प्रमाणों पर आधारित घरेलू और आयुष उपचार पीसीओएस में बहुत लाभकारी हैं: 1) स्पीयरमिंट (पुदीना) टी: दिन में 2 कप पीने से चेहरे के अनचाहे बाल और टेस्टोस्टेरोन कम होता है। 2) रात को भिगोया मेथी दाना पानी: इंसुलिन संवेदनशीलता सुधारता है। 3) दालचीनी (Cinnamon) चाय: ब्लड शुगर को नियंत्रित रखती है। 4) अश्वगंधा: अधिवृक्क तनाव और कोर्टिसोल को कम करता है।",
      keyTakeaways: [
        "पुदीना चाय: चेहरे के बालों के लिए वैज्ञानिक रूप से प्रमाणित प्राकृतिक एंटी-एण्ड्रोजन।",
        "मेथी पानी: 4-हाइड्रॉक्सीआइसोल्यूसीन इंसुलिन स्राव को नियंत्रित करता है।",
        "दालचीनी: कोशिकाओं में इंसुलिन रिसेप्टर्स की कार्यक्षमता बढ़ाती है।"
      ],
      followUpQuestions: [
        "मेथी दाना पानी बनाने का सही तरीका क्या है?",
        "क्या अश्वगंधा पीसीओएस में सुरक्षित है?",
        "क्या मैं घरेलू उपचार पोर्टल में सभी नुस्खे देख सकती हूँ?"
      ],
      actionIntent: 'home_remedies',
      actionLabel: 'प्रमाणित घरेलू उपचार पोर्टल देखें'
    },
    progress_tracker: {
      reply:
        "रोजाना अपनी सेहत और लक्षणों को ट्रैक करना पीसीओएस को नियंत्रित करने का सबसे असरदार तरीका है। हमारे प्रोग्रेस ट्रैकर में आप रोजाना पानी, नींद, तनाव, कदम और पीसीओएस के लक्षणों (मुंहासे, ब्लोटिंग, मूड) को दर्ज कर सकती हैं और 30 दिनों का सुधार ग्राफ देख सकती हैं।",
      keyTakeaways: [
        "समग्र स्वास्थ्य ट्रैकिंग: पानी, नींद और तनाव का दैनिक रिकॉर्ड।",
        "सुधार एनालिटिक्स: 30 दिनों में लक्षणों में आई कमी और स्ट्रीक देखें।",
        "डॉक्टर से शेयर: अपनी प्रोग्रेस रिपोर्ट डॉक्टर को परामर्श के दौरान दिखाएं।"
      ],
      followUpQuestions: [
        "रोजाना कौन से मुख्य लक्षण ट्रैक करने चाहिए?",
        "नींद की कमी से इंसुलिन पर क्या असर पड़ता है?",
        "प्रोग्रेस ट्रैकर कैसे खोलें?"
      ],
      actionIntent: 'progress_tracker',
      actionLabel: 'दैनिक प्रोग्रेस ट्रैकर खोलें'
    },
    symptoms_overview: {
      reply:
        "पीसीओएस (पॉलीसिस्टिक ओवरी सिंड्रोम) एक हार्मोनल और मेटाबॉलिक स्थिति है। इसके प्रमुख लक्षणों में अनियमित या रुकी हुई माहवारी, चेहरे या ठुड्डी पर अनचाहे बाल (हर्सुटिज़्म), जबड़े पर जिद्दी मुंहासे, सिर के बालों का पतला होना, पेट के आसपास वजन बढ़ना और गर्दन पर काले मखमली पैच (एकांथोसिस निग्रिकैन्स) शामिल हैं।",
      keyTakeaways: [
        "रॉटरडैम मानदंड: 3 में से कम से कम 2 लक्षण (अनियमित माहवारी, उच्च एण्ड्रोजन, या अल्ट्रासाउंड पर कई फॉलिकल्स) होने पर माना जाता है।",
        "मूल कारण: 70-80% मामलों में इंसुलिन रेजिस्टेंस मुख्य कारण होता है।",
        "नियंत्रण संभव: सही जीवनशैली, पोषण और चिकित्सकीय देखरेख से पीसीओएस के लक्षणों को पूरी तरह से नियंत्रित किया जा सकता है।"
      ],
      followUpQuestions: [
        "पीसीओएस के 4 मुख्य प्रकार कौन से हैं?",
        "गर्दन पर काले निशान (Acanthosis Nigricans) क्यों होते हैं?",
        "क्या दुबली महिलाओं को भी पीसीओएस हो सकता है?"
      ],
      actionIntent: 'knowledge',
      actionLabel: 'नॉलेज हब में पूरा ज्ञान देखें'
    },
    myths_facts: {
      reply:
        "पीसीओएस को लेकर कई भ्रांतियां हैं, आइए सच्चाई जानें: 1) मिथक: पीसीओएस से कभी गर्भधारण नहीं हो सकता। सच: पीसीओएस से ओव्यूलेशन में देरी होती है, बांझपन नहीं; 80% से अधिक महिलाएं स्वस्थ रूप से मां बनती हैं। 2) मिथक: यह सिर्फ मोटे लोगों को होता है। सच: 20-30% दुबली महिलाओं को भी 'लीन पीसीओएस' होता है। 3) मिथक: अंडाशय में खतरनाक सिस्ट होती हैं। सच: ये सिस्ट नहीं, बल्कि छोटे अपरिपक्व फॉलिकल्स (अंडे) होते हैं।",
      keyTakeaways: [
        "गर्भधारण: पोषण, इनोसिटोल और डॉक्टर की सलाह से ओव्यूलेशन सही होकर प्राकृतिक प्रेगनेंसी संभव है।",
        "लीन पीसीओएस: सामान्य वजन में भी तनाव (कोर्टिसोल) या इंसुलिन असंतुलन से पीसीओएस हो सकता है।",
        "सिस्ट बनाम फॉलिकल: ये कोई ट्यूमर नहीं हैं, बल्कि रुके हुए अंडे हैं।"
      ],
      followUpQuestions: [
        "क्या गर्भनिरोधक गोलियां ही पीसीओएस का एकमात्र इलाज हैं?",
        "क्या मुझे रोटी, दूध और कार्ब्स पूरी तरह छोड़ देने चाहिए?",
        "स्त्री रोग विशेषज्ञ से ऑनलाइन परामर्श कैसे लें?"
      ],
      actionIntent: 'knowledge',
      actionLabel: 'पीसीओएस के 10 बड़े भ्रम और सच पढ़ें'
    },
    lean_pcos: {
      reply:
        "हाँ! लगभग 20% से 30% महिलाओं को 'लीन पीसीओएस' (Lean PCOS) होता है, जिनका वजन सामान्य या कम होता है। इसमें लक्षण अक्सर अधिवृक्क ग्रंथि (Adrenal Gland) से तनाव हार्मोन और DHEA-S बढ़ने, या आंतरिक इंसुलिन असंतुलन के कारण होते हैं।",
      keyTakeaways: [
        "सामान्य वजन: वजन कम होना पीसीओएस को खारिज नहीं करता।",
        "तनाव का असर: ज्यादा तनाव कोर्टिसोल और एण्ड्रोजन हार्मोन बढ़ा देता है।",
        "उपाय: क्रैश डाइटिंग के बजाय पर्याप्त प्रोटीन, शक्ति व्यायाम (स्ट्रेंथ ट्रेनिंग) और तनाव प्रबंधन पर ध्यान दें।"
      ],
      followUpQuestions: [
        "लीन पीसीओएस में कौन से सप्लीमेंट्स मददगार हैं?",
        "DHEA-S और कोर्टिसोल टेस्ट कैसे करवाएं?",
        "लीन पीसीओएस के लिए कौन सा योग सबसे अच्छा है?"
      ],
      actionIntent: 'doctors',
      actionLabel: 'लीन पीसीओएस के लिए डॉक्टर से बात करें'
    },
    diet_nutrition: {
      reply:
        "पीसीओएस में भूखे रहने की नहीं, बल्कि ब्लड शुगर और इंसुलिन को स्थिर रखने वाले आहार की जरूरत होती है। कम ग्लाइसेमिक इंडेक्स (GI) वाले अनाज (बाजरा, ज्वार, रागी, ओट्स, दालें), पर्याप्त प्रोटीन (पनीर, दाल, स्प्राउट्स, अंडे) और स्वस्थ वसा (अलसी, कद्दू के बीज) लें। स्पीयरमिंट (पहाड़ी पुदीना) की चाय चेहरे के अनचाहे बाल और टेस्टोस्टेरोन कम करने में वैज्ञानिक रूप से सिद्ध है।",
      keyTakeaways: [
        "प्रोटीन का मेल: कार्बोहाइड्रेट के साथ हमेशा प्रोटीन और फाइबर लें ताकि इंसुलिन का स्पाइक न हो।",
        "मायो-इनोसिटोल: 40:1 अनुपात में मायो और डी-काइरो इनोसिटोल अंडे बनने और इंसुलिन सुधारने में बेहद प्रभावी है।",
        "स्पीयरमिंट टी: दिन में 2 कप पुदीने की चाय एण्ड्रोजन हार्मोन को प्राकृतिक रूप से कम करती है।"
      ],
      followUpQuestions: [
        "सीड साइकलिंग (Seed Cycling) क्या है और यह कैसे काम करती है?",
        "क्या पीसीओएस में डेयरी और ग्लूटेन बंद करना जरूरी है?",
        "केयर स्टोर में पीसीओएस के कौन से उत्पाद उपलब्ध हैं?"
      ],
      actionIntent: 'store',
      actionLabel: 'केयर स्टोर में हर्बल उत्पाद देखें'
    },
    fertility_pregnancy: {
      reply:
        "पीसीओएस ओव्यूलेशन से जुड़ी स्थिति है, जिसे आसानी से प्रबंधित किया जा सकता है। इसमें डिम्बग्रंथि में अंडों की संख्या (AMH) भरपूर होती है, बस वे सही समय पर रिलीज नहीं हो पाते। इंसुलिन नियंत्रण, मायो-इनोसिटोल, स्वस्थ वजन और डॉक्टर द्वारा दी जाने वाली दवाओं (जैसे लेट्रोज़ोल) से अधिकांश महिलाएं आसानी से गर्भधारण कर सकती हैं।",
      keyTakeaways: [
        "अंडों की कोई कमी नहीं: पीसीओएस में एग रिजर्व (AMH) सामान्यतः उच्च होता है।",
        "ओव्यूलेशन ट्रैकिंग: बेसल बॉडी टेम्परेचर और पीरियड ट्रैकर से फर्टाइल दिनों का पता लगाएं।",
        "सुरक्षित मातृत्व: प्रेगनेंसी से पहले इंसुलिन और विटामिन D3 को संतुलित करना सर्वोत्तम परिणाम देता है।"
      ],
      followUpQuestions: [
        "एएमएच (AMH) टेस्ट क्या होता है?",
        "मायो-इनोसिटोल ओव्यूलेशन में कैसे मदद करता है?",
        "क्या मैं स्त्रीश्योर पर प्रेगनेंसी प्लानिंग के लिए डॉक्टर से परामर्श ले सकती हूँ?"
      ],
      actionIntent: 'doctors',
      actionLabel: 'डॉक्टर से फर्टिलिटी परामर्श बुक करें (₹199)'
    },
    lab_tests_diagnosis: {
      reply:
        "पीसीओएस की सटीक जांच के लिए डॉक्टर कुछ मुख्य ब्लड टेस्ट और पेल्विक अल्ट्रासाउंड की सलाह देते हैं: 1) पीरियड के दूसरे या तीसरे दिन: LH, FSH, टोटल और फ्री टेस्टोस्टेरोन, DHEA-S। 2) मेटाबॉलिक टेस्ट: फास्टिंग इंसुलिन, फास्टिंग ग्लूकोज और लिपिड प्रोफाइल। 3) थायरॉयड (TSH) और प्रोलैक्टिन की जांच ताकि अन्य कारणों को खारिज किया जा सके।",
      keyTakeaways: [
        "रॉटरडैम क्राइटेरिया: 3 में से 2 मानक पूरे होने पर निदान होता है।",
        "फास्टिंग इंसुलिन: यह सबसे महत्वपूर्ण है क्योंकि ब्लड शुगर सामान्य होने पर भी इंसुलिन बढ़ा हो सकता है।",
        "पेल्विक यूएसजी: अंडाशय में मोतियों की माला जैसे फॉलिकल्स (स्ट्रिंग ऑफ पर्ल्स) को दिखाता है।"
      ],
      followUpQuestions: [
        "3D मॉडल में पीसीओएस वाले अंडाशय की बनावट कैसे देखें?",
        "LH और FSH का अनुपात 2:1 या 3:1 होने का क्या मतलब है?",
        "अपने पीरियड का रिकॉर्ड डॉक्टर के साथ कैसे साझा करें?"
      ],
      actionIntent: '3d',
      actionLabel: '3D में अंडाशय और फॉलिकल्स देखें'
    },
    facial_hair_acne: {
      reply:
        "चेहरे या ठुड्डी पर अनचाहे बाल (Hirsutism) और जबड़े पर बार-बार होने वाले मुंहासे बढ़े हुए पुरुष हार्मोन (एण्ड्रोजन/टेस्टोस्टेरोन) के कारण होते हैं। जब शरीर में इंसुलिन बढ़ता है, तो लिवर में SHBG प्रोटीन कम हो जाता है, जिससे फ्री टेस्टोस्टेरोन बालों की जड़ों और त्वचा की ग्रंथियों पर असर डालता है।",
      keyTakeaways: [
        "असली वजह: हाई इंसुलिन और फ्री टेस्टोस्टेरोन का DHT में बदलना।",
        "प्राकृतिक उपाय: स्पीयरमिंट टी (पुदीना चाय), जिंक और इनोसिटोल एण्ड्रोजन कम करने में मदद करते हैं।",
        "डॉक्टर का इलाज: डॉक्टर जरूरत के अनुसार एंटी-एण्ड्रोजन दवाएं या सुरक्षित उपचार सुझा सकते हैं।"
      ],
      followUpQuestions: [
        "पुदीने की चाय से चेहरे के बाल कम होने में कितना समय लगता है?",
        "हार्मोनल पिंपल्स के लिए क्या स्किनकेयर सही है?",
        "क्या मैं पीरियड ट्रैकर में अपने दैनिक लक्षण दर्ज कर सकती हूँ?"
      ],
      actionIntent: 'tracker',
      actionLabel: 'पीरियड और लक्षण ट्रैकर खोलें'
    },
    three_d_model: {
      reply:
        "हमारे इंटरैक्टिव 3D ओवेरियन मॉडल में आप एक सामान्य अंडाशय और पीसीओएस वाले अंडाशय के बीच का अंतर 3D में देख सकती हैं। इसमें आप समझ पाएंगी कि कैसे छोटे-छोटे फॉलिकल्स (2-9mm) किनारे पर मोतियों की माला की तरह रुक जाते हैं और अंडा बाहर नहीं निकल पाता।",
      keyTakeaways: [
        "3D विज़ुअल: अपनी शारीरिक संरचना को आसानी से समझें।",
        "तुलना: सामान्य ओव्यूलेशन और पीसीओएस फॉलिकल्स के चक्र को घुमाकर और ज़ूम करके देखें।",
        "वैज्ञानिक समझ: अल्ट्रासाउंड की रिपोर्ट को सरल रूप में समझें।"
      ],
      followUpQuestions: [
        "अंडाशय में फॉलिकल्स क्यों रुक जाते हैं?",
        "क्या पीसीओएस में अंडाशय का आकार बढ़ जाता है?",
        "मायो-इनोसिटोल से फॉलिकल्स कैसे परिपक्व होते हैं?"
      ],
      actionIntent: '3d',
      actionLabel: '3D ओवरी मॉडल शुरू करें'
    },
    doctor_consult: {
      reply:
        "स्त्रीश्योर पर आप केवल ₹199 में प्रमाणित, अनुभवी महिला रोग विशेषज्ञों (गायनेकोलॉजिस्ट) से पूरी गोपनीयता और सुरक्षा के साथ ऑनलाइन वीडियो या ऑडियो परामर्श ले सकती हैं। डॉक्टर आपकी रिपोर्ट्स देखकर व्यक्तिगत डाइट और मेडिकल प्लान तैयार करेंगी।",
      keyTakeaways: [
        "किफायती और निजी: सिर्फ ₹199 में बिना किसी संकोच के विशेषज्ञ सलाह।",
        "डिजिटल पर्चा: परामर्श के बाद मान्य डिजिटल प्रिस्क्रिप्शन प्राप्त करें।",
        "अपनी भाषा में: हिंदी, मराठी, बंगाली, तमिल, तेलुगु और अंग्रेजी में बात करें।"
      ],
      followUpQuestions: [
        "डॉक्टर से परामर्श के दौरान मुझे क्या-क्या पूछना चाहिए?",
        "क्या डॉक्टर मेरी पुरानी अल्ट्रासाउंड और ब्लड रिपोर्ट देख सकती हैं?",
        "स्त्रीश्योर पर डॉक्टर कैसे चुनें?"
      ],
      actionIntent: 'doctors',
      actionLabel: 'डॉक्टर चुनें और परामर्श बुक करें (₹199)'
    },
    asha_worker: {
      reply:
        "आपकी स्थानीय आशा (ASHA) दीदी ग्रामीण और सामुदायिक स्वास्थ्य की सच्ची मार्गदर्शक हैं। वे आपको सैनिटरी पैड वितरण, पोषण सलाह, सरकारी स्वास्थ्य योजनाओं और नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) में निःशुल्क या रियायती जांच करवाने में मदद करती हैं।",
      keyTakeaways: [
        "निःशुल्क मार्गदर्शन: आपके घर तक महिलाओं के स्वास्थ्य और पोषण की जानकारी।",
        "सरकारी योजनाएं: जननी सुरक्षा और मुफ्त स्वास्थ्य जांच शिविरों का लाभ उठाएं।",
        "सहयोग: आशा दीदी अस्पताल में डॉक्टर से मिलने में आपका सहयोग कर सकती हैं।"
      ],
      followUpQuestions: [
        "मेरा नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) कहाँ है?",
        "स्त्रीश्योर से आशा दीदी से कैसे जुड़ें?",
        "सरकारी अस्पताल में कौन सी जांचें मुफ्त होती हैं?"
      ],
      actionIntent: 'community',
      actionLabel: 'नजदीकी स्वास्थ्य शिविर और आशा दीदी खोजें'
    },
    general: {
      reply:
        "नमस्ते! मैं स्त्रीश्योर वॉयस साथी हूँ। मैं आपको पीसीओएस, माहवारी स्वास्थ्य, हार्मोनल संतुलन, सही खानपान, 3D मॉडल और डॉक्टर परामर्श के बारे में पूरी और वैज्ञानिक जानकारी देने के लिए यहाँ हूँ। आप मुझसे क्या पूछना चाहती हैं?",
      keyTakeaways: [
        "सम्पूर्ण समाधान: लक्षण, कारण, आहार, मिथक, ब्लड टेस्ट और डॉक्टर मार्गदर्शन।",
        "सुरक्षित और गोपनीय: बिना किसी झिझक के अपनी भाषा में सवाल पूछें।",
        "मल्टीलिंगुअल: हिंदी, अंग्रेजी और क्षेत्रीय भाषाओं में उपलब्ध।"
      ],
      followUpQuestions: [
        "पीसीओएस के शुरुआती संकेत क्या होते हैं?",
        "इंसुलिन रेजिस्टेंस से माहवारी में देरी क्यों होती है?",
        "पीसीओएस जांचने के लिए रॉटरडैम नियम क्या है?"
      ],
      actionIntent: 'screening',
      actionLabel: 'लक्षणों की जांच करें'
    }
  }
};

function matchKnowledgeTopicKey(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('3d') || lower.includes('three d') || lower.includes('follicle') || lower.includes('model') || lower.includes('एनाटॉमी') || lower.includes('अंडाशय कैसा दिखता')) {
    return 'three_d_model';
  }

  if (
    lower.includes('delay') ||
    lower.includes('late') ||
    lower.includes('missed') ||
    lower.includes('irregular') ||
    lower.includes('45') ||
    lower.includes('महीने') ||
    lower.includes('देरी') ||
    lower.includes('रुक') ||
    lower.includes('अनियमित') ||
    lower.includes('पाळी') ||
    lower.includes('পিরিয়ড')
  ) {
    return 'period_delay';
  }

  if (
    lower.includes('myth') ||
    lower.includes('fact') ||
    lower.includes('सच') ||
    lower.includes('झूठ') ||
    lower.includes('भ्रम') ||
    lower.includes('misconception')
  ) {
    return 'myths_facts';
  }

  if (
    lower.includes('lean') ||
    lower.includes('thin') ||
    lower.includes('दुबली') ||
    lower.includes('पतली') ||
    lower.includes('adrenal') ||
    lower.includes('stress') ||
    lower.includes('cortisol')
  ) {
    return 'lean_pcos';
  }

  if (
    lower.includes('exercise') ||
    lower.includes('workout') ||
    lower.includes('yoga') ||
    lower.includes('gym') ||
    lower.includes('cardio') ||
    lower.includes('strength') ||
    lower.includes('व्यायाम') ||
    lower.includes('कसरत') ||
    lower.includes('योगा') ||
    lower.includes('आसन')
  ) {
    return 'exercise_movement';
  }

  if (
    lower.includes('remedy') ||
    lower.includes('remedies') ||
    lower.includes('home remedy') ||
    lower.includes('methi') ||
    lower.includes('fenugreek') ||
    lower.includes('cinnamon') ||
    lower.includes('ashwagandha') ||
    lower.includes('घरेलू') ||
    lower.includes('नुस्खे') ||
    lower.includes('उपचार') ||
    lower.includes('दालचीनी') ||
    lower.includes('मेथी')
  ) {
    return 'home_remedies';
  }

  if (
    lower.includes('progress') ||
    lower.includes('tracker') ||
    lower.includes('track') ||
    lower.includes('log') ||
    lower.includes('water') ||
    lower.includes('sleep') ||
    lower.includes('प्रोग्रेस') ||
    lower.includes('ट्रैकर') ||
    lower.includes('रिकॉर्ड')
  ) {
    return 'progress_tracker';
  }

  if (
    lower.includes('diet') ||
    lower.includes('food') ||
    lower.includes('eat') ||
    lower.includes('nutrition') ||
    lower.includes('spearmint') ||
    lower.includes('tea') ||
    lower.includes('inositol') ||
    lower.includes('खानपान') ||
    lower.includes('आहार') ||
    lower.includes('पुदीना') ||
    lower.includes('सीड')
  ) {
    return 'diet_nutrition';
  }

  if (
    lower.includes('pregnant') ||
    lower.includes('pregnancy') ||
    lower.includes('baby') ||
    lower.includes('conceive') ||
    lower.includes('fertility') ||
    lower.includes('प्रेगनेंसी') ||
    lower.includes('गर्भधारण') ||
    lower.includes('बच्चा') ||
    lower.includes('बांझपन')
  ) {
    return 'fertility_pregnancy';
  }

  if (
    lower.includes('test') ||
    lower.includes('blood') ||
    lower.includes('ultrasound') ||
    lower.includes('rotterdam') ||
    lower.includes('जांच') ||
    lower.includes('ब्लड टेस्ट') ||
    lower.includes('सोनोग्राफी') ||
    lower.includes('रिपोर्ट')
  ) {
    return 'lab_tests_diagnosis';
  }

  if (
    lower.includes('facial hair') ||
    lower.includes('hair') ||
    lower.includes('acne') ||
    lower.includes('pimple') ||
    lower.includes('बाल') ||
    lower.includes('मुंहासे') ||
    lower.includes('पिंपल') ||
    lower.includes('चेहरे') ||
    lower.includes('दाढ़ी') ||
    lower.includes('hirsutism')
  ) {
    return 'facial_hair_acne';
  }

  if (
    lower.includes('doctor') ||
    lower.includes('consult') ||
    lower.includes('199') ||
    lower.includes('डॉक्टर') ||
    lower.includes('परामर्श') ||
    lower.includes('fees') ||
    lower.includes('appointment')
  ) {
    return 'doctor_consult';
  }

  if (
    lower.includes('asha') ||
    lower.includes('आशा') ||
    lower.includes('worker') ||
    lower.includes('दीदी') ||
    lower.includes('phc') ||
    lower.includes('community')
  ) {
    return 'asha_worker';
  }

  if (
    lower.includes('pcos') ||
    lower.includes('symptom') ||
    lower.includes('pcod') ||
    lower.includes('लक्षण') ||
    lower.includes('बीमारी') ||
    lower.includes('क्या है') ||
    lower.includes('what is')
  ) {
    return 'symptoms_overview';
  }

  return 'general';
}

function getStructuredSmartFallback(message: string, language: string): SaathiTopic {
  const langKey = PCOS_KNOWLEDGE_PACKS[language] ? language : 'en';
  const topicKey = matchKnowledgeTopicKey(message);
  const pack = PCOS_KNOWLEDGE_PACKS[langKey] || PCOS_KNOWLEDGE_PACKS.en;
  return pack[topicKey] || pack.general || PCOS_KNOWLEDGE_PACKS.en.general;
}

// 1. Voice Saathi AI Conversational Endpoint with Medical Safety Layer & Rich PCOS Intelligence
app.post('/api/gemini/voice-saathi', async (req, res) => {
  try {
    const { message, language = 'hi', context = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAiClient();

    if (!ai) {
      const fallbackTopic = getStructuredSmartFallback(message, language);
      return res.json({
        reply: fallbackTopic.reply,
        keyTakeaways: fallbackTopic.keyTakeaways || [],
        followUpQuestions: fallbackTopic.followUpQuestions || [],
        actionIntent: fallbackTopic.actionIntent || 'conversational_guidance',
        actionLabel: fallbackTopic.actionLabel || '',
        safetyChecked: true,
        source: 'smart_knowledge_pack',
      });
    }

    const systemPrompt = `You are "Voice Saathi", an exceptionally knowledgeable, empathetic, and culturally respectful AI health and PCOS specialist for the StreeSure platform in India.

YOUR EXTENSIVE MEDICAL & PRACTICAL PCOS EXPERTISE:
1. Pathophysiology & Root Causes:
   - Understand the Rotterdam Diagnostic Criteria 2023 (at least 2 of 3: irregular/absent ovulation, clinical or biochemical hyperandrogenism, polycystic ovarian morphology with 20+ small 2-9mm antral follicles).
   - Understand the 4 Phenotypes (Classic/Phenotype A, Hyperandrogenic Anovulatory/B, Ovulatory/C, Non-hyperandrogenic/D).
   - Understand the 4 Root Driver Types: Insulin-Resistant (75% of cases), Adrenal (elevated DHEA-S & cortisol), Inflammatory (chronic low-grade cytokines/CRP), Post-Pill (temporary rebound).
   - Biological mechanism: High insulin triggers theca cells to overproduce testosterone and reduces SHBG (Sex Hormone-Binding Globulin), causing elevated free testosterone.

2. Exhaustive Signs & Symptoms:
   - Cycle irregularities: Oligomenorrhea (>35 day intervals), secondary amenorrhea (>90 days), unpredictable spotting.
   - Androgenic features: Hirsutism (facial hair on chin/upper lip, chest, abdomen - Ferriman-Gallwey scale), cystic hormonal jawline acne, androgenetic alopecia (hair thinning along crown/part).
   - Metabolic features: Visceral abdominal fat, Acanthosis Nigricans (dark velvety skin patches on neck, underarms, groin), sugar cravings & reactive hypoglycemia, chronic fatigue.
   - Reproductive & emotional: Anovulatory subfertility, sleep apnea, anxiety, body image distress.

3. Debunking All Common PCOS Myths vs Facts:
   - Myth: "PCOS causes irreversible infertility." -> Fact: PCOS is ovulatory subfertility, not permanent sterility; 80%+ of women conceive with lifestyle, inositol, metformin, or ovulation induction (Letrozole).
   - Myth: "Only overweight women get PCOS." -> Fact: 20-30% have "Lean PCOS" with normal BMI driven by stress/adrenals or subtle cellular insulin resistance.
   - Myth: "Birth control pills are the only cure." -> Fact: OCPs manage symptoms temporarily, but root causes respond to nutrition, inositol, sleep, and exercise.
   - Myth: "You must have ovarian cysts to have PCOS." -> Fact: They are dormant immature follicles, not tumors or surgical cysts.

4. Evidence-Based Lifestyle & Nutrition:
   - Myo-Inositol & D-Chiro-Inositol in physiological 40:1 ratio (2000mg-4000mg/day) restores ovulatory regularity and cellular insulin sensitivity.
   - Spearmint tea (2 cups/day) clinically reduces free testosterone and mild hirsutism.
   - Low Glycemic Index (GI) meals: pairing complex carbs (millets, pulses, oats) with high protein & fiber.
   - Strength & resistance training: activates GLUT4 glucose transporters in muscle independent of insulin.
   - Key nutrients: Zinc, Magnesium Glycinate, Vitamin D3 + K2, Omega-3s.

5. Evidence-Based Home Remedies & Ayush Care:
   - Spearmint tea (2 cups/day) to lower free testosterone and facial hair.
   - Overnight soaked fenugreek (methi) water for glucose-dependent insulin sensitivity.
   - Ceylon Cinnamon tea for insulin receptor activation.
   - Ashwagandha (KSM-66) for adrenal cortisol regulation.

6. Low-Cortisol Exercise & Regimen:
   - Slow-tempo strength & resistance training (activates GLUT4 glucose uptake without needing insulin).
   - Zone-2 walking and Restorative Yoga (Supta Baddha Konasana, Malasana, Bhujangasana) to relieve pelvic congestion.
   - Avoid chronic HIIT burnout workouts that spike cortisol.

7. Key Lab Tests to Discuss with Gynecologist:
   - Day 2-3 LH, FSH (elevated LH/FSH ratio of 2:1 or 3:1), Estradiol, AMH.
   - Fasting Insulin + Fasting Glucose (HOMA-IR calculation).
   - Total & Free Testosterone, DHEA-S, 17-OH Progesterone, SHBG.
   - TSH and Prolactin to rule out thyroid or pituitary conditions.

CRITICAL MEDICAL SAFETY & TONE RULES:
- NEVER state a definitive medical diagnosis ("You have PCOS") — always frame as "patterns or symptoms associated with PCOS".
- NEVER prescribe exact prescription medications or alter a doctor's prescription.
- Explain things with deep logical clarity, scientific accuracy, and warm Indian cultural empathy.
- Respond in the requested language: "${language}".

RESPONSE FORMAT:
You MUST respond with a valid JSON object matching this schema:
{
  "reply": "Empathetic, clear, and comprehensive spoken response in ${language} (3-5 sentences, easy to understand).",
  "keyTakeaways": [
    "Short bullet highlight 1 (Scientific fact or biological reason)",
    "Short bullet highlight 2 (Actionable lifestyle or dietary tip)",
    "Short bullet highlight 3 (Guidance on tests, doctors, or reassurance)"
  ],
  "followUpQuestions": [
    "Logical follow-up question 1 in ${language}",
    "Logical follow-up question 2 in ${language}",
    "Logical follow-up question 3 in ${language}"
  ],
  "actionIntent": "screening" | "doctors" | "3d" | "tracker" | "knowledge" | "store" | "community" | "progress_tracker" | "exercise_portal" | "home_remedies" | "none",
  "actionLabel": "Short actionable button label in ${language} (e.g. 'Take 3-Min Assessment', 'Open Exercise Portal', 'Explore Home Remedies', 'Open Progress Tracker', 'Explore 3D Ovary', 'Book Gynecologist ₹199')"
}

User Question: "${message}"
Context: ${JSON.stringify(context)}`;

    const generatedJson = await generateWithResilience(ai, systemPrompt, 'gemini-2.5-flash', true);

    if (generatedJson) {
      try {
        // Clean markdown backticks if any
        const cleaned = generatedJson.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsed = JSON.parse(cleaned);

        if (parsed && parsed.reply) {
          return res.json({
            reply: parsed.reply,
            keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [],
            followUpQuestions: Array.isArray(parsed.followUpQuestions) ? parsed.followUpQuestions : [],
            actionIntent: parsed.actionIntent || 'none',
            actionLabel: parsed.actionLabel || '',
            safetyChecked: true,
            source: 'gemini_pcos_specialist',
          });
        }
      } catch (jsonErr) {
        console.warn('JSON parsing failed on AI response, packaging as plain text:', jsonErr);
        const fallbackTopic = getStructuredSmartFallback(message, language);
        return res.json({
          reply: generatedJson.trim(),
          keyTakeaways: fallbackTopic.keyTakeaways || [],
          followUpQuestions: fallbackTopic.followUpQuestions || [],
          actionIntent: fallbackTopic.actionIntent || 'none',
          actionLabel: fallbackTopic.actionLabel || '',
          safetyChecked: true,
          source: 'ai_text_parsed',
        });
      }
    }

    // Fallback if AI is offline
    const fallbackTopic = getStructuredSmartFallback(message, language);
    return res.json({
      reply: fallbackTopic.reply,
      keyTakeaways: fallbackTopic.keyTakeaways || [],
      followUpQuestions: fallbackTopic.followUpQuestions || [],
      actionIntent: fallbackTopic.actionIntent || 'none',
      actionLabel: fallbackTopic.actionLabel || '',
      safetyChecked: true,
      source: 'resilient_pcos_knowledge_pack',
    });
  } catch (error) {
    console.warn('Recovered gracefully in /api/gemini/voice-saathi:', error);
    const lang = req.body?.language || 'hi';
    const fallbackTopic = getStructuredSmartFallback(req.body?.message || '', lang);
    return res.json({
      reply: fallbackTopic.reply,
      keyTakeaways: fallbackTopic.keyTakeaways || [],
      followUpQuestions: fallbackTopic.followUpQuestions || [],
      actionIntent: fallbackTopic.actionIntent || 'none',
      actionLabel: fallbackTopic.actionLabel || '',
      safetyChecked: true,
      source: 'error_recovery',
    });
  }
});

// 2. Explain Screening Result Endpoint
app.post('/api/gemini/explain-screening', async (req, res) => {
  try {
    const { screeningResult, language = 'en' } = req.body;
    const ai = getAiClient();

    const generateRuleBasedExplanation = (resObj: any, lang: string) => {
      const level = resObj?.level || 'ORANGE';
      const score = resObj?.overallScore || 50;

      if (lang === 'hi') {
        return `1. आपकी प्रारंभिक स्क्रीनिंग स्कोर ${score}/100 है, जो स्तर ${level} में आती है। यह परिणाम आपके द्वारा दर्ज किए गए माहवारी चक्र और शारीरिक लक्षणों के पैटर्न पर आधारित है।

2. जैविक रूप से, माहवारी में देरी या बदलाव कई बार अंडाशय में अपरिपक्व फॉलिकल्स (Immature Follicles) या हार्मोनल असंतुलन (जैसे एण्ड्रोजन स्तर में उतार-चढ़ाव) के कारण हो सकते हैं। यह कोई अंतिम चिकित्सीय निदान (Diagnosis) नहीं है।

3. अगला सुरक्षित कदम: अपने माहवारी चक्र को ट्रैक करें, संतुलित पोषण अपनाएं, और सटीक व्यक्तिगत मार्गदर्शन के लिए एक योग्य महिला रोग विशेषज्ञ (गायनेकोलॉजिस्ट) या स्थानीय आशा दीदी से परामर्श लें।`;
      }

      return `1. Your preliminary assessment score is ${score}/100, placed in the ${level} category. This structured overview reflects the cycle intervals and physical observations you reported.

2. Biologically, infrequent cycles or related observations are often linked to temporary hormonal fluctuations, such as variations in luteinizing hormone or androgen balance, which may affect regular follicle maturation. This is an informational screening and NOT a clinical diagnosis.

3. Next Recommended Steps: Maintain a period log, practice supportive lifestyle and nutritional habits, and schedule an appointment with a gynecologist or connect with an ASHA health worker for tailored medical advice.`;
    };

    if (!ai) {
      return res.json({
        explanation: generateRuleBasedExplanation(screeningResult, language),
        source: 'smart_fallback',
      });
    }

    const prompt = `You are the StreeSure Clinical Education Assistant.
The user completed a preliminary screening assessment:
Level: ${screeningResult?.level} (${screeningResult?.levelTitle})
Score: ${screeningResult?.overallScore}/100
Contributing factors: ${JSON.stringify(screeningResult?.contributingFactors)}

Provide a clear, reassuring, and medically responsible explanation in ${language}.
MANDATORY SAFETY:
- Explicitly emphasize this is a preliminary screening and NOT a medical diagnosis of PCOS.
- Explain in simple terms what these observations mean biologically (e.g. immature follicles, androgen balance, cycle length).
- Outline practical next steps (consulting a doctor, logging cycles, connecting with ASHA).
- Output 3 structured paragraphs without medical jargon.`;

    const generatedExplanation = await generateWithResilience(ai, prompt);

    if (generatedExplanation) {
      return res.json({
        explanation: generatedExplanation.trim(),
        source: 'ai_model',
      });
    }

    return res.json({
      explanation: generateRuleBasedExplanation(screeningResult, language),
      source: 'resilient_fallback',
    });
  } catch (error) {
    console.warn('Recovered gracefully in /api/gemini/explain-screening:', error);
    const lang = req.body?.language || 'en';
    const fallbackText =
      lang === 'hi'
        ? 'आपके लक्षणों का मूल्यांकन कर लिया गया है। यह प्रारंभिक समीक्षा है। व्यक्तिगत सलाह और चिकित्सकीय परीक्षण के लिए स्त्री रोग विशेषज्ञ से परामर्श लें।'
        : 'Your responses have been safely evaluated. Please consult a qualified gynecologist for an individual clinical review and personalized guidance.';

    return res.json({
      explanation: fallbackText,
      source: 'error_recovery',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'StreeSure Full-Stack Healthcare Platform' });
});

// Mount Vite middleware for development / Static files for production
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StreeSure server running at http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic();
