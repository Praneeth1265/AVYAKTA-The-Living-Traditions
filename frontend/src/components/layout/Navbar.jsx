import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Gallery', path: '/gallery' },
  { name: 'Events', path: '/events' },
  { name: 'Registrations / Volunteer', path: '/registrations' },
  { name: 'Recruitment', path: '/recruitment' },
  { name: 'Members', path: '/members' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarBg = (scrolled || !isHome || mobileMenuOpen) 
    ? 'bg-charcoal-black border-b border-bronze-gold' 
    : 'bg-transparent border-transparent';

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${navbarBg}`}>
        <div className="max-w-[1280px] mx-auto px-6 h-[80px] flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 z-50">
            {/* Logo Placeholder */}
            <div className="w-10 h-10 rounded-full border border-gold-light flex flex-col justify-center items-center text-emerald-green font-bold text-xs bg-muted-white">
              <span className="text-bronze-gold">AV</span>
            </div>
            <span className="font-cormorant font-bold text-2xl text-muted-white">AVYAKTA</span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[13px] uppercase tracking-[0.1em] transition-colors duration-200 hover:text-gold-light ${
                      isActive ? 'text-bronze-gold border-b border-bronze-gold pb-1' : 'text-muted-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Mobile Nav Toggle */}
          <button 
            className="md:hidden z-50 text-muted-white hover:text-gold-light transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} className="hover:text-deep-crimson transition-colors" /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-charcoal-black flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Rangoli Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMEwyNSAxMEwzMCAyMEwzNSAxMEwzMCAwWiIgZmlsbD0iIzkyNzkxQiIgLz48L3N2Zz4=')] bg-repeat" />
            
            <nav className="flex flex-col gap-8 text-center relative z-10">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-lg uppercase tracking-[0.1em] transition-colors duration-200 ${
                      isActive ? 'text-bronze-gold' : 'text-muted-white hover:text-gold-light'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
