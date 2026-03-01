import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Users, BookOpen, ClipboardCheck, MessageSquare, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SessionLog } from '@/types/student';
import { store } from '@/lib/store';

const COLORS = ['hsl(250,65%,55%)', 'hsl(165,60%,42%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)', 'hsl(200,70%,50%)'];

const AdminDashboard = () => {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await store.getSessionLogs();
      setLogs(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  const totalStudents = new Set(logs.filter(l => l.action === 'onboarding_complete').map(l => l.studentId)).size;
  const totalAssessments = logs.filter(l => l.action === 'onboarding_complete').length;
  const totalCourses = logs.filter(l => l.action === 'course_started').length;
  const totalFeedback = logs.filter(l => l.action === 'feedback_submitted').length;

  const classData = [
    { name: 'Class 9', count: logs.filter(l => l.details.includes('Class 9')).length },
    { name: 'Class 10', count: logs.filter(l => l.details.includes('Class 10')).length },
    { name: 'Class 11', count: logs.filter(l => l.details.includes('Class 11')).length },
    { name: 'Class 12', count: logs.filter(l => l.details.includes('Class 12')).length },
  ];

  const actionData = [
    { name: 'Onboarding', value: totalAssessments },
    { name: 'Courses', value: totalCourses },
    { name: 'Feedback', value: totalFeedback },
  ];

  const stats = [
    { icon: Users, label: 'Total Students', value: totalStudents },
    { icon: ClipboardCheck, label: 'Assessments Completed', value: totalAssessments },
    { icon: BookOpen, label: 'Courses Recommended', value: totalCourses },
    { icon: MessageSquare, label: 'Feedback', value: totalFeedback },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <h1 className="font-heading text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
          {stats.map(({ icon: Icon, label, value }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-heading text-2xl font-bold">{value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Distribution by Class</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={classData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(250,65%,55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Activity Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={actionData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {actionData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Session Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.studentName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {log.action.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{log.details}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
