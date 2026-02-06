# ScholarStack 🚀
**A Gamified Productivity Dashboard for High-Performance Students**

ScholarStack is a modern task management application built with **React** and **Vite**. Unlike a standard to-do list, it uses a **Weighted XP (Experience Points) System** to help students prioritize high-impact tasks and visualize their academic progress in real-time.



## ✨ Key Features
* **Gamified Task Management:** Earn XP based on task priority (High: 50XP, Medium: 30XP, Low: 10XP).
* **Dynamic Analytics:** A real-time progress bar that visualizes "Stack Completion" percentages.
* **Smart Prioritization:** Categorize tasks to focus on what matters most.
* **Persistent Storage:** Uses `localStorage` to ensure your tasks and XP stay saved even after a refresh.
* **Responsive UI:** Clean, mobile-friendly design built with **Tailwind CSS**.

## 🛠️ Tech Stack
* **Frontend:** React.js (Hooks, State Management)
* **Styling:** Tailwind CSS (Responsive Design, Transitions)
* **Icons:** React Icons
* **Build Tool:** Vite
* **Deployment:** Vercel

## 🚀 How It Works (Technical Breakdown)
1.  **Weighted Logic:** The app utilizes the JavaScript `.reduce()` method to calculate total XP by iterating through the task array and assigning values based on priority strings.
2.  **Persistence Layer:** `useEffect` hooks sync the application state with the browser's `localStorage`, ensuring zero data loss.
3.  **UI/UX:** Conditional rendering is used to handle "Empty States," and CSS transitions provide smooth visual feedback on the progress bar.