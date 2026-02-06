# ScholarStack 🚀
**A Gamified Productivity Dashboard for High-Performance Students**

ScholarStack is a modern task management application built with **React** and **Vite**. Unlike a standard to-do list, it uses a **Weighted XP (Experience Points) System** to help students prioritize high-impact tasks and visualize their academic progress in real-time. 

Master your focus, one stack at a time.

---

## 📱 Use it as an App
You can install ScholarStack directly on your device for daily use:
1. Visit: [scholar-stack-pi.vercel.app](https://scholar-stack-pi.vercel.app)
2. Click **'Add to Home Screen'** on your iPhone/Android or the **Install** icon on Chrome's address bar.
3. **ScholarStack** gets its own icon on your home screen, opens in full screen (no browser bars), and provides a native app experience.

---

## ✨ Key Features
* **Gamified Task Management:** Earn XP based on task priority (High: 50XP, Medium: 30XP, Low: 10XP).
* **Dynamic Analytics:** A real-time progress bar and dashboard that visualizes "Stack Completion" percentages.
* **Smart Prioritization:** Categorize tasks to focus on what matters most.
* **Persistent Storage:** Uses `localStorage` to ensure your tasks and XP stay saved even after a refresh.
* **Responsive UI:** Clean, mobile-friendly design built with **Tailwind CSS**.

---

## 🚀 Technical Breakdown
1. **Weighted Logic:** The app utilizes the JavaScript `.reduce()` method to calculate total XP by iterating through the task array and assigning values based on priority strings.
2. **Persistence Layer:** `useEffect` hooks sync the application state with the browser's `localStorage`, ensuring zero data loss across sessions.
3. **UI/UX:** Utilizes conditional rendering for seamless navigation between the Landing Page, Dashboard, and Task Manager without page reloads.

---

## 🛠️ Tech Stack
* **Frontend:** React.js (Hooks, State Management)
* **Styling:** Tailwind CSS (Responsive Design, Transitions)
* **Icons:** React Icons
* **Build Tool:** Vite
<<<<<<< HEAD
* **Deployment:** Vercel
=======
* **Deployment:** Vercel
>>>>>>> 8e9519fe49fa60d52e8bfe9e85f7a84827942f27
