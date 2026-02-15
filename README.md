# ScholarStack 🚀
**A Gamified Productivity Dashboard for High-Performance Students**

ScholarStack is a full-stack task management application built with **React**, **Vite**, and **Supabase**. Unlike a standard to-do list, it uses a **Weighted XP (Experience Points) System** to help students prioritize high-impact tasks and visualize their academic progress in real-time. 

Master your focus, one stack at a time.

---

## 📱 Use it as an App
You can install ScholarStack directly on your device for daily use:
1. Visit: [scholar-stack-pi.vercel.app](https://scholar-stack-pi.vercel.app)
2. Click **'Add to Home Screen'** on your iPhone/Android or the **Install** icon on Chrome's address bar.
3. **ScholarStack** gets its own icon on your home screen and provides a native, full-screen experience.

---

## ✨ Key Features
* **Gamified Task Management:** Earn XP based on task priority (High: 50XP, Medium: 30XP, Low: 10XP).
* **Secure Authentication:** Passwordless "Magic Link" login powered by **Supabase Auth** for frictionless onboarding.
* **Persistent Cloud Storage:** Tasks and XP are synced to a **PostgreSQL database**, allowing users to access their stack from any device.
* **Human-Readable Deadlines:** Smart badges (e.g., "In 3 hours", "Overdue") calculate urgency in real-time using `date-fns`.
* **Dynamic Analytics:** Real-time progress tracking and XP accumulation dashboard.

---

## 🚀 Technical Breakdown
1. **Real-time Persistence:** Replaced `localStorage` with **Supabase** for robust data management. Uses `onAuthStateChange` listeners to manage user sessions persistently.
2. **Security & RLS:** Implemented **Row Level Security (RLS)** policies to ensure that users can only access and modify their own tasks.
3. **Complex State Management:** Utilizes React `useEffect` and `useState` hooks to sync UI state with asynchronous database calls.
4. **Urgency Logic:** Custom logic to transform static timestamps into dynamic, human-readable countdowns to drive user focus.

---

## 🛠️ Tech Stack
* **Frontend:** React.js (Hooks, State Management)
* **Backend-as-a-Service:** Supabase (Auth, PostgreSQL)
* **Styling:** Tailwind CSS (Responsive Design, Transitions)
* **Date Logic:** date-fns
* **Notifications:** React-Hot-Toast
* **Deployment:** Vercel