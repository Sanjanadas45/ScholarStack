import React, { useState, useEffect } from "react";
import Navbar from "./assets/components/Navbar";
import { supabase } from "./supabaseClient";
import {
  FaEdit,
  FaRocket,
  FaGraduationCap,
  FaChartLine,
  FaSearch,
} from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Toaster, toast } from "react-hot-toast";
import { formatDistanceToNow, isPast, addHours, addDays, endOfDay } from "date-fns";

function App() {
  // --- AUTH STATES ---
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState(""); 

  // --- APP STATES ---
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("landing");

  // --- EDITING STATES ---
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // --- 1. AUTH LISTENER & INITIAL FETCH ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    if (!user) {
      setTodos([]);
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      const mapped = data.map((item) => ({
        id: item.id,
        todo: item.task_name,
        priority:
          item.xp_amount >= 50
            ? "High"
            : item.xp_amount >= 30
              ? "Medium"
              : "Low",
        isCompleted: item.is_completed,
        dueAt: item.due_at,
      }));
      setTodos(mapped);
    }
  };

  // --- 2. HANDLERS ---
  const handleAdd = async (e) => {
    if (e) e.preventDefault();
    if (todo.length < 3) return;

    if (!user) {
      setShowModal(true);
      return;
    }

    const xpValue = priority === "High" ? 50 : priority === "Medium" ? 30 : 10;

    let finalDueDate = null;
    if (deadline) {
        const now = new Date();
        if (deadline === "1h") finalDueDate = addHours(now, 1);
        if (deadline === "3h") finalDueDate = addHours(now, 3);
        if (deadline === "6h") finalDueDate = addHours(now, 6);
        if (deadline === "today") finalDueDate = endOfDay(now);
        if (deadline === "1d") finalDueDate = addDays(now, 1);
        if (deadline === "3d") finalDueDate = addDays(now, 3);
        if (deadline === "1w") finalDueDate = addDays(now, 7);
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          task_name: todo,
          xp_amount: xpValue,
          is_completed: false,
          user_id: user.id,
          due_at: finalDueDate, 
        },
      ])
      .select();

    if (error) {
      toast.error("Failed to save task. Try again!");
    } else {
      toast.success("Task added to your stack! 🔥");
      fetchTodos();
      setTodo("");
      setDeadline("");
      setPriority("Medium");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) {
        toast.error("Failed to delete task.");
      } else {
        setTodos(todos.filter((item) => item.id !== id));
        toast.success("Task removed! 🗑️");
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.todo);
  };

  const handleSaveEdit = async (id) => {
    if (editText.length < 3) {
      toast.error("Task name too short!");
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .update({ task_name: editText })
      .eq("id", id);

    if (error) {
      toast.error("Update failed.");
    } else {
      setTodos(todos.map((t) => (t.id === id ? { ...t, todo: editText } : t)));
      toast.success("Task updated! ✨");
    }
    setEditingId(null);
  };

  const handleCheckbox = async (e) => {
    const id = e.target.name;
    const itemToToggle = todos.find((item) => item.id == id);
    if (!itemToToggle) return;

    const newStatus = !itemToToggle.isCompleted;

    // 1. OPTIMISTIC UPDATE: Update UI immediately so it feels fast
    setTodos((prev) =>
      prev.map((item) =>
        item.id == id ? { ...item, isCompleted: newStatus } : item
      )
    );

    // 2. PERSISTENCE: Save to Supabase
    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Sync failed. Reverting change...");
      // 3. ROLLBACK: If the database update fails, revert the UI
      setTodos((prev) =>
        prev.map((item) =>
          item.id == id ? { ...item, isCompleted: !newStatus } : item
        )
      );
    }
  };

  const handleClearFinished = async () => {
    if (window.confirm("Permanently delete all completed tasks?")) {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("is_completed", true);
      if (error) toast.error("Clear failed");
      else {
        setTodos(todos.filter((item) => !item.isCompleted));
        toast.success("Cleared completed tasks!");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) toast.error(error.message);
    else {
      toast.success("Magic Link sent! Check your inbox 📧");
      setShowModal(false);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
  const confirmed = window.confirm("Are you sure you want to sign out of ScholarStack?");

  if (confirmed) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully! See you soon.");
      setView("landing"); 
    }
  }
};

  const getDeadlineBadge = (dueAt) => {
    if (!dueAt) return null;

    const date = new Date(dueAt);
    const isOverdue = isPast(date);
    const timeRemaining = formatDistanceToNow(date, { addSuffix: true });

    return (
      <div
        className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${isOverdue ? "text-red-500" : "text-violet-500"}`}
      >
        <span className="opacity-70 italic">
          {isOverdue ? "Overdue" : "Deadline:"}
        </span>
        {timeRemaining.replace("about ", "")}
      </div>
    );
  };

  // --- ANALYTICS ---
  const totalXP = todos.reduce((acc, curr) => {
    if (!curr.isCompleted) return acc;
    return (
      acc +
      (curr.priority === "High" ? 50 : curr.priority === "Medium" ? 30 : 10)
    );
  }, 0);
  const completedCount = todos.filter((t) => t.isCompleted).length;
  const progressPercentage =
    todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Navbar
        setView={setView}
        currentView={view}
        user={user}
        onSignOut={handleLogout}
        onSignInClick={() => setShowModal(true)}
      />

      {/* FIXED: Added better responsive width and padding to the main container */}
      <div className="mx-2 sm:mx-auto my-5 rounded-xl p-4 sm:p-5 bg-violet-100 min-h-[80vh] md:w-[45%] lg:w-[35%] overflow-hidden">
        {/* --- 1. LANDING PAGE --- */}
        {view === "landing" && (
          <div className="landing-view flex flex-col items-center text-center p-4 animate-in fade-in duration-700">
            <img
              src="/icon.png"
              alt="ScholarStack Logo"
              className="w-28 h-28 drop-shadow-md"
            />
            <h1 className="font-black text-4xl text-violet-900 mb-2">
              ScholarStack
            </h1>
            <p className="text-gray-600 mb-8 italic">
              Master your focus, one task at a time.
            </p>

            <div className="space-y-6 text-left w-full">
              <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm">
                <div className="bg-violet-100 p-3 rounded-lg flex items-center">
                  <FaRocket className="text-violet-800" />
                </div>
                <div>
                  <h3 className="font-bold text-violet-900">
                    Stack Your Success
                  </h3>
                  <p className="text-xs text-gray-500">
                    Don't just list tasks—prioritize them. High-priority earn 50
                    XP!
                  </p>
                </div>
              </div>
              <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm">
                <div className="bg-green-100 p-3 rounded-lg flex items-center">
                  <FaChartLine className="text-green-700" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900">Track Growth</h3>
                  <p className="text-xs text-gray-500">
                    Visualizing progress reduces anxiety and boosts completion.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-violet-800 text-white p-6 rounded-2xl shadow-xl w-full">
              <h2 className="font-bold mb-2">Daily Scholar Workflow:</h2>
              <ul className="text-sm space-y-2 text-violet-100">
                <li>
                  1. <b>Morning:</b> Add lecture tasks to the stack.
                </li>
                <li>
                  2. <b>Afternoon:</b> Sort by Priority (🔥 High = Most XP).
                </li>
                <li>
                  3. <b>Evening:</b> Check your success rate in the Dashboard.
                </li>
              </ul>
              <button
                onClick={() => setView("home")}
                className="mt-6 bg-white text-violet-800 font-bold py-2 px-8 rounded-full hover:bg-violet-100 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* --- 2. HOME (DASHBOARD) --- */}
        {view === "home" && (
          <div className="home-view animate-in slide-in-from-bottom duration-500">
            <h1 className="font-bold text-center text-3xl mb-8 text-violet-900">
              My Success Dashboard
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-violet-600 text-center">
                <h2 className="text-gray-400 text-xs font-bold uppercase">
                  Earned XP
                </h2>
                <p className="text-4xl font-black text-violet-800">{totalXP}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-green-500 text-center">
                <h2 className="text-gray-400 text-xs font-bold uppercase">
                  Progress
                </h2>
                <p className="text-4xl font-black text-green-700">
                  {Math.round(progressPercentage)}%
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-violet-600 h-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-center mt-3 text-xs text-gray-400">
                {completedCount} of {todos.length} tasks completed
              </p>
            </div>

            <button
              onClick={() => setView("tasks")}
              className="w-full bg-violet-800 text-white py-4 rounded-2xl font-bold hover:bg-violet-900 transition-all"
            >
              Manage My Tasks →
            </button>
          </div>
        )}

        {/* --- 3. YOUR TASKS --- */}
        {view === "tasks" && (
          <div className="tasks-view animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-6 px-1">
              <h1 className="font-bold text-2xl text-violet-900">Your Stack</h1>
              <div className="bg-violet-800 text-white px-4 py-1 rounded-full text-xs font-bold">
                {totalXP} XP
              </div>
            </div>

            <form
              onSubmit={handleAdd}
              className="bg-white p-4 rounded-xl shadow-md mb-6"
            >
              <input
                onChange={(e) => setTodo(e.target.value)}
                value={todo}
                type="text"
                className="w-full border-b border-violet-100 focus:outline-none focus:border-violet-600 py-2 mb-3"
                placeholder="Enter task name..."
              />
              
              <div className="flex flex-col mb-4">
                <label className="text-xs font-bold text-violet-400 mb-1 ml-1 uppercase">
                  Set Deadline
                </label>
                <select
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="bg-violet-50 p-2 rounded-lg text-sm text-gray-600 outline-none focus:ring-1 focus:ring-violet-400 w-full"
                >
                  <option value="">No Deadline</option>
                  <option value="1h">In 1 Hour</option>
                  <option value="3h">In 3 Hours</option>
                  <option value="6h">In 6 Hours</option>
                  <option value="today">Today (End of Day)</option>
                  <option value="1d">In 1 Day</option>
                  <option value="3d">In 3 Days</option>
                  <option value="1w">In 1 Week</option>
                </select>
              </div>

              {/* FIXED: Using flex-col on small screens to prevent button overflow */}
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full flex-1 bg-violet-50 p-2 rounded-lg text-sm outline-none"
                >
                  <option value="High">🔥 High Priority (50 XP)</option>
                  <option value="Medium">⚡ Medium Priority (30 XP)</option>
                  <option value="Low">🌱 Low Priority (10 XP)</option>
                </select>
                <button
                  type="submit"
                  disabled={todo.length < 3}
                  className="w-full sm:w-auto bg-violet-800 text-white px-6 py-2 rounded-lg font-bold disabled:bg-violet-300 transition-all whitespace-nowrap active:scale-95"
                >
                  Add
                </button>
              </div>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showFinished"
                  checked={showFinished}
                  onChange={() => setshowFinished(!showFinished)}
                  className="accent-violet-600 cursor-pointer w-4 h-4"
                />
                <label
                  htmlFor="showFinished"
                  className="text-[11px] sm:text-sm text-gray-600 cursor-pointer font-semibold"
                >
                  Show Finished
                </label>
              </div>
              {completedCount > 0 && (
                <button
                  onClick={handleClearFinished}
                  className="text-[10px] sm:text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold hover:bg-red-200 shadow-sm whitespace-nowrap"
                >
                  Clear Done
                </button>
              )}
            </div>

            <div className="todos space-y-3">
              {todos
                .filter((item) => {
                  const matchesSearch = item.todo
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                  const matchesVisibility = showFinished || !item.isCompleted;
                  return matchesSearch && matchesVisibility;
                })
                .map((item) => (
                  <div
                    key={item.id}
                    className={`flex justify-between p-4 bg-white rounded-xl shadow-sm border-l-4 ${item.priority === "High" ? "border-red-500" : "border-violet-400"} ${item.isCompleted ? "opacity-40" : ""}`}
                  >
                    <div className="flex gap-4 items-center flex-1 mr-4 overflow-hidden">
                      <input
                        name={item.id}
                        onChange={handleCheckbox}
                        type="checkbox"
                        checked={item.isCompleted}
                        className="accent-violet-600 w-4 h-4 flex-shrink-0"
                      />

                      {editingId === item.id ? (
                        <input
                          autoFocus
                          className="w-full border-b border-violet-600 outline-none font-medium text-gray-800"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => handleSaveEdit(item.id)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSaveEdit(item.id)
                          }
                        />
                      ) : (
                        <div className="flex flex-col overflow-hidden">
                          <span
                            className={`truncate ${
                              item.isCompleted
                                ? "line-through text-gray-400"
                                : "font-medium text-gray-800"
                            }`}
                          >
                            {item.todo}
                          </span>
                          {!item.isCompleted && getDeadlineBadge(item.dueAt)}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 flex-shrink-0">
                      {!item.isCompleted && (
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-violet-400 hover:text-violet-600"
                        >
                          <FaEdit size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-300 hover:text-red-600"
                      >
                        <AiFillDelete size={18} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- 4. LOGIN MODAL --- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all">
              <h2 className="text-2xl font-bold text-violet-900 mb-2">
                Save Your Stack 📚
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Enter your email to save your progress and sync across devices.
              </p>
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="scholar@example.com"
                  className="w-full p-3 border-2 border-violet-100 rounded-xl mb-4 focus:border-violet-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  disabled={loading}
                  className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 shadow-lg active:scale-95"
                >
                  {loading ? "Sending Magic Link..." : "Send Magic Link"}
                </button>
              </form>
              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-4 text-gray-400 text-xs hover:text-gray-600"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;