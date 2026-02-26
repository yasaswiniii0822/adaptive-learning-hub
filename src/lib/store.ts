import { StudentProfile, CourseRecommendation, FeedbackEntry, SessionLog } from '@/types/student';

const KEYS = {
  profile: 'vidyapath_profile',
  recommendations: 'vidyapath_recommendations',
  feedback: 'vidyapath_feedback',
  sessions: 'vidyapath_sessions',
};

export const store = {
  getProfile: (): StudentProfile | null => {
    const data = localStorage.getItem(KEYS.profile);
    return data ? JSON.parse(data) : null;
  },
  setProfile: (profile: StudentProfile) => {
    localStorage.setItem(KEYS.profile, JSON.stringify(profile));
  },
  getRecommendations: (): CourseRecommendation[] => {
    const data = localStorage.getItem(KEYS.recommendations);
    return data ? JSON.parse(data) : [];
  },
  setRecommendations: (recs: CourseRecommendation[]) => {
    localStorage.setItem(KEYS.recommendations, JSON.stringify(recs));
  },
  getFeedback: (): FeedbackEntry[] => {
    const data = localStorage.getItem(KEYS.feedback);
    return data ? JSON.parse(data) : [];
  },
  addFeedback: (entry: FeedbackEntry) => {
    const existing = store.getFeedback();
    existing.push(entry);
    localStorage.setItem(KEYS.feedback, JSON.stringify(existing));
  },
  getSessionLogs: (): SessionLog[] => {
    const data = localStorage.getItem(KEYS.sessions);
    return data ? JSON.parse(data) : [];
  },
  addSessionLog: (log: SessionLog) => {
    const existing = store.getSessionLogs();
    existing.push(log);
    localStorage.setItem(KEYS.sessions, JSON.stringify(existing));
  },
  clearAll: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
