import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <Header />
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Who We Are</h2>
        <p className="text-xl mb-4">
          At Vibrant Visions, we are a team of passionate creators and visionaries dedicated to inspiring creativity and
          empowering vision. We believe that everyone has the potential to unlock their imagination and explore new
          realms of creativity.
        </p>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
        <p className="text-xl mb-4">
          Our mission is to provide a space where limitless creativity and empowering visions come to life. We aim to
          inspire individuals to embrace their creative potential, nurture their imagination, and explore the depths of
          their artistic expression.
        </p>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">What We Offer</h2>
        <p className="text-xl mb-4">
          Through our blog posts, we share insightful content, thought-provoking ideas, and practical tips and
          techniques to ignite your imagination and fuel your creative journey. We cover a wide range of topics,
          including art, design, literature, photography, and more.
        </p>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Join Us</h2>
        <p className="text-xl mb-4">
          We invite you to join us on this journey of imagination, exploration, and self-expression. Whether you are an
          established artist or a beginner seeking inspiration, Vibrant Visions is here to accompany you every step of
          the way. Let's embark on this creative adventure together!
        </p>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
