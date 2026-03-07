import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import navImg from '../assets/images/navImg.png';
import navIcon from '../assets/icons/navIcon.svg';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="relative bg-[#FFCBCA]/80 backdrop-blur-md shadow-sm">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          
          {/* Logo */}
          <div>
            <img src={navImg} alt="taltula Logo" className="h-10 w-auto" />
          </div>

          {/* Menu Links */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) => `text-lg font-semibold ${isActive ? 'text-[#AD5E5C] border-b-2 border-[#AD5E5C]' : 'text-[#696969] hover:text-[#AD5E5C]'} hover:border-b-2 border-[#AD5E5C] transition duration-300`}
            >
              Home
            </NavLink>

            <NavLink
              to="/consult"
              className={({ isActive }) => `text-lg font-semibold ${isActive ? 'text-[#AD5E5C] border-b-2 border-[#AD5E5C]' : 'text-[#696969] hover:text-[#AD5E5C]'} hover:border-b-2 border-[#AD5E5C] transition duration-300`}
            >
              Consult Taltula
            </NavLink>

            <NavLink
              to="/exam"
              className={({ isActive }) => `text-lg font-semibold ${isActive ? 'text-[#AD5E5C] border-b-2 border-[#AD5E5C]' : 'text-[#696969] hover:text-[#AD5E5C]'} hover:border-b-2 border-[#AD5E5C] transition duration-300`}
            >
              Taltula’s Daily Exam
            </NavLink>
          </div>

          {/* Right Button */}
          <div className="hidden lg:block">
            <NavLink
              to="/products"
              className="inline-flex items-center bg-[#AD5E5C] hover:bg-[#944b49] px-8 py-4 text-white rounded-full transition duration-300"
            >
              <img src={navIcon} alt="Nav Icon" className="inline-block mr-2" /> Enter taltula’s Private Clinic
            </NavLink>
          </div>

          {/* Hamburger Menu */}
          <button
            className="lg:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <div className="space-y-2">
              <span className="block w-8 h-0.5 bg-[#696969]" />
              <span className="block w-8 h-0.5 bg-[#696969]" />
              <span className="block w-8 h-0.5 bg-[#696969]" />
            </div>
          </button>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute inset-x-0 top-full bg-[#FFCBCA]/95 backdrop-blur-md py-4 border-t border-white/50 shadow-lg">
            <div className="flex flex-col items-center px-4">
              <NavLink
                to="/"
                className={({ isActive }) => `py-2 text-lg font-semibold ${isActive ? 'text-[#AD5E5C]' : 'text-[#696969] hover:text-[#AD5E5C]'} transition duration-300`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/consult"
                className={({ isActive }) => `py-2 text-lg font-semibold ${isActive ? 'text-[#AD5E5C]' : 'text-[#696969] hover:text-[#AD5E5C]'} transition duration-300`}
                onClick={() => setIsOpen(false)}
              >
                Consult taltula
              </NavLink>

              <NavLink
                to="/exam"
                className={({ isActive }) => `py-2 text-lg font-semibold ${isActive ? 'text-[#AD5E5C]' : 'text-[#696969] hover:text-[#AD5E5C]'} transition duration-300`}
                onClick={() => setIsOpen(false)}
              >
                taltula’s Daily Exam
              </NavLink>

              <NavLink
                to="/products"
                className="bg-[#AD5E5C] hover:bg-[#944b49] px-6 py-3 text-center text-white rounded-full transition duration-300 mt-4 w-full max-w-xs"
                onClick={() => setIsOpen(false)}
              >
                <img src={navIcon} alt="Nav Icon" className="inline-block mr-2" /> Enter Taltula’s Private Clinic
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
