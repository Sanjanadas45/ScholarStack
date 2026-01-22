import React from 'react'

const Navbar = ({ setView, currentView }) => {
  return (
    <nav className='flex justify-between bg-violet-900 text-white py-3 shadow-lg'>
        <div className="logo cursor-pointer" onClick={() => setView("home")}>
            <span className='font-bold text-2xl mx-8 tracking-tight'>ScholarStack</span>
        </div>
      <ul className="flex gap-8 mx-9 items-center">
        <li 
            onClick={() => setView("home")} 
            className={`cursor-pointer hover:text-violet-200 transition-all ${currentView === 'home' ? 'font-bold border-b-2 border-white' : ''}`}
        >
            Home
        </li>
        <li 
            onClick={() => setView("tasks")} 
            className={`cursor-pointer hover:text-violet-200 transition-all ${currentView === 'tasks' ? 'font-bold border-b-2 border-white' : ''}`}
        >
            Your Tasks
        </li>
      </ul>
    </nav>
  )
}

export default Navbar