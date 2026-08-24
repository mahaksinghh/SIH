import { LanguageCode, ScreeningAnswers } from '../types';

export const LANGUAGE_SPEECH_CODES: Record<LanguageCode, string> = {
  hi: 'hi-IN',
  en: 'en-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
};

// Natural Voice Parsing for Voice-First Screening
export function parseVoiceScreeningAnswer(
  transcript: string,
  currentQuestionKey: string,
  currentAnswers: ScreeningAnswers
): { updatedAnswers: Partial<ScreeningAnswers>; recognizedText: string; confidenceText: string } {
  const lower = transcript.toLowerCase();
  const res: Partial<ScreeningAnswers> = {};
  let recognizedText = transcript;
  let confidenceText = 'Recognized from your voice';

  // Numbers detection (Hindi / English / Marathi numerals)
  const numbersMap: Record<string, number> = {
    'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5, 'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
    'बीस': 20, 'इक्कीस': 21, 'बाईस': 22, 'तेईस': 23, 'चौबीस': 24, 'पच्चीस': 25, 'तीस': 30, 'पैंतीस': 35, 'चालीस': 40,
    'पैंतालीस': 45, 'पचास': 50, 'साठ': 60, 'सत्तर': 70, 'अस्सी': 80, 'नब्बे': 90,
  };

  let extractedNumber: number | null = null;
  const digitsMatch = transcript.match(/\d+/);
  if (digitsMatch) {
    extractedNumber = parseInt(digitsMatch[0], 10);
  } else {
    for (const [word, val] of Object.entries(numbersMap)) {
      if (lower.includes(word)) {
        extractedNumber = val;
        break;
      }
    }
  }

  // Question-specific extraction
  switch (currentQuestionKey) {
    case 'cycleRegularity':
      if (lower.includes('नियमित') || lower.includes('regular') || lower.includes('समय पर') || lower.includes('ठिक')) {
        res.cycleRegularity = 'regular_21_35';
        recognizedText = 'Regular cycles (21–35 days)';
      } else if (lower.includes('देर') || lower.includes('35') || lower.includes('40') || lower.includes('चालीस') || lower.includes('लेट') || lower.includes('late') || lower.includes('delayed')) {
        res.cycleRegularity = 'infrequent_over_35';
        recognizedText = 'Infrequent / delayed cycles (>35 days)';
      } else if (lower.includes('रुक') || lower.includes('बंद') || lower.includes('3 महीने') || lower.includes('महीनों') || lower.includes('missed') || lower.includes('absent')) {
        res.cycleRegularity = 'absent_3_months_plus';
        recognizedText = 'Absent for months (>3 months)';
      } else {
        res.cycleRegularity = 'infrequent_over_35';
        recognizedText = transcript;
      }
      break;

    case 'daysBetweenPeriods':
      if (extractedNumber) {
        res.daysBetweenPeriods = extractedNumber;
        recognizedText = `${extractedNumber} days gap between cycles`;
      } else if (lower.includes('चालीस') || lower.includes('40')) {
        res.daysBetweenPeriods = 40;
        recognizedText = '40 days gap';
      } else {
        res.daysBetweenPeriods = 35;
        recognizedText = transcript;
      }
      break;

    case 'increasedFacialHair':
      if (lower.includes('हाँ') || lower.includes('हां') || lower.includes('yes') || lower.includes('बहुत') || lower.includes('चेहरे') || lower.includes('facial hair') || lower.includes('दाढ़ी')) {
        res.increasedFacialHair = 'moderate_to_severe';
        recognizedText = 'Moderate / noticeable facial hair noted';
      } else if (lower.includes('थोड़ा') || lower.includes('कम') || lower.includes('mild') || lower.includes('हल्का')) {
        res.increasedFacialHair = 'mild';
        recognizedText = 'Mild facial hair';
      } else if (lower.includes('नहीं') || lower.includes('no') || lower.includes('बिलकुल नहीं')) {
        res.increasedFacialHair = 'none';
        recognizedText = 'No excess facial hair';
      } else {
        res.increasedFacialHair = 'mild';
        recognizedText = transcript;
      }
      break;

    case 'persistentAcne':
      if (lower.includes('हाँ') || lower.includes('हां') || lower.includes('yes') || lower.includes('पिंपल') || lower.includes('मुंहासे') || lower.includes('acne') || lower.includes('बहुत ज्यादा')) {
        res.persistentAcne = 'persistent_adult_cystic';
        recognizedText = 'Persistent adult / cystic acne';
      } else if (lower.includes('हल्का') || lower.includes('कभी-कभी') || lower.includes('mild')) {
        res.persistentAcne = 'mild_occasional';
        recognizedText = 'Mild / occasional acne';
      } else {
        res.persistentAcne = 'none';
        recognizedText = 'No significant acne';
      }
      break;

    case 'unexplainedWeightGain':
      if (lower.includes('हाँ') || lower.includes('हां') || lower.includes('yes') || lower.includes('वजन बढ़') || lower.includes('मोटापा') || lower.includes('कम नहीं होता') || lower.includes('weight gain')) {
        res.unexplainedWeightGain = 'significant_difficulty_losing';
        recognizedText = 'Significant weight gain / difficulty managing weight';
      } else if (lower.includes('थोड़ा') || lower.includes('moderate')) {
        res.unexplainedWeightGain = 'moderate';
        recognizedText = 'Moderate weight changes';
      } else {
        res.unexplainedWeightGain = 'none';
        recognizedText = 'No unexplained weight gain';
      }
      break;

    case 'familyDiabetesHistory':
      if (lower.includes('हाँ') || lower.includes('हां') || lower.includes('yes') || lower.includes('शुगर') || lower.includes('डायबिटीज') || lower.includes('मधुमेह') || lower.includes('परिवार')) {
        res.familyDiabetesHistory = true;
        recognizedText = 'Yes, family history of diabetes/blood sugar';
      } else {
        res.familyDiabetesHistory = false;
        recognizedText = 'No family history of diabetes';
      }
      break;

    default:
      recognizedText = transcript;
      break;
  }

  return { updatedAnswers: res, recognizedText, confidenceText };
}

// Multi-Language Speech Synthesis (TTS) Helper
export function speakText(text: string, lang: LanguageCode, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing utterance
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANGUAGE_SPEECH_CODES[lang] || 'en-IN';
  utterance.rate = 0.95; // Gentle, clear conversational pace
  utterance.pitch = 1.05; // Friendly warm tone

  // Attempt to select an Indian or regional voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find(
    (v) => v.lang === utterance.lang || v.lang.startsWith(lang) || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('hindi')
  );
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
