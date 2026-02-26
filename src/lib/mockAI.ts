import { StudentProfile, CourseRecommendation, QuizQuestion, LearningPathStep } from '@/types/student';

export function generateQuizQuestions(subjects: string[]): QuizQuestion[] {
  const questionBank: Record<string, QuizQuestion[]> = {
    Mathematics: [
      { id: 'math1', question: 'What is the value of x in: 2x + 5 = 15?', options: ['3', '5', '7', '10'], correctAnswer: 1, subject: 'Mathematics' },
      { id: 'math2', question: 'The area of a circle with radius 7 cm is:', options: ['154 cm²', '144 cm²', '22 cm²', '44 cm²'], correctAnswer: 0, subject: 'Mathematics' },
      { id: 'math3', question: 'What is the HCF of 12 and 18?', options: ['2', '3', '6', '12'], correctAnswer: 2, subject: 'Mathematics' },
      { id: 'math4', question: 'The sum of angles in a triangle is:', options: ['90°', '180°', '270°', '360°'], correctAnswer: 1, subject: 'Mathematics' },
      { id: 'math5', question: 'If sin θ = 3/5, then cos θ = ?', options: ['4/5', '3/4', '5/3', '5/4'], correctAnswer: 0, subject: 'Mathematics' },
    ],
    Physics: [
      { id: 'phy1', question: 'The SI unit of force is:', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correctAnswer: 1, subject: 'Physics' },
      { id: 'phy2', question: 'Speed of light in vacuum is approximately:', options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], correctAnswer: 1, subject: 'Physics' },
      { id: 'phy3', question: 'Ohm\'s law states:', options: ['V = IR', 'V = I/R', 'V = R/I', 'V = I+R'], correctAnswer: 0, subject: 'Physics' },
      { id: 'phy4', question: 'Which mirror is used in car headlights?', options: ['Plane', 'Concave', 'Convex', 'None'], correctAnswer: 1, subject: 'Physics' },
      { id: 'phy5', question: 'The unit of power is:', options: ['Joule', 'Newton', 'Watt', 'Ampere'], correctAnswer: 2, subject: 'Physics' },
    ],
    Chemistry: [
      { id: 'chem1', question: 'The pH of a neutral solution is:', options: ['0', '7', '14', '1'], correctAnswer: 1, subject: 'Chemistry' },
      { id: 'chem2', question: 'The chemical formula of water is:', options: ['H₂O', 'CO₂', 'NaCl', 'H₂SO₄'], correctAnswer: 0, subject: 'Chemistry' },
      { id: 'chem3', question: 'Which gas is released during photosynthesis?', options: ['CO₂', 'O₂', 'N₂', 'H₂'], correctAnswer: 1, subject: 'Chemistry' },
      { id: 'chem4', question: 'Atomic number of Carbon is:', options: ['4', '6', '8', '12'], correctAnswer: 1, subject: 'Chemistry' },
      { id: 'chem5', question: 'Which is a noble gas?', options: ['Oxygen', 'Nitrogen', 'Helium', 'Hydrogen'], correctAnswer: 2, subject: 'Chemistry' },
    ],
    Biology: [
      { id: 'bio1', question: 'The powerhouse of the cell is:', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], correctAnswer: 1, subject: 'Biology' },
      { id: 'bio2', question: 'DNA stands for:', options: ['Deoxyribo Nucleic Acid', 'Di Nucleic Acid', 'Deoxyribo Natural Acid', 'None'], correctAnswer: 0, subject: 'Biology' },
      { id: 'bio3', question: 'Which vitamin is produced by sunlight?', options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], correctAnswer: 3, subject: 'Biology' },
    ],
    English: [
      { id: 'eng1', question: 'Identify the noun: "The cat sat on the mat."', options: ['sat', 'on', 'cat', 'the'], correctAnswer: 2, subject: 'English' },
      { id: 'eng2', question: 'What is the past tense of "run"?', options: ['runned', 'ran', 'running', 'runs'], correctAnswer: 1, subject: 'English' },
      { id: 'eng3', question: 'A synonym for "happy" is:', options: ['sad', 'joyful', 'angry', 'tired'], correctAnswer: 1, subject: 'English' },
    ],
  };

  const questions: QuizQuestion[] = [];
  subjects.forEach(subject => {
    const subjectQuestions = questionBank[subject] || [];
    questions.push(...subjectQuestions.slice(0, 3));
  });
  return questions.slice(0, 10);
}

