import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I book a table at a café?',
    answer: 'Browse cafés on the "Discover Cafés" page, select your preferred café, choose a date and time, select a table, and confirm your booking. You will receive a confirmation email with your booking details.',
  },
  {
    question: 'Can I modify or cancel my booking?',
    answer: 'Yes, you can modify or cancel your booking up to 2 hours before your scheduled time. Go to your Dashboard, find the booking, and click "Modify" or "Cancel". Refunds for cancelled bookings follow the café\'s cancellation policy.',
  },
  {
    question: 'How does pre-ordering work?',
    answer: 'After booking a table, you can browse the café\'s menu and add items to your order. Your order will be sent to the café kitchen and will be ready when you arrive. You can track your order status in real-time.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept online payments (credit/debit cards, digital wallets) and cash payments at the café. Online payments are processed securely through our payment partners.',
  },
  {
    question: 'Is there a fee for using BREWLYN?',
    answer: 'Creating an account and browsing cafés is free. Some cafés may charge a small booking deposit that is applied to your final bill. There are no hidden fees from BREWLYN.',
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach our support team through the "Contact Us" page, email support@brewlyn.com, or use the in-app chat feature. We typically respond within 24 hours.',
  },
];

const sections = [
  {
    id: 'terms',
    title: 'Terms of Service',
    content: `
      <h3 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h3>
      <p className="text-gray-600 mb-4">By accessing and using BREWLYN, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">2. Description of Service</h3>
      <p className="text-gray-600 mb-4">BREWLYN provides an online platform for users to discover cafés, book tables, pre-order food and beverages, and manage their café experiences.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">3. User Accounts</h3>
      <p className="text-gray-600 mb-4">You must create an account to use certain features. You are responsible for maintaining the confidentiality of your account and password. You must be at least 18 years old to create an account.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">4. Bookings and Orders</h3>
      <p className="text-gray-600 mb-4">Bookings are subject to availability and café confirmation. Orders are transmitted to the café and subject to their preparation capacity. Cancellation policies vary by café.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">5. Payments</h3>
      <p className="text-gray-600 mb-4">Payments are processed through secure third-party providers. BREWLYN does not store your payment details. Refunds follow the café\'s policy.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">6. User Conduct</h3>
      <p className="text-gray-600 mb-4">You agree not to misuse the platform, attempt unauthorized access, or engage in any activity that disrupts the service.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h3>
      <p className="text-gray-600 mb-4">BREWLYN is not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">8. Changes to Terms</h3>
      <p className="text-gray-600 mb-4">We may update these terms at any time. Continued use of the service constitutes acceptance of the new terms.</p>
    `,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: `
      <h3 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h3>
      <p className="text-gray-600 mb-4">We collect information you provide directly: name, email, phone, address, payment info, and preferences.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h3>
      <p className="text-gray-600 mb-4">To provide services, process bookings/orders, communicate with you, improve our platform, and ensure security.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">3. Information Sharing</h3>
      <p className="text-gray-600 mb-4">We share data with cafés for booking fulfillment, payment processors, and when required by law. We do not sell your data.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">4. Data Security</h3>
      <p className="text-gray-600 mb-4">We implement appropriate security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">5. Your Rights</h3>
      <p className="text-gray-600 mb-4">You can access, update, or delete your data. Contact us at privacy@brewlyn.com for data requests.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4">6. Cookies</h3>
      <p className="text-gray-600 mb-4">We use cookies for authentication, analytics, and preferences. You can disable cookies in your browser settings.</p>
    `,
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    content: '',
  },
];

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'terms' | 'privacy' | 'faq'>('terms');
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0]));

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const currentSection = sections.find((s) => s.id === activeSection)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/"
            onClick={(e) => { e.preventDefault(); navigate(-1); }}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{currentSection.title}</h1>
        </motion.div>

        {/* Section Tabs */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-1 mb-8 flex gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as 'terms' | 'privacy' | 'faq')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-coffee-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {section.title}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="p-8 md:p-12">
            {activeSection === 'faq' ? (
              <motion.div
                className="space-y-4"
                variants={itemVariants}
              >
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      aria-expanded={openFaqs.has(index)}
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: openFaqs.has(index) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-coffee-600 flex-shrink-0"
                      >
                        {openFaqs.has(index) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </motion.div>
                    </button>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: openFaqs.has(index) ? 'auto' : 0, opacity: openFaqs.has(index) ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="prose prose-coffee max-w-none"
                variants={itemVariants}
                dangerouslySetInnerHTML={{ __html: currentSection.content.replace(/className=/g, 'class=') }}
              />
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-gray-500 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Last updated: January 2026 |{' '}
          <Link to="/contact" className="text-coffee-600 hover:underline">
            Contact Us
          </Link>{' '}
          for questions about these policies.
        </motion.p>
      </motion.div>
    </div>
  );
};