import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <Header />
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-xl mb-4">We'd love to hear from you! Fill out the form below to get in touch.</p>

      <form className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-medium text-gray-800 mb-1">Your Name</label>
          <input type="text" id="name" className="w-full border border-gray-300 rounded-md px-4 py-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-medium text-gray-800 mb-1">Your Email</label>
          <input type="email" id="email" className="w-full border border-gray-300 rounded-md px-4 py-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-lg font-medium text-gray-800 mb-1">Message</label>
          <textarea id="message" className="w-full border border-gray-300 rounded-md px-4 py-2"></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">
          Submit
        </button>
      </form>
    </div>
    <Footer />
  </div>
);

export default Contact;
