import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, Play, CheckCircle2, Circle, MessageSquare, RefreshCw, Target } from 'lucide-react';
import { StudentProfile, CourseRecommendation, LearningPathStep } from '@/types/student';
import { store } from '@/lib/store';
import { generateLearningPath } from '@/lib/mockAI';

const difficultyColor: Record<string, string> = {
  beginner: 'bg-success/10 text-success',
  intermediate: 'bg-warning/10 text-warning',
  advanced: 'bg-destructive/10 text-destructive',
};

const priorityColor: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-warning/10 text-warning',
  low: 'bg-success/10 text-success',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPathStep[]>([]);

  useEffect(() => {
    const p = store.getProfile();
    if (!p) { navigate('/onboarding'); return; }
    setProfile(p);
    const recs = store.getRecommendations();
    setRecommendations(recs);
    setLearningPath(generateLearningPath(recs));
  }, [navigate]);

  const handleStart = (id: string) => {
    const updated = recommendations.map(r =>
      r.id === id ? { ...r, status: 'in_progress' as const, progress: 10 } : r
    );
    setRecommendations(updated);
    store.setRecommendations(updated);
    store.addSessionLog({
      id: crypto.randomUUID(),
      studentId: profile!.id,
      studentName: profile!.name,
      action: 'course_started',
      details: recommendations.find(r => r.id === id)?.title || '',
      timestamp: new Date().toISOString(),
    });
  };

  const handleComplete = (id: string) => {
    const updated = recommendations.map(r =>
      r.id === id ? { ...r, status: 'completed' as const, progress: 100 } : r
    );
    setRecommendations(updated);
    store.setRecommendations(updated);
    setLearningPath(generateLearningPath(updated));
  };

  if (!profile) return null;

  const avgProgress = recommendations.length > 0
    ? Math.round(recommendations.reduce((a, r) => a + r.progress, 0) / recommendations.length)
    : 0;

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading text-3xl font-bold">
            Welcome back, {profile.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Class {profile.class} • {profile.board} • Quiz Score: {profile.quizScore}%
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/onboarding')}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retake Assessment
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/feedback')}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Give Feedback
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-heading text-xl font-semibold">AI Recommendations</h2>
            {recommendations.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={difficultyColor[rec.difficulty]} variant="secondary">{rec.difficulty}</Badge>
                          <Badge className={priorityColor[rec.priority]} variant="secondary">{rec.priority} priority</Badge>
                          <Badge variant="outline">{rec.resourceType}</Badge>
                        </div>
                        <h3 className="font-heading font-semibold">{rec.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{rec.estimatedWeeks} weeks</span>
                          <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{rec.subject}</span>
                        </div>
                        {rec.status !== 'not_started' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>{rec.progress}% complete</span>
                            </div>
                            <Progress value={rec.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {rec.status === 'not_started' && (
                          <Button size="sm" onClick={() => handleStart(rec.id)}>
                            <Play className="mr-1 h-3 w-3" /> Start
                          </Button>
                        )}
                        {rec.status === 'in_progress' && (
                          <Button size="sm" variant="outline" onClick={() => handleComplete(rec.id)}>
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Complete
                          </Button>
                        )}
                        {rec.status === 'completed' && (
                          <Badge className="bg-success/10 text-success">Done ✓</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-heading">Progress Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="font-heading text-4xl font-bold text-primary">{avgProgress}%</div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                </div>
                <div className="space-y-3">
                  {profile.subjects.map(sub => {
                    const subRecs = recommendations.filter(r => r.subject === sub);
                    const subProgress = subRecs.length > 0 ? Math.round(subRecs.reduce((a, r) => a + r.progress, 0) / subRecs.length) : 0;
                    return (
                      <div key={sub}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{sub}</span>
                          <span className="text-muted-foreground">{subProgress}%</span>
                        </div>
                        <Progress value={subProgress} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-heading">Your Learning Path</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningPath.slice(0, 5).map((step, i) => (
                    <div key={step.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : step.status === 'current' ? (
                          <Target className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        {i < learningPath.length - 1 && (
                          <div className={`w-px flex-1 mt-1 ${step.status === 'completed' ? 'bg-success' : 'bg-border'}`} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm font-medium ${step.status === 'current' ? 'text-primary' : ''}`}>{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
