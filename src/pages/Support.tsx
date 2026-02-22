import { Link } from 'react-router-dom';
import { HelpCircle, Mail, Phone, FileText } from 'lucide-react';

export default function Support() {
  const faqs = [
    {
      question: 'How do I report a lost item?',
      answer:
        'Log in to your account, click "Report Lost Item", fill in the details about your item, add photos if available, and specify where and when you lost it.',
    },
    {
      question: 'How do I claim I found an item?',
      answer:
        'Visit the "Found Items" section, browse items in your area, and if you recognize something, submit a claim with proof of verification.',
    },
    {
      question: 'Is my information safe on Refind?',
      answer:
        'Yes, we use industry-standard encryption and security protocols. Your personal information is never shared without your consent.',
    },
    {
      question: 'How do you verify items before returning them?',
      answer:
        'We use a verification system where both parties must confirm certain details about the item. This prevents fraud and ensures legitimate transactions.',
    },
    {
      question: 'What if there\'s a dispute over an item?',
      answer:
        'Our support team mediates disputes using the verification information and item details provided. We aim to resolve issues fairly and quickly.',
    },
    {
      question: 'Can I delete my account?',
      answer:
        'Yes, you can request account deletion from your settings. Note that this is permanent and will remove all your data from our servers.',
    },
  ];

  const supportChannels = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get detailed help via email',
      contact: 'support@refind.com',
      link: 'mailto:support@refind.com',
    },
    {
      icon: Phone,
      title: 'Live Chat',
      description: 'Chat with our support team',
      contact: 'Available 9 AM - 9 PM EST',
      link: '#',
    },
    {
      icon: FileText,
      title: 'Knowledge Base',
      description: 'Browse our help articles',
      contact: 'Self-service resources',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="font-bold text-xl">Refind</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Support Center
        </h1>
        <p className="text-xl text-gray-600">
          We're here to help. Find answers to common questions or reach out to our team.
        </p>
      </div>

      {/* Support Channels */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">Get Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <a
                  key={idx}
                  href={channel.link}
                  className="bg-white p-8 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all"
                >
                  <Icon className="w-8 h-8 text-primary-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{channel.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{channel.description}</p>
                  <p className="font-medium text-primary-500">{channel.contact}</p>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-primary-500 transition-colors cursor-pointer"
            >
              <summary className="flex items-center justify-between font-semibold text-gray-900 cursor-pointer">
                <span>{faq.question}</span>
                <span className="text-primary-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Additional Help */}
      <div className="bg-primary-50 border-y border-primary-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-4">
            <HelpCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can't find what you're looking for?</h3>
              <p className="text-gray-600">
                Contact our support team directly at{' '}
                <a href="mailto:support@refind.com" className="text-primary-500 hover:text-primary-600 font-medium">
                  support@refind.com
                </a>{' '}
                and we'll get back to you within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
