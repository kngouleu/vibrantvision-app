import Link from 'next/link';
import React from 'react';

const Footer = () => (
  <footer className="bg-[#385170] text-white px-4 sm:px-6 lg:px-8 py-3 mt-4 text-center sm:text-left">
    <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center">
      <p className="mb-4 md:mb-0 md:w-auto">&copy; {new Date().getFullYear()} Vibrant Visions</p>
      <nav>
        <ul className="flex space-x-2 sm:space-x-4 lg:space-x-8 justify-center md:justify-start">
          <li><Link href="#" className="hover:text-blue-300 transition-colors duration-200">Privacy Policy</Link></li>
          <li><Link href="#" className="hover:text-blue-300 transition-colors duration-200" >Terms of Service</Link></li>
          <li><Link href="/contact" className="hover:text-blue-300 transition-colors duration-200">Contact</Link></li>
        </ul>
      </nav>
    </div>
  </footer>
);

export default Footer;
