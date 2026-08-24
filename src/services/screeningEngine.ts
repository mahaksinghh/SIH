import { CategoryBreakdown, ScreeningAnswers, ScreeningLevel, ScreeningResult } from '../types';

export function calculateScreeningResult(userId: string, answers: ScreeningAnswers): ScreeningResult {
  let totalScore = 0;

  // 1. Category A: Menstrual Patterns (Max 30 pts)
  let menstrualScore = 0;
  const menstrualObs: string[] = [];

  if (answers.cycleRegularity === 'absent_3_months_plus') {
    menstrualScore += 25;
    menstrualObs.push('Prolonged absence of menstrual cycles (amenorrhea for >3 months)');
  } else if (answers.cycleRegularity === 'infrequent_over_35') {
    menstrualScore += 20;
    menstrualObs.push('Infrequent cycles lasting longer than 35 days (oligomenorrhea)');
  } else if (answers.cycleRegularity === 'frequent_under_21') {
    menstrualScore += 12;
    menstrualObs.push('Cycles occurring more frequently than every 21 days (polymenorrhea)');
  } else {
    menstrualObs.push('Reported regular menstrual cycle timing within 21–35 days');
  }

  if (answers.periodSkippingFrequency === 'frequently_multiple_times_a_year') {
    menstrualScore += 8;
    menstrualObs.push('Frequent skipped cycles across the past year');
  } else if (answers.periodSkippingFrequency === 'occasionally') {
    menstrualScore += 4;
  }

  if (answers.heavyProlongedBleeding) {
    menstrualScore += 5;
    menstrualObs.push('Heavy or prolonged menstrual bleeding');
  }

  if (answers.recentPatternChange) {
    menstrualScore += 4;
    menstrualObs.push('Notable recent shift in menstrual duration or frequency');
  }

  menstrualScore = Math.min(menstrualScore, 30);
  totalScore += menstrualScore;

  // 2. Category B: Hyperandrogen-related Features (Max 30 pts)
  let hyperandrogenScore = 0;
  const hyperandrogenObs: string[] = [];

  if (answers.increasedFacialHair === 'moderate_to_severe') {
    hyperandrogenScore += 12;
    hyperandrogenObs.push('Moderate to significant coarse facial hair growth (chin, upper lip, jawline)');
  } else if (answers.increasedFacialHair === 'mild') {
    hyperandrogenScore += 6;
    hyperandrogenObs.push('Mild excess facial hair noticeable');
  }

  if (answers.increasedBodyHair === 'moderate_to_severe') {
    hyperandrogenScore += 8;
    hyperandrogenObs.push('Excess body hair growth (chest, abdomen, back)');
  } else if (answers.increasedBodyHair === 'mild') {
    hyperandrogenScore += 4;
  }

  if (answers.persistentAcne === 'persistent_adult_cystic') {
    hyperandrogenScore += 8;
    hyperandrogenObs.push('Persistent adult or cystic acne resistant to standard skincare');
  } else if (answers.persistentAcne === 'mild_occasional') {
    hyperandrogenScore += 3;
  }

  if (answers.scalpHairThinning === 'noticeable_crown_thinning') {
    hyperandrogenScore += 8;
    hyperandrogenObs.push('Noticeable scalp hair thinning or crown shedding');
  } else if (answers.scalpHairThinning === 'mild_shedding') {
    hyperandrogenScore += 3;
  }

  if (answers.suddenHairChanges) {
    hyperandrogenScore += 4;
    hyperandrogenObs.push('Relatively sudden onset in hair texture or distribution');
  }

  hyperandrogenScore = Math.min(hyperandrogenScore, 30);
  totalScore += hyperandrogenScore;

  // 3. Category C: Metabolic & General Health (Max 15 pts)
  let metabolicScore = 0;
  const metabolicObs: string[] = [];

  if (answers.unexplainedWeightGain === 'significant_difficulty_losing') {
    metabolicScore += 7;
    metabolicObs.push('Substantial weight gain with persistent difficulty managing weight');
  } else if (answers.unexplainedWeightGain === 'moderate') {
    metabolicScore += 3;
  }

  if (answers.familyDiabetesHistory || answers.elevatedBloodSugarHistory) {
    metabolicScore += 5;
    metabolicObs.push('Personal or family history of elevated blood glucose / Type 2 diabetes');
  }

  if (answers.physicalActivityLevel === 'sedentary') {
    metabolicScore += 2;
    metabolicObs.push('Low physical activity / sedentary lifestyle factor');
  }

  if (answers.sleepQuality === 'poor_insomnia_apnea') {
    metabolicScore += 3;
    metabolicObs.push('Poor sleep quality, fatigue, or unrefreshing sleep');
  }

  metabolicScore = Math.min(metabolicScore, 15);
  totalScore += metabolicScore;

  // 4. Category D: Reproductive / Gynecological History (Max 15 pts)
  let reproductiveScore = 0;
  const reproductiveObs: string[] = [];

  if (answers.previousPelvicUltrasound === 'polyfollicular_cysts_seen') {
    reproductiveScore += 12;
    reproductiveObs.push('Prior ultrasound noted polyfollicular / multicystic ovarian appearance');
  }

  if (answers.previousHormonalTesting === 'elevated_androgens_lh_fsh') {
    reproductiveScore += 10;
    reproductiveObs.push('Prior laboratory tests showed elevated androgen or altered LH/FSH ratio');
  }

  if (answers.difficultyConceiving === 'trying_over_12_months') {
    reproductiveScore += 6;
    reproductiveObs.push('Difficulty conceiving despite trying for over 12 months (subfertility factor)');
  } else if (answers.difficultyConceiving === 'trying_over_6_months') {
    reproductiveScore += 3;
  }

  reproductiveScore = Math.min(reproductiveScore, 15);
  totalScore += reproductiveScore;

  // 5. Category E: Differential Context (Max 5 pts)
  let differentialScore = 0;
  const differentialObs: string[] = [];

  if (answers.knownThyroidDisorder) {
    differentialScore += 3;
    differentialObs.push('Known thyroid condition (which can mimic or overlap with menstrual irregularities)');
  }
  if (answers.highStressRecentEvents) {
    differentialScore += 2;
    differentialObs.push('Recent high stress or major lifestyle disruptions noted');
  }

  differentialScore = Math.min(differentialScore, 5);
  totalScore += differentialScore;

  // 6. Category F: Family History (Max 5 pts)
  let familyScore = 0;
  const familyObs: string[] = [];

  if (answers.familyPcosHistory) {
    familyScore += 4;
    familyObs.push('First-degree female relative (mother/sister) with PCOS history');
  }
  if (answers.familyCardiovascularMetabolic) {
    familyScore += 2;
    familyObs.push('Family history of early metabolic or cardiovascular concerns');
  }

  familyScore = Math.min(familyScore, 5);
  totalScore += familyScore;

  // Total Score normalization: 0 - 100
  totalScore = Math.min(Math.round(totalScore), 100);

  // Determine Level:
  // GREEN (0 - 28)
  // ORANGE (29 - 58)
  // RED (59 - 100)
  let level: ScreeningLevel = 'GREEN';
  let levelTitle = 'Lower screening concern';
  let levelDescription = 'The information currently provided does not show a strong pattern requiring urgent escalation through this screening tool.';

  if (totalScore >= 55 || (menstrualScore >= 20 && hyperandrogenScore >= 18)) {
    level = 'RED';
    levelTitle = 'Professional evaluation strongly recommended';
    levelDescription = 'Your responses show multiple concerning features or circumstances where professional assessment should not be delayed.';
  } else if (totalScore >= 26 || menstrualScore >= 15 || hyperandrogenScore >= 12) {
    level = 'ORANGE';
    levelTitle = 'Further evaluation recommended';
    levelDescription = 'The user\'s responses contain some features that may warrant discussion with a healthcare professional.';
  }

  // Build Categories
  const categories: CategoryBreakdown[] = [
    {
      categoryKey: 'menstrual',
      categoryTitle: 'Menstrual Patterns',
      score: menstrualScore,
      maxScore: 30,
      status: menstrualScore >= 18 ? 'high' : menstrualScore >= 8 ? 'moderate' : 'low',
      observations: menstrualObs,
    },
    {
      categoryKey: 'hyperandrogen',
      categoryTitle: 'Hyperandrogen-Related Features',
      score: hyperandrogenScore,
      maxScore: 30,
      status: hyperandrogenScore >= 16 ? 'high' : hyperandrogenScore >= 7 ? 'moderate' : 'low',
      observations: hyperandrogenObs,
    },
    {
      categoryKey: 'metabolic',
      categoryTitle: 'Metabolic & Lifestyle Indicators',
      score: metabolicScore,
      maxScore: 15,
      status: metabolicScore >= 9 ? 'high' : metabolicScore >= 4 ? 'moderate' : 'low',
      observations: metabolicObs,
    },
    {
      categoryKey: 'reproductive',
      categoryTitle: 'Reproductive & Clinical Context',
      score: reproductiveScore,
      maxScore: 15,
      status: reproductiveScore >= 9 ? 'high' : reproductiveScore >= 4 ? 'moderate' : 'low',
      observations: reproductiveObs,
    },
    {
      categoryKey: 'differential',
      categoryTitle: 'Differential Context & Overlap',
      score: differentialScore,
      maxScore: 5,
      status: differentialScore >= 3 ? 'moderate' : 'low',
      observations: differentialObs,
    },
    {
      categoryKey: 'family',
      categoryTitle: 'Family History',
      score: familyScore,
      maxScore: 5,
      status: familyScore >= 3 ? 'moderate' : 'low',
      observations: familyObs,
    },
  ];

  // Contributing factors aggregation
  const contributingFactors: string[] = [];
  categories.forEach((cat) => {
    if (cat.status === 'high' || cat.status === 'moderate') {
      cat.observations.forEach((obs) => contributingFactors.push(obs));
    }
  });

  if (contributingFactors.length === 0) {
    contributingFactors.push('Cycle and symptom reports are predominantly within typical physiological ranges.');
  }

  // Medical Safety & Explainability strings
  const whatItMeans: string[] = [];
  const whatItDoesNotMean: string[] = [];
  const recommendedNextSteps: string[] = [];

  if (level === 'RED') {
    whatItMeans.push('Your responses reflect multiple clustered indicators commonly seen in hormonal imbalances such as PCOS or thyroid/ovarian conditions.');
    whatItMeans.push('A licensed gynecologist or endocrinologist can evaluate your complete history and recommend confirmatory investigations (such as pelvic sonography or specific serum hormone panels).');

    whatItDoesNotMean.push('This is NOT a medical diagnosis of PCOS or any specific illness.');
    whatItDoesNotMean.push('This does NOT mean you have permanent infertility or irreversible health complications.');
    whatItDoesNotMean.push('This tool does not prescribe or change any medications.');

    recommendedNextSteps.push('Schedule a consultation with a registered Gynecologist via StreeSure or visit your nearest Community Health Center / District Hospital.');
    recommendedNextSteps.push('Connect with your local ASHA worker to facilitate guided referral paperwork and PHC navigation.');
    recommendedNextSteps.push('Maintain an ongoing menstrual log in the StreeSure Period Tracker to share objective timeline data with your doctor.');
    recommendedNextSteps.push('Avoid starting unverified over-the-counter hormonal supplements without clinical supervision.');
  } else if (level === 'ORANGE') {
    whatItMeans.push('Your answers noted some subtle features (such as cycle variations or mild skin/hair symptoms) that may benefit from clinical discussion.');
    whatItMeans.push('Mild hormonal fluctuations can occur due to stress, lifestyle, weight shifts, thyroid variations, or early PCOS tendencies.');

    whatItDoesNotMean.push('This result does NOT mean you definitely have PCOS.');
    whatItDoesNotMean.push('Having a few isolated symptoms is very common and not automatically pathological.');
    whatItDoesNotMean.push('This is not an emergency, but an opportunity for proactive health awareness.');

    recommendedNextSteps.push('Book an affordable teleconsultation with a Gynecologist to discuss your cycle patterns.');
    recommendedNextSteps.push('Log your upcoming cycles and physical symptoms in the StreeSure Period Tracker for 2–3 months.');
    recommendedNextSteps.push('Explore the Knowledge Hub on nutrition, stress resilience, and sleep hygiene.');
    recommendedNextSteps.push('Consult your local ASHA worker for regional women\'s health camp schedules.');
  } else {
    whatItMeans.push('Your reported cycle rhythm and physical traits currently align with standard healthy menstrual variations.');
    whatItMeans.push('No significant hyperandrogenic or metabolic clustering was identified in this screening session.');

    whatItDoesNotMean.push('This does NOT guarantee an absolute absence of all future gynecological concerns.');
    whatItDoesNotMean.push('It does not replace routine annual preventive checkups with your doctor.');

    recommendedNextSteps.push('Continue tracking your period onset, flow, and symptoms monthly in the StreeSure Period Tracker.');
    recommendedNextSteps.push('Read evidence-based guides in our Knowledge Hub to support your ongoing reproductive wellness.');
    recommendedNextSteps.push('Re-screen in 6–12 months or sooner if you observe unexpected cycle disruptions.');
  }

  return {
    id: 'scr_' + Math.random().toString(36).substring(2, 9),
    userId,
    date: new Date().toISOString(),
    level,
    levelTitle,
    levelDescription,
    overallScore: totalScore,
    categories,
    contributingFactors,
    whatItMeans,
    whatItDoesNotMean,
    recommendedNextSteps,
    disclaimer: 'IMPORTANT: StreeSure provides preliminary screening and health-navigation information. It does NOT provide a medical diagnosis, prescription, or treatment plan. Always consult a qualified healthcare professional.',
    answers,
  };
}

export const defaultMockScreeningAnswers: ScreeningAnswers = {
  cycleRegularity: 'infrequent_over_35',
  periodSkippingFrequency: 'frequently_multiple_times_a_year',
  recentPatternChange: true,
  heavyProlongedBleeding: true,
  daysBetweenPeriods: 42,
  lastPeriodDate: '2026-07-10',

  increasedFacialHair: 'moderate_to_severe',
  increasedBodyHair: 'mild',
  persistentAcne: 'persistent_adult_cystic',
  scalpHairThinning: 'mild_shedding',
  suddenHairChanges: false,

  unexplainedWeightGain: 'significant_difficulty_losing',
  familyDiabetesHistory: true,
  elevatedBloodSugarHistory: false,
  bloodPressureElevated: false,
  physicalActivityLevel: 'moderate_1_2_days',
  sleepQuality: 'poor_insomnia_apnea',

  difficultyConceiving: 'not_applicable',
  previousPelvicUltrasound: 'unsure',
  previousHormonalTesting: 'never',

  knownThyroidDisorder: false,
  highStressRecentEvents: true,
  majorHealthChanges: false,
  currentHormonalMeds: false,

  familyPcosHistory: true,
  familyCardiovascularMetabolic: false,
};
