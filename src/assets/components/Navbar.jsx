import React from 'react'

const Navbar = ({ setView, currentView }) => {
  return (
    <nav className='flex justify-between items-center bg-violet-900 text-white py-3 px-8 shadow-md'>
        <div className="logo cursor-pointer flex items-center gap-2 group" onClick={() => setView("landing")}>
            {/* Tiny Navbar Icon */}
            <img src="/icon.png" alt="logo" className="w-6 h-6 brightness-200" /> 
            
            <span className='font-bold text-2xl tracking-tighter group-hover:text-violet-200 transition-colors'>
                ScholarStack
            </span>
        </div>
        <ul className="flex gap-10">
            <li 
                onClick={() => setView("home")} 
                className={`cursor-pointer text-sm font-medium hover:text-violet-200 transition-all ${currentView === 'home' ? 'border-b-2 border-white pb-1' : ''}`}
            >
                Home
            </li>
            <li 
                onClick={() => setView("tasks")} 
                className={`cursor-pointer text-sm font-medium hover:text-violet-200 transition-all ${currentView === 'tasks' ? 'border-b-2 border-white pb-1' : ''}`}
            >
                Your Tasks
            </li>
        </ul>
    </nav>
  )
}

export default Navbar