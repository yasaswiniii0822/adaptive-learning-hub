

# AI-Powered Personalized Learning Platform

## Overview
An AI-driven web platform for Indian education (NCERT, JEE, Board exams) that analyzes student profiles, recommends courses, handles feedback, and tracks learning paths — all powered by real AI via Lovable AI Gateway.

---

## Pages & Navigation

### 1. **Landing Page**
- Hero section explaining the platform
- Language selector (English / Hindi)
- "Get Started" CTA → Student Onboarding
- Quick stats (students helped, courses available, etc.)

### 2. **Student Onboarding (Multi-Step Form)**
- **Step 1 – Profile**: Name, class (6-12), board (CBSE/ICSE/State), school name
- **Step 2 – Subjects & Goals**: Select subjects, goal type (Board Exam Prep, JEE/NEET, Skill Building, Olympiad)
- **Step 3 – Self-Assessment Quiz**: AI-generated quick quiz (5-10 questions) based on selected subjects to gauge current level
- **Step 4 – Preferences**: Learning style (Video/Text/Interactive), pace (Slow/Normal/Fast), available hours per week

### 3. **Dashboard (Main Student View)**
- Personalized greeting with student name and class
- **AI-Generated Recommendations**: Course cards with title, description, difficulty, estimated time, resource type, and direct links
- **Learning Path Timeline**: Visual multi-step journey showing current position and upcoming modules
- **Progress Tracker**: Percentage completion per subject/course
- **Quick Actions**: Take assessment, get new recommendations, give feedback

### 4. **Recommendation Detail Page**
- Full course/resource details with AI-generated study plan
- Week-by-week breakdown
- Related quizzes and practice resources
- "Mark as Started" / "Mark as Complete" buttons
- Enrollment readiness check (as per Test Case 3)

### 5. **Feedback & Adjustment Page**
- Rate current recommendations (too easy/hard, too slow/fast, not relevant)
- Free-text feedback input
- AI processes feedback and generates updated recommendations (as per Test Case 2)
- Shows before/after comparison of adjusted recommendations

### 6. **Admin Dashboard**
- **Session Analytics**: Total students, assessments completed, courses recommended
- **Charts**: Distribution by class, subject popularity, goal types, feedback sentiment
- **Session Logs Table**: Timestamped entries of all student interactions and AI recommendations
- **Student Profiles Overview**: List of all student profiles with their current learning paths

---

## AI Integration (Lovable AI Gateway)

A Lovable Cloud edge function will handle:
- **Intent Detection**: Analyzing student goals from form inputs
- **Need Assessment**: Generating assessment questions based on profile
- **Recommendation Engine**: Mapping profiles to curated Indian education resources (NCERT, Khan Academy India, Unacademy-style content)
- **Feedback Processing**: Adjusting recommendations based on student feedback
- **Multilingual Output**: Generating responses in English or Hindi based on preference

---

## Multilingual Support
- Language toggle (English / Hindi) available globally
- All UI labels and navigation translated
- AI responses generated in the selected language

---

## Data & State Management
- All student data stored in localStorage for persistence across sessions
- Session logs maintained in-memory and localStorage
- No authentication required — demo/prototype mode
- Sample/seed data for the admin dashboard

---

## Key UI Components
- Multi-step form wizard with progress indicator
- Course recommendation cards with difficulty badges and time estimates
- Visual learning path timeline
- Progress bars and completion indicators
- Charts (recharts) for admin analytics
- Responsive design for mobile and desktop

