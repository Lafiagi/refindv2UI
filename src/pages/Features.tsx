import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: 'Smart Item Matching',
      description: 'Our AI-powered system automatically matches descriptions to help finders locate owners.',
    },
    {
      title: 'Secure Messaging',
      description: 'Encrypted messaging platform ensures private communication between finders and owners.',
    },
    {
      title: 'Real-time Notifications',
      description: 'Get instant alerts when someone claims to have found your item.',
    },
    {
      title: 'Verification System',
      description: 'Built-in verification to ensure legitimate transactions and prevent fraud.',
    },
    {
      title: 'Item Tracking',
      description: 'Track your lost items through the entire recovery process.',
    },
    {
      title: 'Community Forum',
      description: 'Connect with others, share tips, and find helpful advice.',
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
          Powerful Features
        </h1>
        <p className="text-xl text-gray-600">
          Everything you need to find and recover your lost belongings.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Before vs After Refind</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">❌ Traditional Methods</h3>
              <ul className="space-y-3 text-gray-600">
                <li>Post on social media and hope</li>
                <li>Call venues directly</li>
                <li>Check lost and found offices</li>
                <li>No verification system</li>
                <li>No communication platform</li>
                <li>Time-consuming process</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">✅ Refind Platform</h3>
              <ul className="space-y-3 text-gray-600">
                <li>Targeted platform reach</li>
                <li>Automated venue connections</li>
                <li>Centralized database</li>
                <li>Verification for trust</li>
                <li>Secure messaging system</li>
                <li>Minutes, not months</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the Difference</h2>
          <Link
            to="/dashboard"
            className="inline-block bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Now
          </Link>
        </div>
      </div>
    </div>
  );
}
