import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                AUSY EXPO
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-primary-100 font-light">
              Your Premium Partner in Global Garment Export Solutions
            </p>
            <p className="text-lg mb-10 max-w-4xl mx-auto text-primary-50 leading-relaxed">
              Experience excellence in garment export management with our cutting-edge platform. 
              We connect suppliers, buyers, and managers in a seamless digital ecosystem, 
              ensuring quality, efficiency, and global reach.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/services"
                className="bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Services
              </Link>
              <Link
                to="/signup"
                className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400 opacity-20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-orange-400 opacity-15 rounded-full"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose{' '}
              <span className="text-primary-600 dark:text-primary-400">AUSY EXPO</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We revolutionize garment export management with innovative technology, 
              exceptional service, and global expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Premium Quality Assurance</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Industry-leading quality control systems with AI-powered inspection technology, 
                ensuring every garment meets international standards and exceeds customer expectations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lightning-Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Advanced logistics network with real-time tracking, smart routing algorithms, 
                and strategic partnerships ensuring rapid, reliable delivery to 50+ countries worldwide.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Expert Team Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                World-class professionals with 15+ years of experience in international trade, 
                fashion trends, and digital transformation, dedicated to your success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Global Impact
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Numbers that showcase our commitment to excellence and global reach
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 animate-pulse">500+</div>
              <div className="text-primary-100 text-lg font-semibold">Satisfied Clients</div>
              <div className="text-primary-200 text-sm mt-1">Worldwide</div>
            </div>
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 animate-pulse">50+</div>
              <div className="text-primary-100 text-lg font-semibold">Countries Served</div>
              <div className="text-primary-200 text-sm mt-1">Global Reach</div>
            </div>
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 animate-pulse">1M+</div>
              <div className="text-primary-100 text-lg font-semibold">Garments Exported</div>
              <div className="text-primary-200 text-sm mt-1">Premium Quality</div>
            </div>
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 animate-pulse">15+</div>
              <div className="text-primary-100 text-lg font-semibold">Years Experience</div>
              <div className="text-primary-200 text-sm mt-1">Industry Leadership</div>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-10 left-5 w-24 h-24 bg-yellow-400 opacity-10 rounded-full"></div>
        <div className="absolute bottom-10 right-5 w-32 h-32 bg-orange-400 opacity-10 rounded-full"></div>
      </section>

      {/* Services Preview Section */}
      <section className="py-24 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Premium Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive solutions tailored to meet every aspect of your garment export needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🏭</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Supply Chain Management</h3>
              <p className="text-gray-600 dark:text-gray-300">End-to-end supply chain optimization with real-time visibility and control.</p>
            </div>

            {/* Service 2 */}
            <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quality Control</h3>
              <p className="text-gray-600 dark:text-gray-300">Advanced inspection systems ensuring every product meets international standards.</p>
            </div>

            {/* Service 3 */}
            <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Global Logistics</h3>
              <p className="text-gray-600 dark:text-gray-300">Worldwide shipping solutions with tracking and customs clearance support.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful businesses who trust AUSY EXPO for their garment export needs. 
            Experience the difference of working with industry leaders.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/signup"
              className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Today
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-5 left-5 w-20 h-20 bg-primary-400 opacity-20 rounded-full animate-ping"></div>
        <div className="absolute bottom-5 right-5 w-24 h-24 bg-yellow-400 opacity-20 rounded-full animate-pulse"></div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
