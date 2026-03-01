
-- Student profiles table
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  class INTEGER NOT NULL,
  board TEXT NOT NULL,
  school_name TEXT NOT NULL DEFAULT '',
  subjects TEXT[] NOT NULL DEFAULT '{}',
  goals TEXT[] NOT NULL DEFAULT '{}',
  learning_style TEXT NOT NULL DEFAULT 'video',
  pace TEXT NOT NULL DEFAULT 'normal',
  hours_per_week INTEGER NOT NULL DEFAULT 5,
  quiz_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course recommendations table
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  estimated_weeks INTEGER NOT NULL DEFAULT 4,
  resource_type TEXT NOT NULL DEFAULT 'video',
  subject TEXT NOT NULL DEFAULT '',
  links TEXT[] NOT NULL DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'medium',
  progress INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'not_started',
  weekly_plan TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Feedback entries table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.recommendations(id) ON DELETE CASCADE,
  rating TEXT NOT NULL DEFAULT 'just_right',
  pace_rating TEXT NOT NULL DEFAULT 'just_right',
  relevance BOOLEAN NOT NULL DEFAULT true,
  free_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Session logs table
CREATE TABLE public.session_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Since there's no auth yet, allow public read/write access
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to student_profiles" ON public.student_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to recommendations" ON public.recommendations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to feedback" ON public.feedback FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to session_logs" ON public.session_logs FOR ALL USING (true) WITH CHECK (true);
