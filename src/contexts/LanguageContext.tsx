import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '@/types/student';

type TranslationKey = string;
type Translations = Record<Language, Record<TranslationKey, string>>;

const translations: Translations = {
  en: {
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    'nav.feedback': 'Feedback',
    'hero.title': 'Your Personal AI Learning Companion',
    'hero.subtitle': 'Powered by AI to create a learning path tailored just for you — aligned with NCERT, Board Exams, JEE & NEET.',
    'hero.cta': 'Get Started Free',
    'hero.stats.students': 'Students Helped',
    'hero.stats.courses': 'Courses Available',
    'hero.stats.accuracy': 'Recommendation Accuracy',
    'onboarding.step1': 'Your Profile',
    'onboarding.step2': 'Subjects & Goals',
    'onboarding.step3': 'Quick Assessment',
    'onboarding.step4': 'Preferences',
    'onboarding.next': 'Continue',
    'onboarding.back': 'Back',
    'onboarding.finish': 'Start Learning',
    'onboarding.name': 'Full Name',
    'onboarding.class': 'Class',
    'onboarding.board': 'Board',
    'onboarding.school': 'School Name',
    'onboarding.subjects': 'Select Subjects',
    'onboarding.goals': 'Learning Goals',
    'onboarding.style': 'Preferred Learning Style',
    'onboarding.pace': 'Learning Pace',
    'onboarding.hours': 'Hours per Week',
    'dashboard.welcome': 'Welcome back',
    'dashboard.recommendations': 'AI Recommendations',
    'dashboard.learningPath': 'Your Learning Path',
    'dashboard.progress': 'Progress Tracker',
    'dashboard.quickActions': 'Quick Actions',
    'feedback.title': 'Share Your Feedback',
    'feedback.difficulty': 'Difficulty Level',
    'feedback.pace': 'Pace',
    'feedback.relevance': 'Is the content relevant?',
    'feedback.submit': 'Submit Feedback',
    'admin.title': 'Admin Dashboard',
    'admin.totalStudents': 'Total Students',
    'admin.assessments': 'Assessments Completed',
    'admin.coursesRecommended': 'Courses Recommended',
    'admin.sessionLogs': 'Session Logs',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.loading': 'Loading...',
  },
  hi: {
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.admin': 'एडमिन',
    'nav.feedback': 'फीडबैक',
    'hero.title': 'आपका व्यक्तिगत AI लर्निंग साथी',
    'hero.subtitle': 'AI द्वारा संचालित — NCERT, बोर्ड परीक्षा, JEE और NEET के अनुरूप आपके लिए एक अनुकूलित शिक्षण पथ।',
    'hero.cta': 'मुफ्त में शुरू करें',
    'hero.stats.students': 'छात्रों की मदद की',
    'hero.stats.courses': 'पाठ्यक्रम उपलब्ध',
    'hero.stats.accuracy': 'सिफारिश सटीकता',
    'onboarding.step1': 'आपकी प्रोफ़ाइल',
    'onboarding.step2': 'विषय और लक्ष्य',
    'onboarding.step3': 'त्वरित मूल्यांकन',
    'onboarding.step4': 'प्राथमिकताएं',
    'onboarding.next': 'जारी रखें',
    'onboarding.back': 'पीछे',
    'onboarding.finish': 'सीखना शुरू करें',
    'onboarding.name': 'पूरा नाम',
    'onboarding.class': 'कक्षा',
    'onboarding.board': 'बोर्ड',
    'onboarding.school': 'विद्यालय का नाम',
    'onboarding.subjects': 'विषय चुनें',
    'onboarding.goals': 'शिक्षण लक्ष्य',
    'onboarding.style': 'पसंदीदा शिक्षण शैली',
    'onboarding.pace': 'शिक्षण गति',
    'onboarding.hours': 'प्रति सप्ताह घंटे',
    'dashboard.welcome': 'वापसी पर स्वागत है',
    'dashboard.recommendations': 'AI सिफारिशें',
    'dashboard.learningPath': 'आपका शिक्षण पथ',
    'dashboard.progress': 'प्रगति ट्रैकर',
    'dashboard.quickActions': 'त्वरित कार्य',
    'feedback.title': 'अपनी प्रतिक्रिया साझा करें',
    'feedback.difficulty': 'कठिनाई स्तर',
    'feedback.pace': 'गति',
    'feedback.relevance': 'क्या सामग्री प्रासंगिक है?',
    'feedback.submit': 'प्रतिक्रिया जमा करें',
    'admin.title': 'एडमिन डैशबोर्ड',
    'admin.totalStudents': 'कुल छात्र',
    'admin.assessments': 'मूल्यांकन पूर्ण',
    'admin.coursesRecommended': 'सिफारिश किए गए पाठ्यक्रम',
    'admin.sessionLogs': 'सत्र लॉग',
    'common.yes': 'हाँ',
    'common.no': 'नहीं',
    'common.loading': 'लोड हो रहा है...',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
