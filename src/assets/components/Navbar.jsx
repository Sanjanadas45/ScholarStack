import React from 'react'

const Navbar = ({ setView, currentView }) => {
  return (
    <nav className='flex justify-between items-center bg-violet-900 text-white py-3 px-3 sm:px-8 shadow-md'>
    {/* Logo Section - Stays Left */}
    <div className="logo cursor-pointer flex items-center gap-1.5 sm:gap-2 group" onClick={() => setView("landing")}>
        <img src="/icon.png" alt="logo" className="w-5 h-5 sm:w-6 sm:h-6 brightness-200" /> 
        
        <span className='font-bold text-lg sm:text-2xl tracking-tighter group-hover:text-violet-200 transition-colors'>
            ScholarStack
        </span>
    </div>

    {/* Navigation Links - Stays Right */}
    <ul className="flex gap-4 sm:gap-10">
        <li 
            onClick={() => setView("home")} 
            className={`cursor-pointer text-[11px] sm:text-sm uppercase tracking-wider font-semibold hover:text-violet-200 transition-all ${currentView === 'home' ? 'border-b-2 border-white pb-0.5' : ''}`}
        >
            Home
        </li>
        <li 
            onClick={() => setView("tasks")} 
            className={`cursor-pointer text-[11px] sm:text-sm uppercase tracking-wider font-semibold hover:text-violet-200 transition-all ${currentView === 'tasks' ? 'border-b-2 border-white pb-0.5' : ''}`}
        >
            Your Tasks
        </li>
    </ul>
</nav>
  )
}

export default Navbar