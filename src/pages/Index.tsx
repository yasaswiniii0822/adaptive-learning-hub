import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Target, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: '12,500+', label: t('hero.stats.students') },
    { icon: BookOpen, value: '450+', label: t('hero.stats.courses') },
    { icon: Target, value: '94%', label: t('hero.stats.accuracy') },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Assessment',
      description: 'Intelligent quizzes that adapt to your level and identify knowledge gaps instantly.',
    },
    {
      icon: Target,
      title: 'Personalized Learning Paths',
      description: 'Custom study plans aligned with NCERT, Board Exams, JEE & NEET syllabi.',
    },
    {
      icon: BookOpen,
      title: 'Smart Recommendations',
      description: 'Curated resources — videos, notes, and quizzes — matched to your learning style.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/8 blur-3xl" />
        </div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              AI-Powered Learning for Indian Students
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {t('hero.subtitle')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/onboarding')} className="gap-2 text-base">
                {t('hero.cta')}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/admin')} className="text-base">
                {t('nav.admin')}
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-8"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <div className="font-heading text-3xl font-bold">{value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-card py-20">
        <div className="container">
          <h2 className="text-center font-heading text-3xl font-bold">How VidyaPath Works</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Three simple steps to a personalized learning experience tailored to your needs.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="rounded-xl border bg-background p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
