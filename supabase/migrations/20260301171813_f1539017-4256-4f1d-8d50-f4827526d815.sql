
-- Add user_id to student_profiles
ALTER TABLE public.student_profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive public policies
DROP POLICY IF EXISTS "Allow public access to student_profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Allow public access to recommendations" ON public.recommendations;
DROP POLICY IF EXISTS "Allow public access to feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow public access to session_logs" ON public.session_logs;

-- student_profiles: users can CRUD their own
CREATE POLICY "Users can view own profile" ON public.student_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.student_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.student_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- recommendations: access via profile ownership
CREATE POLICY "Users can view own recommendations" ON public.recommendations FOR SELECT TO authenticated USING (profile_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own recommendations" ON public.recommendations FOR INSERT TO authenticated WITH CHECK (profile_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own recommendations" ON public.recommendations FOR UPDATE TO authenticated USING (profile_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own recommendations" ON public.recommendations FOR DELETE TO authenticated USING (profile_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- feedback: access via profile ownership
CREATE POLICY "Users can view own feedback" ON public.feedback FOR SELECT TO authenticated USING (profile_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own feedback" ON public.feedback FOR INSERT TO authenticated WITH CHECK (profile_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- session_logs
CREATE POLICY "Users can view own logs" ON public.session_logs FOR SELECT TO authenticated USING (profile_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own logs" ON public.session_logs FOR INSERT TO authenticated WITH CHECK (profile_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- Admin role setup
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view all logs" ON public.session_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
