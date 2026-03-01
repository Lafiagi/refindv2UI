import { Link } from 'react-router-dom';

export default function Press() {
  const pressReleases = [
    {
      date: 'February 15, 2026',
      title: 'Refind Launches AI-Powered Item Matching System',
      excerpt: 'Revolutionary matching algorithm improves success rate by 300% in identifying lost items.',
      link: '#',
    },
    {
      date: 'January 28, 2026',
      title: 'Refind Secures $10M Series A Funding',
      excerpt: 'Leading investors backing the future of lost and found technology.',
      link: '#',
    },
    {
      date: 'January 10, 2026',
      title: 'Refind Expands to 50 New Cities Worldwide',
      excerpt: 'Platform now available in all major metropolitan areas across North America and Europe.',
      link: '#',
    },
    {
      date: 'December 15, 2025',
      title: 'Featured in TechCrunch: "How Refind is Solving a Billion-Dollar Problem"',
      excerpt: 'Deep dive into our technology and impact on the lost and found industry.',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Press Center
        </h1>
        <p className="text-xl text-gray-600">
          Latest news, press releases, and media coverage about Refind.
        </p>
      </div>

      {/* Press Contact */}
      <div className="bg-primary-50 border-l-4 border-primary-500 py-8 px-6 mb-16 sm:mx-auto max-w-4xl rounded">
        <h3 className="font-semibold text-gray-900 mb-2">For Media Inquiries</h3>
        <p className="text-gray-600">
          Contact our press team at{' '}
          <a href="mailto:press@refind.com" className="text-primary-500 hover:text-primary-600 font-medium">
            press@refind.com
          </a>
        </p>
      </div>

      {/* Press Releases */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Press Releases</h2>
        <div className="space-y-6">
          {pressReleases.map((release, idx) => (
            <article
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <p className="text-sm text-gray-500 mb-3 font-medium">{release.date}</p>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-500">
                <a href={release.link}>{release.title}</a>
              </h3>
              <p className="text-gray-600 mb-4">{release.excerpt}</p>
              <a
                href={release.link}
                className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center"
              >
                Read More →
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* Media Kit CTA */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Our Media Kit?</h2>
          <p className="text-gray-600 mb-6">Download our brand guidelines, logos, and company information.</p>
          <button className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
            Download Media Kit
          </button>
        </div>
      </div>
    </div>
  );
}
