import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About AUSY EXPO</h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Leading the garment export industry with innovation, quality, and reliability
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Founded in 2009, AUSY EXPO has grown from a small garment manufacturing unit 
                to one of the leading export companies in the industry. Our journey began with 
                a simple vision: to provide high-quality garments to global markets while 
                maintaining ethical business practices.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Today, we operate multiple branches worldwide, employing thousands of skilled 
                workers and serving clients across 50+ countries. Our state-of-the-art 
                management system ensures seamless coordination between suppliers, buyers, 
                and our internal teams.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We believe in sustainable fashion and ethical manufacturing practices, 
                making us a trusted partner for brands that value quality and responsibility.
              </p>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-lg">Company Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To deliver exceptional garment export services through innovative technology, 
                sustainable practices, and unwavering commitment to quality, while fostering 
                long-term partnerships with our global clientele.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To be the most trusted and preferred garment export partner globally, 
                setting industry standards for quality, innovation, and sustainability 
                while creating value for all stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Meet the experienced professionals who drive our success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">CEO Photo</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">John Smith</h3>
              <p className="text-primary-600 dark:text-primary-400 mb-2">Chief Executive Officer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                15+ years of experience in garment industry and international trade.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">COO Photo</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sarah Johnson</h3>
              <p className="text-primary-600 dark:text-primary-400 mb-2">Chief Operating Officer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Expert in supply chain management and operational excellence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">CTO Photo</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Michael Chen</h3>
              <p className="text-primary-600 dark:text-primary-400 mb-2">Chief Technology Officer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Leading our digital transformation and technology innovation initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