export function generateRecommendations(profile: StudentProfile): CourseRecommendation[] {
  const difficultyMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {};
  const score = profile.quizScore || 50;
  
  profile.subjects.forEach(subject => {
    if (score < 40) difficultyMap[subject] = 'beginner';
    else if (score < 70) difficultyMap[subject] = 'intermediate';
    else difficultyMap[subject] = 'advanced';
  });

  const resourceMap: Record<string, string> = {
    video: 'Video Series',
    text: 'Study Notes',
    interactive: 'Interactive Module',
  };

  const recs: CourseRecommendation[] = [];
  
  profile.subjects.forEach((subject, i) => {
    const diff = difficultyMap[subject] || 'beginner';
    const goalLabel = profile.goals.includes('jee_neet') ? 'JEE/NEET' : profile.goals.includes('board_exam') ? 'Board Exam' : 'Skill Building';
    
    recs.push({
      id: `rec-${i}-1`,
      title: `Class ${profile.class} ${subject} ${diff === 'beginner' ? 'Foundation' : diff === 'intermediate' ? 'Mastery' : 'Advanced'} (${resourceMap[profile.learningStyle]})`,
      description: `Comprehensive ${subject.toLowerCase()} course for ${goalLabel} preparation. Covers all NCERT chapters with practice problems and ${profile.learningStyle === 'video' ? 'video explanations' : 'detailed notes'}.`,
      difficulty: diff,
      estimatedWeeks: profile.pace === 'fast' ? 4 : profile.pace === 'normal' ? 6 : 8,
      resourceType: profile.learningStyle === 'video' ? 'video' : profile.learningStyle === 'text' ? 'article' : 'interactive',
      subject,
      links: [
        `https://ncert.nic.in/textbook.php?class=${profile.class}`,
        'https://www.khanacademy.org/india',
      ],
      priority: score < 40 ? 'high' : score < 70 ? 'medium' : 'low',
      progress: 0,
      status: 'not_started',
      weeklyPlan: generateWeeklyPlan(subject, diff, profile.pace === 'fast' ? 4 : 6),
    });

    if (profile.goals.includes('jee_neet') && (subject === 'Physics' || subject === 'Chemistry' || subject === 'Mathematics')) {
      recs.push({
        id: `rec-${i}-2`,
        title: `${subject} Problem Solving — ${goalLabel} Level`,
        description: `Advanced problem-solving course for ${goalLabel}. Includes previous year questions, mock tests, and topic-wise practice.`,
        difficulty: 'advanced',
        estimatedWeeks: 8,
        resourceType: 'quiz',
        subject,
        links: ['https://www.khanacademy.org/india'],
        priority: 'high',
        progress: 0,
        status: 'not_started',
        weeklyPlan: generateWeeklyPlan(subject, 'advanced', 8),
      });
    }
  });

  return recs;
}

function generateWeeklyPlan(subject: string, difficulty: string, weeks: number): string[] {
  const plan: string[] = [];
  for (let i = 1; i <= weeks; i++) {
    if (i <= Math.ceil(weeks * 0.3)) plan.push(`Week ${i}: Fundamentals & NCERT basics of ${subject}`);
    else if (i <= Math.ceil(weeks * 0.6)) plan.push(`Week ${i}: Practice problems & concept application`);
    else if (i <= Math.ceil(weeks * 0.85)) plan.push(`Week ${i}: Advanced problems & mock tests`);
    else plan.push(`Week ${i}: Revision & final assessment`);
  }
  return plan;
}

export function generateLearningPath(recommendations: CourseRecommendation[]): LearningPathStep[] {
  const steps: LearningPathStep[] = [];
  let week = 1;

  const sorted = [...recommendations].sort((a, b) => {
    const pMap = { high: 0, medium: 1, low: 2 };
    return pMap[a.priority] - pMap[b.priority];
  });

  sorted.forEach((rec, i) => {
    steps.push({
      id: `step-${i}`,
      title: rec.title,
      description: `${rec.estimatedWeeks} weeks • ${rec.difficulty} level`,
      status: rec.progress >= 100 ? 'completed' : i === 0 ? 'current' : 'upcoming',
      weekNumber: week,
    });
    week += rec.estimatedWeeks;
  });

  return steps;
}

export function adjustRecommendations(
  current: CourseRecommendation[],
  courseId: string,
  feedback: { difficulty: string; pace: string }
): CourseRecommendation[] {
  return current.map(rec => {
    if (rec.id !== courseId) return rec;

    let newDiff = rec.difficulty;
    let newWeeks = rec.estimatedWeeks;

    if (feedback.difficulty === 'too_easy') {
      newDiff = rec.difficulty === 'beginner' ? 'intermediate' : 'advanced';
      newWeeks = Math.max(2, rec.estimatedWeeks - 2);
    } else if (feedback.difficulty === 'too_hard') {
      newDiff = rec.difficulty === 'advanced' ? 'intermediate' : 'beginner';
      newWeeks = rec.estimatedWeeks + 2;
    }

    if (feedback.pace === 'too_slow') {
      newWeeks = Math.max(2, newWeeks - 2);
    } else if (feedback.pace === 'too_fast') {
      newWeeks = newWeeks + 2;
    }

    return {
      ...rec,
      difficulty: newDiff,
      estimatedWeeks: newWeeks,
      title: rec.title.replace(/Foundation|Mastery|Advanced/, newDiff === 'beginner' ? 'Foundation' : newDiff === 'intermediate' ? 'Mastery' : 'Advanced'),
      weeklyPlan: generateWeeklyPlan(rec.subject, newDiff, newWeeks),
    };
  });
}
