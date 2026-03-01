import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { StudentProfile, Board, GoalType, LearningStyle, Pace, QuizQuestion } from '@/types/student';
import { generateQuizQuestions } from '@/lib/mockAI';
import { store } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Science', 'Computer Science'];
const GOALS: { value: GoalType; label: string }[] = [
  { value: 'board_exam', label: 'Board Exam Prep' },
  { value: 'jee_neet', label: 'JEE / NEET' },
  { value: 'skill_building', label: 'Skill Building' },
  { value: 'olympiad', label: 'Olympiad' },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const totalSteps = 4;

  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState<number>(9);
  const [board, setBoard] = useState<Board>('CBSE');
  const [school, setSchool] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [style, setStyle] = useState<LearningStyle>('video');
  const [pace, setPace] = useState<Pace>('normal');
  const [hours, setHours] = useState(5);

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const toggleSubject = (s: string) => {
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };
  const toggleGoal = (g: GoalType) => {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const handleNext = () => {
    if (step === 1 && subjects.length > 0) {
      setQuizQuestions(generateQuizQuestions(subjects));
    }
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleFinish = async () => {
    const correctCount = quizQuestions.reduce((acc, q) => {
      return acc + (quizAnswers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);
    const score = quizQuestions.length > 0 ? Math.round((correctCount / quizQuestions.length) * 100) : 50;

    const profile: StudentProfile = {
      id: crypto.randomUUID(),
      name,
      class: studentClass,
      board,
      schoolName: school,
      subjects,
      goals,
      learningStyle: style,
      pace,
      hoursPerWeek: hours,
      quizScore: score,
      createdAt: new Date().toISOString(),
    };

    await store.setProfile(profile);
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('recommend', {
        body: { profile },
      });

      if (error) throw error;

      if (data?.recommendations && Array.isArray(data.recommendations)) {
        await store.setRecommendations(data.recommendations);
        toast({ title: 'AI Recommendations Ready', description: `Generated ${data.recommendations.length} personalized courses for you!` });
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (err: any) {
      console.error('AI recommendation error:', err);
      toast({
        title: 'Using fallback recommendations',
        description: 'AI was unavailable, but we still generated a learning path for you.',
        variant: 'destructive',
      });
      const { generateRecommendations } = await import('@/lib/mockAI');
      const recs = generateRecommendations(profile);
      await store.setRecommendations(recs);
    } finally {
      setIsGenerating(false);
    }

    await store.addSessionLog({
      id: crypto.randomUUID(),
      studentId: profile.id,
      studentName: profile.name,
      action: 'onboarding_complete',
      details: `Class ${profile.class}, ${profile.board}, Quiz Score: ${score}%`,
      timestamp: new Date().toISOString(),
    });

    navigate('/dashboard');
  };

  const steps = ['Your Profile', 'Subjects & Goals', 'Quick Assessment', 'Preferences'];

  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((label, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm font-medium ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i < step ? 'bg-primary text-primary-foreground' : i === step ? 'border-2 border-primary text-primary' : 'border text-muted-foreground'}`}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className="hidden sm:inline">{label}</span>
              </div>
            ))}
          </div>
          <Progress value={((step + 1) / totalSteps) * 100} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">{steps[step]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {step === 0 && (
                  <>
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Class</Label>
                        <Select value={String(studentClass)} onValueChange={v => setStudentClass(Number(v))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[6,7,8,9,10,11,12].map(c => (
                              <SelectItem key={c} value={String(c)}>Class {c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Board</Label>
                        <Select value={board} onValueChange={v => setBoard(v as Board)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CBSE">CBSE</SelectItem>
                            <SelectItem value="ICSE">ICSE</SelectItem>
                            <SelectItem value="State">State Board</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>School Name</Label>
                      <Input value={school} onChange={e => setSchool(e.target.value)} placeholder="Your school name" />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label>Select Subjects</Label>
                      <div className="flex flex-wrap gap-2">
                        {SUBJECTS.map(s => (
                          <Badge
                            key={s}
                            variant={subjects.includes(s) ? 'default' : 'outline'}
                            className="cursor-pointer px-3 py-1.5 text-sm"
                            onClick={() => toggleSubject(s)}
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Learning Goals</Label>
                      <div className="flex flex-wrap gap-2">
                        {GOALS.map(g => (
                          <Badge
                            key={g.value}
                            variant={goals.includes(g.value) ? 'default' : 'outline'}
                            className="cursor-pointer px-3 py-1.5 text-sm"
                            onClick={() => toggleGoal(g.value)}
                          >
                            {g.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    {quizQuestions.length === 0 ? (
                      <p className="text-muted-foreground">Please select subjects in the previous step to generate quiz questions.</p>
                    ) : (
                      quizQuestions.map((q, i) => (
                        <div key={q.id} className="space-y-3">
                          <p className="font-medium">{i + 1}. {q.question}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => (
                              <Button
                                key={oi}
                                variant={quizAnswers[q.id] === oi ? 'default' : 'outline'}
                                size="sm"
                                className="justify-start"
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oi }))}
                              >
                                {opt}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-2">
                      <Label>Preferred Learning Style</Label>
                      <div className="flex gap-2">
                        {(['video', 'text', 'interactive'] as LearningStyle[]).map(s => (
                          <Badge
                            key={s}
                            variant={style === s ? 'default' : 'outline'}
                            className="cursor-pointer px-4 py-2 capitalize"
                            onClick={() => setStyle(s)}
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Learning Pace</Label>
                      <div className="flex gap-2">
                        {(['slow', 'normal', 'fast'] as Pace[]).map(p => (
                          <Badge
                            key={p}
                            variant={pace === p ? 'default' : 'outline'}
                            className="cursor-pointer px-4 py-2 capitalize"
                            onClick={() => setPace(p)}
                          >
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Hours per Week: {hours}h / week</Label>
                      <input
                        type="range"
                        min={1}
                        max={20}
                        value={hours}
                        onChange={e => setHours(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  {step < totalSteps - 1 ? (
                    <Button onClick={handleNext}>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleFinish} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating AI Plan...
                        </>
                      ) : (
                        <>
                          Start Learning
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
