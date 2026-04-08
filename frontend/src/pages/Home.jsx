import React from 'react';
import { NavLink } from 'react-router-dom';
import PaisleyBackground from '../components/shared/PaisleyBackground';

const Home = () => {
  return (
    <PaisleyBackground opacity="0.04" className="min-h-screen bg-charcoal-black flex flex-col justify-center items-center">
      <div className="text-center px-6">
        <h1 className="text-5xl md:text-7xl font-cormorant font-bold text-bronze-gold mb-4 relative inline-block">
          Welcome to Avyakta
          {/* Simulated Kolam Border animated line placeholder */}
          <div className="absolute -inset-4 border border-gold-light opacity-30 rounded-lg"></div>
        </h1>
        <p className="font-playfair italic text-muted-white text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        </p>
        <NavLink 
          to="/about"
          className="inline-block bg-bronze-gold text-charcoal-black font-semibold tracking-widest px-8 py-3 rounded-full hover:scale-105 hover:shadow-[0_0_15px_rgba(201,168,76,0.6)] transition-all duration-300"
        >
          KNOW MORE &rarr;
        </NavLink>
        <div className="mt-8 text-sm text-dull-olive">
          A proud branch of <NavLink to="/about-ira" className="underline hover:text-gold-light transition-colors">Club IRA</NavLink>
        </div>
      </div>
    </PaisleyBackground>
  );
};

export default Home;
