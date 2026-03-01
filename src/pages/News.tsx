export default function News() {
  const articles = [
    {
      date: 'February 20, 2026',
      category: 'Updates',
      title: 'New Mobile App Features Released',
      excerpt: "We've added offline mode, improved search, and faster notifications to help you find items even faster.",
      link: '#',
      image: '📱',
    },
    {
      date: 'February 15, 2026',
      category: 'Success Stories',
      title: "From Lost to Found: Sarah's Recovered Heirloom Ring",
      excerpt: 'A heartwarming story of how Refind helped reunite a family with their precious heirloom.',
      link: '#',
      image: '💍',
    },
    {
      date: 'February 10, 2026',
      category: 'Product',
      title: 'Introducing Smart Photo Recognition',
      excerpt: 'Upload a photo of your lost item and our AI will help identify similar items on the platform.',
      link: '#',
      image: '🔍',
    },
    {
      date: 'February 5, 2026',
      category: 'Community',
      title: 'Community Spotlight: Top Finders This Month',
      excerpt: "Meet the amazing people who've helped return over 100 items to their owners this month.",
      link: '#',
      image: '⭐',
    },
    {
      date: 'January 30, 2026',
      category: 'Tips',
      title: '10 Tips for Preventing Lost Items',
      excerpt: 'Practical advice to keep your belongings safe and reduce the chances of losing them.',
      link: '#',
      image: '💡',
    },
    {
      date: 'January 25, 2026',
      category: 'Partnership',
      title: 'Partnership with Major Airlines Announced',
      excerpt: 'Refind now integrates with leading airlines to help recover lost luggage and items.',
      link: '#',
      image: '✈️',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Latest News
        </h1>
        <p className="text-xl text-gray-600">
          Stay updated with product releases, success stories, and tips.
        </p>
      </div>

      {/* News Articles */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-6">
          {articles.map((article, idx) => (
            <article
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow flex gap-6"
            >
              <div className="text-4xl flex-shrink-0">{article.image}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <p className="text-sm text-gray-500">{article.date}</p>
                  <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium w-fit">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-500">
                  <a href={article.link}>{article.title}</a>
                </h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <a
                  href={article.link}
                  className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center"
                >
                  Read More →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-primary-50 border-t border-gray-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest news and updates.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
