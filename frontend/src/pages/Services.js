import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Services = () => {
  const services = [
    {
      title: "Garment Manufacturing",
      description: "High-quality garment production with state-of-the-art machinery and skilled workforce.",
      features: ["Quality Control", "Custom Designs", "Bulk Orders", "Fast Turnaround"],
      icon: "🏭"
    },
    {
      title: "Export Management",
      description: "Complete export documentation and logistics management for global markets.",
      features: ["Documentation", "Customs Clearance", "Shipping Coordination", "Compliance"],
      icon: "🚢"
    },
    {
      title: "Supply Chain Solutions",
      description: "End-to-end supply chain management from raw materials to finished products.",
      features: ["Procurement", "Inventory Management", "Logistics", "Quality Assurance"],
      icon: "🔗"
    },
    {
      title: "Digital Platform",
      description: "Advanced management system connecting suppliers, buyers, and internal teams.",
      features: ["Real-time Tracking", "Report Generation", "Multi-user Access", "Analytics"],
      icon: "💻"
    },
    {
      title: "Quality Assurance",
      description: "Comprehensive quality control processes ensuring international standards.",
      features: ["Pre-production Samples", "In-line Inspection", "Final Quality Check", "Certifications"],
      icon: "✅"
    },
    {
      title: "Consulting Services",
      description: "Expert guidance on market trends, compliance, and business development.",
      features: ["Market Analysis", "Compliance Guidance", "Business Strategy", "Training"],
      icon: "📊"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Comprehensive garment export solutions tailored to your business needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                </div>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A streamlined approach to garment export that ensures quality and efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Order Placement
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Submit your requirements through our digital platform with detailed specifications.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Production Planning
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Our team creates a detailed production plan with timelines and quality checkpoints.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Manufacturing
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                State-of-the-art production facilities ensure high-quality garment manufacturing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Export & Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Complete export documentation and logistics management for timely delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Get in touch with our team to discuss your garment export requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/signup"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Join Our Platform
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
