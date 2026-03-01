import { Check } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'List up to 3 lost items',
        'View found items in your area',
        'Basic messaging',
        'Mobile app access',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$4.99',
      period: '/month',
      description: 'For serious users',
      features: [
        'Unlimited lost item listings',
        'Advanced search filters',
        'Priority notifications',
        'Secure messaging with verification',
        'Item tracking history',
        'Premium support',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For organizations and venues',
      features: [
        'Multi-location management',
        'Team collaboration tools',
        'Custom branding',
        'API access',
        'Advanced analytics',
        'Dedicated account manager',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Choose the plan that's right for you. No hidden fees.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-8 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-orange-600 to-rose-600 text-white transform scale-105'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={plan.highlighted ? 'text-primary-100 text-sm' : 'text-gray-600 text-sm'}>
                {plan.description}
              </p>

              <div className="my-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className={plan.highlighted ? 'text-primary-100' : 'text-gray-600'}>{plan.period}</span>}
                </div>
              </div>

              <button
                className={`w-full py-3 rounded-lg font-semibold mb-8 transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-primary-500 hover:bg-gray-100'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                {plan.cta}
              </button>

              <ul className={`space-y-4 ${plan.highlighted ? 'text-primary-50' : 'text-gray-600'}`}>
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-gray-600">
                Yes! You can change your plan anytime. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial for Pro?</h3>
              <p className="text-gray-600">
                Yes, Pro members get a 14-day free trial before being charged.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, Apple Pay, Google Pay, and bank transfers for enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Absolutely. Cancel your subscription anytime with no penalties or hidden fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
