export type Board = 'CBSE' | 'ICSE' | 'State';
export type GoalType = 'board_exam' | 'jee_neet' | 'skill_building' | 'olympiad';
export type LearningStyle = 'video' | 'text' | 'interactive';
export type Pace = 'slow' | 'normal' | 'fast';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ResourceType = 'video' | 'article' | 'quiz' | 'interactive' | 'course';

export interface StudentProfile {
  id: string;
  name: string;
  class: number;
  board: Board;
  schoolName: string;
  subjects: string[];
  goals: GoalType[];
  learningStyle: LearningStyle;
  pace: Pace;
  hoursPerWeek: number;
  quizScore?: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
}

export interface CourseRecommendation {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedWeeks: number;
  resourceType: ResourceType;
  subject: string;
  links: string[];
  priority: 'high' | 'medium' | 'low';
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  weeklyPlan?: string[];
}

export interface FeedbackEntry {
  id: string;
  studentId: string;
  courseId: string;
  rating: 'too_easy' | 'just_right' | 'too_hard';
  paceRating: 'too_slow' | 'just_right' | 'too_fast';
  relevance: boolean;
  freeText: string;
  timestamp: string;
}

export interface SessionLog {
  id: string;
  studentId: string;
  studentName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface LearningPathStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  weekNumber: number;
}
