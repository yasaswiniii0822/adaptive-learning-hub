import { supabase } from '@/integrations/supabase/client';
import { StudentProfile, CourseRecommendation, FeedbackEntry, SessionLog } from '@/types/student';

// Helper to convert DB row to StudentProfile
function rowToProfile(row: any): StudentProfile {
  return {
    id: row.id,
    name: row.name,
    class: row.class,
    board: row.board,
    schoolName: row.school_name,
    subjects: row.subjects || [],
    goals: row.goals || [],
    learningStyle: row.learning_style,
    pace: row.pace,
    hoursPerWeek: row.hours_per_week,
    quizScore: row.quiz_score,
    createdAt: row.created_at,
  };
}

function rowToRecommendation(row: any): CourseRecommendation {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    estimatedWeeks: row.estimated_weeks,
    resourceType: row.resource_type,
    subject: row.subject,
    links: row.links || [],
    priority: row.priority,
    progress: row.progress,
    status: row.status,
    weeklyPlan: row.weekly_plan || [],
  };
}

function rowToSessionLog(row: any): SessionLog {
  return {
    id: row.id,
    studentId: row.profile_id,
    studentName: row.student_name,
    action: row.action,
    details: row.details,
    timestamp: row.created_at,
  };
}

function rowToFeedback(row: any): FeedbackEntry {
  return {
    id: row.id,
    studentId: row.profile_id,
    courseId: row.course_id,
    rating: row.rating,
    paceRating: row.pace_rating,
    relevance: row.relevance,
    freeText: row.free_text,
    timestamp: row.created_at,
  };
}

async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export const store = {
  getProfile: async (): Promise<StudentProfile | null> => {
    const userId = await getCurrentUserId();
    if (!userId) return null;
    const { data } = await supabase.from('student_profiles').select('*').eq('user_id', userId).single();
    return data ? rowToProfile(data) : null;
  },

  setProfile: async (profile: StudentProfile): Promise<void> => {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await supabase.from('student_profiles').upsert({
      id: profile.id,
      user_id: userId,
      name: profile.name,
      class: profile.class,
      board: profile.board,
      school_name: profile.schoolName,
      subjects: profile.subjects,
      goals: profile.goals,
      learning_style: profile.learningStyle,
      pace: profile.pace,
      hours_per_week: profile.hoursPerWeek,
      quiz_score: profile.quizScore,
    });
  },

  getRecommendations: async (profileId?: string): Promise<CourseRecommendation[]> => {
    let id = profileId;
    if (!id) {
      const profile = await store.getProfile();
      id = profile?.id;
    }
    if (!id) return [];
    const { data } = await supabase.from('recommendations').select('*').eq('profile_id', id);
    return (data || []).map(rowToRecommendation);
  },

  setRecommendations: async (recs: CourseRecommendation[], profileId?: string): Promise<void> => {
    let id = profileId;
    if (!id) {
      const profile = await store.getProfile();
      id = profile?.id;
    }
    if (!id) return;
    await supabase.from('recommendations').delete().eq('profile_id', id);
    if (recs.length === 0) return;
    await supabase.from('recommendations').insert(
      recs.map(r => ({
        id: r.id,
        profile_id: id!,
        title: r.title,
        description: r.description,
        difficulty: r.difficulty,
        estimated_weeks: r.estimatedWeeks,
        resource_type: r.resourceType,
        subject: r.subject,
        links: r.links,
        priority: r.priority,
        progress: r.progress,
        status: r.status,
        weekly_plan: r.weeklyPlan || [],
      }))
    );
  },

  updateRecommendation: async (rec: CourseRecommendation): Promise<void> => {
    await supabase.from('recommendations').update({
      progress: rec.progress,
      status: rec.status,
      difficulty: rec.difficulty,
      estimated_weeks: rec.estimatedWeeks,
    }).eq('id', rec.id);
  },

  getFeedback: async (profileId?: string): Promise<FeedbackEntry[]> => {
    let id = profileId;
    if (!id) {
      const profile = await store.getProfile();
      id = profile?.id;
    }
    if (!id) return [];
    const { data } = await supabase.from('feedback').select('*').eq('profile_id', id);
    return (data || []).map(rowToFeedback);
  },

  addFeedback: async (entry: FeedbackEntry): Promise<void> => {
    await supabase.from('feedback').insert({
      id: entry.id,
      profile_id: entry.studentId,
      course_id: entry.courseId,
      rating: entry.rating,
      pace_rating: entry.paceRating,
      relevance: entry.relevance,
      free_text: entry.freeText,
    });
  },

  getSessionLogs: async (): Promise<SessionLog[]> => {
    const { data } = await supabase.from('session_logs').select('*').order('created_at', { ascending: false });
    return (data || []).map(rowToSessionLog);
  },

  addSessionLog: async (log: SessionLog): Promise<void> => {
    await supabase.from('session_logs').insert({
      id: log.id,
      profile_id: log.studentId,
      student_name: log.studentName,
      action: log.action,
      details: log.details,
    });
  },
};
