import React from 'react'

const Navbar = ({ setView, currentView, user, onSignOut, onSignInClick }) => {
  return (
    <nav className='flex justify-between items-center bg-violet-900 text-white py-3 px-3 sm:px-8 shadow-md'>
        {/* Logo Section - Uses flex-shrink-0 to protect itself */}
        <div 
            className="logo cursor-pointer flex items-center gap-1.5 sm:gap-2 group flex-shrink-0" 
            onClick={() => setView("landing")}
        >
            <img src="/icon.png" alt="logo" className="w-5 h-5 sm:w-6 sm:h-6 brightness-200" /> 
            
            <span className='font-bold text-base sm:text-2xl tracking-tighter group-hover:text-violet-200 transition-colors'>
                ScholarStack
            </span>
        </div>

        {/* Navigation Links - Wrapped in a container with a gap and justify-end */}
        <ul className="flex items-center justify-end gap-2.5 sm:gap-8 ml-2 flex-1">
            <li 
                onClick={() => setView("home")} 
                className={`cursor-pointer text-[10px] sm:text-sm uppercase tracking-wider font-semibold hover:text-violet-200 transition-all whitespace-nowrap ${currentView === 'home' ? 'border-b-2 border-white pb-0.5' : ''}`}
            >
                Home
            </li>
            <li 
                onClick={() => setView("tasks")} 
                className={`cursor-pointer text-[10px] sm:text-sm uppercase tracking-wider font-semibold hover:text-violet-200 transition-all whitespace-nowrap ${currentView === 'tasks' ? 'border-b-2 border-white pb-0.5' : ''}`}
            >
                Tasks
            </li>

            {/* Auth Toggle Section */}
            {user ? (
                <li 
                    onClick={onSignOut}
                    className="cursor-pointer text-[10px] sm:text-sm uppercase tracking-wider font-bold bg-red-500/20 hover:bg-red-500/40 px-2 sm:px-3 py-1 rounded transition-all text-red-200 whitespace-nowrap flex-shrink-0 border border-red-500/30"
                >
                    Sign Out
                </li>
            ) : (
                <li 
                    onClick={onSignInClick}
                    className="cursor-pointer text-[10px] sm:text-sm uppercase tracking-wider font-bold bg-white text-violet-900 px-2 sm:px-3 py-1 rounded hover:bg-violet-100 transition-all whitespace-nowrap flex-shrink-0"
                >
                    Sign In
                </li>
            )}
        </ul>
    </nav>
  )
}

export default Navbar