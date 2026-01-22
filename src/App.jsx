import React, { useEffect, useState } from 'react'
import Navbar from './assets/components/Navbar.jsx'
import { FaEdit, FaRocket, FaGraduationCap } from "react-icons/fa";
import { MdDelete, MdAccessTime, MdCheckCircle, MdAccountBalanceWallet } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(true)
  const [view, setView] = useState("home") 

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) {
      setTodos(JSON.parse(todoString))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const handleAdd = () => {
    if (todo.trim().length <= 3) return;
    const newTodo = {
      id: uuidv4(),
      todo,
      isCompleted: false,
      priority,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTodos([...todos, newTodo])
    setTodo("")
  }

  const handleEdit = (id) => {
    let t = todos.find(i => i.id === id)
    setTodo(t.todo)
    setPriority(t.priority)
    setTodos(todos.filter(item => item.id !== id))
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTodos(todos.filter(item => item.id !== id))
    }
  }

  const handleCheckbox = (id) => {
    let index = todos.findIndex(item => item.id === id)
    let newTodos = [...todos]
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    setTodos(newTodos)
  }

  // --- LOGIC FOR STATS ---
  const completedSME = todos.filter(t => t.isCompleted && t.todo.toLowerCase().includes("sme")).length;
  const earnings = completedSME * 150;
  const totalTasks = todos.length;
  const pendingTasks = todos.filter(t => !t.isCompleted).length;

  return (
    <>
      <Navbar setView={setView} currentView={view} />

      <div className="min-h-[85vh] flex flex-col items-center justify-center py-5">
        
        {/* --- HOME VIEW --- */}
        {view === "home" && (
          <div className="mx-3 md:w-[50%] bg-white p-10 rounded-2xl shadow-xl text-center border-t-8 border-violet-800">
            <div className="flex justify-center mb-4">
              {/* Large logo for impact */}
               <img src="/icon.png" alt="ScholarStack Welcome Logo" className="w-20 h-20 object-contain drop-shadow-md" />
            </div>
            <h1 className="text-4xl font-extrabold text-violet-900 mb-2">ScholarStack</h1>
            <p className="text-gray-500 italic mb-6">"Bridging academic excellence and professional growth"</p>
            
            {/* NEW STATS SECTION */}
            <div className="grid grid-cols-3 gap-4 mb-10 border-y py-6 border-gray-100">
              <div>
                <p className="text-3xl font-bold text-violet-800">{totalTasks}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Goals</p>
              </div>
              <div className="border-x border-gray-100">
                <p className="text-3xl font-bold text-red-500">{pendingTasks}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Pending</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">₹{earnings}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">SME Credit</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
              <div className="p-4 bg-violet-50 rounded-xl flex items-start gap-3">
                <MdCheckCircle className="text-violet-800 text-2xl mt-1" />
                <div>
                  <h3 className="font-bold text-violet-900">Task Management</h3>
                  <p className="text-xs text-gray-500">Organize exams, assignments, and coding projects.</p>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl flex items-start gap-3">
                <MdAccountBalanceWallet className="text-green-600 text-2xl mt-1" />
                <div>
                  <h3 className="font-bold text-green-900">Earnings Tracker</h3>
                  <p className="text-xs text-gray-500">Auto-calculate your SME revenue as you finish work.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setView("tasks")}
              className="bg-violet-800 hover:bg-violet-950 text-white font-bold py-3 px-10 rounded-full transition-all shadow-lg flex items-center gap-2 mx-auto"
            >
              Start Productivity <FaRocket />
            </button>
          </div>
        )}

        {/* --- TASKS VIEW --- */}
        {view === "tasks" && (
          <div className="mx-3 md:container md:mx-auto rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[40%] shadow-2xl">
            <h1 className='font-bold text-center text-3xl text-violet-900 mb-4'>Your Tasks</h1>
            
            <div className="bg-white p-3 rounded-lg my-4 flex justify-between items-center shadow-sm border-l-4 border-green-500">
              <span className="text-sm font-semibold text-gray-600">Potential Earnings:</span>
              <span className="text-lg font-bold text-green-600">₹{earnings}</span>
            </div>

            <div className="addTodo my-5 flex flex-col gap-3">
              <h2 className="text-xl font-bold">Add a New Goal</h2>
              <div className="flex flex-col gap-2">
                <input 
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()} 
                  onChange={(e) => setTodo(e.target.value)} 
                  value={todo} 
                  type="text" 
                  placeholder="What needs to be done? (min 4 chars)"
                  className='w-full bg-white rounded-full px-5 py-2 focus:ring-2 focus:ring-violet-600 outline-none'
                />
                <div className="flex justify-between items-center px-1">
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)}
                    className="bg-white rounded-lg px-3 py-1 text-sm text-violet-800 font-semibold outline-none"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                  <button 
                    onClick={handleAdd} 
                    disabled={todo.length <= 3} 
                    className='bg-violet-800 px-6 py-2 rounded-full hover:bg-violet-950 disabled:bg-violet-300 text-sm font-bold text-white transition-all'
                  >
                    Save Task
                  </button>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2 my-4 text-sm text-gray-700'>
              <input onChange={() => setshowFinished(!showFinished)} type="checkbox" checked={showFinished} /> 
              Show Finished Tasks
            </div>

            <div className='h-[1px] bg-black opacity-10 w-[100%] mx-auto my-2'></div>
            
            <div className="todos space-y-3">
              {todos.length === 0 && <div className='text-center py-10 text-gray-500 italic'>No tasks yet. Add something to get started!</div>}
              {todos.map(item => (
                (showFinished || !item.isCompleted) && (
                  <div key={item.id} className="todo flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                    <div className='flex gap-4 items-center'>
                      <input onChange={() => handleCheckbox(item.id)} type="checkbox" checked={item.isCompleted} className="w-4 h-4" />
                      <div>
                        <div className={`${item.isCompleted ? "line-through text-gray-400" : "text-gray-800 font-medium"}`}>
                          {item.todo}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[10px]">
                          <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                            item.priority === 'High' ? 'bg-red-100 text-red-600' : 
                            item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {item.priority}
                          </span>
                          <span className="text-gray-400 flex items-center gap-1">
                            <MdAccessTime /> {item.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="buttons flex">
                      <button onClick={() => handleEdit(item.id)} className='p-2 text-violet-700 hover:bg-violet-50 rounded-full'><FaEdit /></button>
                      <button onClick={() => handleDelete(item.id)} className='p-2 text-red-600 hover:bg-red-50 rounded-full'><MdDelete /></button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App