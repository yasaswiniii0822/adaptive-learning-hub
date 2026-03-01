import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { CourseRecommendation, FeedbackEntry } from '@/types/student';
import { store } from '@/lib/store';
import { adjustRecommendations } from '@/lib/mockAI';
import { toast } from '@/hooks/use-toast';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('just_right');
  const [paceRating, setPaceRating] = useState<string>('just_right');
  const [relevant, setRelevant] = useState(true);
  const [freeText, setFreeText] = useState('');
  const [adjusted, setAdjusted] = useState<CourseRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const profile = await store.getProfile();
      if (!profile) { navigate('/onboarding'); return; }
      const recs = await store.getRecommendations();
      setRecommendations(recs);
      setLoading(false);
    };
    load();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!selectedCourse) return;
    const profile = (await store.getProfile())!;

    const entry: FeedbackEntry = {
      id: crypto.randomUUID(),
      studentId: profile.id,
      courseId: selectedCourse,
      rating: difficulty as any,
      paceRating: paceRating as any,
      relevance: relevant,
      freeText,
      timestamp: new Date().toISOString(),
    };
    await store.addFeedback(entry);

    const updated = adjustRecommendations(recommendations, selectedCourse, {
      difficulty, pace: paceRating,
    });
    // Update each adjusted recommendation in DB
    const changedRec = updated.find(r => r.id === selectedCourse);
    if (changedRec) await store.updateRecommendation(changedRec);
    setRecommendations(updated);
    setAdjusted(changedRec || null);

    await store.addSessionLog({
      id: crypto.randomUUID(),
      studentId: profile.id,
      studentName: profile.name,
      action: 'feedback_submitted',
      details: `Course: ${selectedCourse}, Difficulty: ${difficulty}, Pace: ${paceRating}`,
      timestamp: new Date().toISOString(),
    });

    toast({ title: 'Feedback Received', description: 'Your recommendations have been adjusted!' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-2xl">
        <h1 className="font-heading text-3xl font-bold mb-8">Share Your Feedback</h1>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Select a course to review</Label>
              <div className="flex flex-wrap gap-2">
                {recommendations.map(r => (
                  <Badge
                    key={r.id}
                    variant={selectedCourse === r.id ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => { setSelectedCourse(r.id); setAdjusted(null); }}
                  >
                    {r.title.slice(0, 40)}...
                  </Badge>
                ))}
              </div>
            </div>

            {selectedCourse && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <div className="flex gap-2">
                    {['too_easy', 'just_right', 'too_hard'].map(d => (
                      <Badge
                        key={d}
                        variant={difficulty === d ? 'default' : 'outline'}
                        className="cursor-pointer px-3 py-1.5 capitalize"
                        onClick={() => setDifficulty(d)}
                      >
                        {d.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pace</Label>
                  <div className="flex gap-2">
                    {['too_slow', 'just_right', 'too_fast'].map(p => (
                      <Badge
                        key={p}
                        variant={paceRating === p ? 'default' : 'outline'}
                        className="cursor-pointer px-3 py-1.5 capitalize"
                        onClick={() => setPaceRating(p)}
                      >
                        {p.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Is the content relevant?</Label>
                  <div className="flex gap-2">
                    <Badge variant={relevant ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setRelevant(true)}>Yes</Badge>
                    <Badge variant={!relevant ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setRelevant(false)}>No</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional comments</Label>
                  <Textarea value={freeText} onChange={e => setFreeText(e.target.value)} placeholder="Tell us more..." />
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
              </motion.div>
            )}

            {adjusted && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border bg-muted/50 p-4">
                <h3 className="font-heading font-semibold mb-2">✅ Adjusted Recommendation</h3>
                <p className="font-medium">{adjusted.title}</p>
                <p className="text-sm text-muted-foreground mt-1">Difficulty: {adjusted.difficulty} • Duration: {adjusted.estimatedWeeks} weeks</p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => navigate('/dashboard')}>
                  View in Dashboard <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackPage;
