import React, { useState, useEffect } from 'react'
import Navbar from './assets/components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit, FaRocket, FaGraduationCap, FaChartLine } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(true)
  const [priority, setPriority] = useState("Medium")
  
  // INITIAL STATE IS LANDING
  const [view, setView] = useState("landing") 

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) {
      let savedTodos = JSON.parse(localStorage.getItem("todos"))
      setTodos(savedTodos)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const handleAdd = (e) => {
    if (e) e.preventDefault();
    if (todo.length < 3) return;
    setTodos([...todos, { id: uuidv4(), todo, priority, isCompleted: false }])
    setTodo("")
    setPriority("Medium")
  }

  const handleDelete = (id) => {
    if(window.confirm("Delete this task?")) {
      setTodos(todos.filter(item => item.id !== id))
    }
  }

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => item.id === id);
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
  }

  // Analytics Logic
  const totalXP = todos.reduce((acc, curr) => {
    if (!curr.isCompleted) return acc;
    return acc + (curr.priority === "High" ? 50 : curr.priority === "Medium" ? 30 : 10);
  }, 0);
  const completedCount = todos.filter(t => t.isCompleted).length;
  const progressPercentage = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <>
      {/* Passing setView and currentView as PROPS */}
      <Navbar setView={setView} currentView={view} />
      
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[45%]">
        
        {/* --- 1. LANDING PAGE --- */}
        {view === "landing" && (
          <div className="landing-view flex flex-col items-center text-center p-4 animate-in fade-in duration-700">
            <img src="/icon.png" alt="ScholarStack Logo" className="w-28 h-28 drop-shadow-md"/>
            <h1 className='font-black text-4xl text-violet-900 mb-2'>ScholarStack</h1>
            <p className='text-gray-600 mb-8 italic'>Master your focus, one stack at a time.</p>
            
            <div className="space-y-6 text-left w-full">
              <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm">
                <div className="bg-violet-100 p-3 rounded-lg flex items-center"><FaRocket className="text-violet-800"/></div>
                <div>
                  <h3 className="font-bold text-violet-900">Stack Your Success</h3>
                  <p className="text-xs text-gray-500">Don't just list tasks—prioritize them. High-priority tasks earn you 50 XP!</p>
                </div>
              </div>

              <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm">
                <div className="bg-green-100 p-3 rounded-lg flex items-center"><FaChartLine className="text-green-700"/></div>
                <div>
                  <h3 className="font-bold text-green-900">Track Growth</h3>
                  <p className="text-xs text-gray-500">Visualizing your progress bar reduces anxiety and boosts completion rates.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-violet-800 text-white p-6 rounded-2xl shadow-xl w-full">
              <h2 className="font-bold mb-2">Daily Scholar Workflow:</h2>
              <ul className="text-sm space-y-2 text-violet-100">
                <li>1. <b>Morning:</b> Add your lecture tasks to the stack.</li>
                <li>2. <b>Afternoon:</b> Sort by Priority (🔥 High = Most XP).</li>
                <li>3. <b>Evening:</b> Check your Dashboard to see your success rate.</li>
              </ul>
              <button onClick={() => setView("home")} className="mt-6 bg-white text-violet-800 font-bold py-2 px-8 rounded-full hover:bg-violet-100 transition-all">
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* --- 2. HOME (DASHBOARD) --- */}
        {view === "home" && (
          <div className="home-view animate-in slide-in-from-bottom duration-500">
            <h1 className='font-bold text-center text-3xl mb-8 text-violet-900'>My Success Dashboard</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-violet-600 text-center">
                <h2 className='text-gray-400 text-xs font-bold uppercase'>Earned XP</h2>
                <p className='text-4xl font-black text-violet-800'>{totalXP}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-green-500 text-center">
                <h2 className='text-gray-400 text-xs font-bold uppercase'>Progress</h2>
                <p className='text-4xl font-black text-green-700'>{Math.round(progressPercentage)}%</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
               <h3 className='text-sm font-bold text-gray-700 mb-4 text-center'>DAILY STACK GOAL</h3>
               <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-violet-600 h-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
               </div>
               <p className='text-center mt-3 text-xs text-gray-400'>{completedCount} of {todos.length} tasks completed</p>
            </div>

            <button onClick={() => setView("tasks")} className='w-full bg-violet-800 text-white py-4 rounded-2xl font-bold hover:bg-violet-900 transition-all'>
              Manage My Tasks →
            </button>
          </div>
        )}

        {/* --- 3. YOUR TASKS --- */}
        {view === "tasks" && (
          <div className="tasks-view animate-in slide-in-from-right duration-500">
             <div className='flex justify-between items-center mb-6'>
                <h1 className='font-bold text-2xl text-violet-900'>Your Stack</h1>
                <div className='bg-violet-800 text-white px-4 py-1 rounded-full text-xs font-bold'>{totalXP} XP</div>
             </div>

             <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow-md mb-6">
                <input 
                    onChange={(e) => setTodo(e.target.value)} 
                    value={todo} 
                    type="text" 
                    className='w-full border-b border-violet-100 focus:outline-none focus:border-violet-600 py-2 mb-3' 
                    placeholder="Enter task name..." 
                />
                <div className='flex gap-2'>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className='flex-1 bg-violet-50 p-2 rounded-lg text-sm'>
                        <option value="High">🔥 High Priority</option>
                        <option value="Medium">⚡ Medium Priority</option>
                        <option value="Low">🌱 Low Priority</option>
                    </select>
                    <button type="submit" disabled={todo.length < 3} className='bg-violet-800 text-white px-6 py-2 rounded-lg font-bold disabled:bg-violet-300'>Add</button>
                </div>
             </form>

             <div className="todos space-y-3">
              {todos.map(item => (showFinished || !item.isCompleted) && (
                <div key={item.id} className={`flex justify-between p-4 bg-white rounded-xl shadow-sm border-l-4 ${item.priority === 'High' ? 'border-red-500' : 'border-violet-400'} ${item.isCompleted ? "opacity-40" : ""}`}>
                  <div className='flex gap-4 items-center'>
                    <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} className='accent-violet-600 w-4 h-4' />
                    <span className={item.isCompleted ? "line-through text-gray-400" : "font-medium text-gray-800"}>{item.todo}</span>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className='text-red-400 hover:text-red-600'><AiFillDelete size={18}/></button>
                </div>
              ))}
             </div>
          </div>
        )}

      </div>
    </>
  )
}

export default App