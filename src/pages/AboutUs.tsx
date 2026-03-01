import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          About Refind
        </h1> */}
        <p className="text-xl text-gray-600 leading-relaxed ">
          Refind is revolutionizing the way people reconnect with their lost belongings. <br /> We believe that everyone deserves a second chance to find what matters to them.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-50 pb-10 sm:pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Our mission is to create a trustworthy, efficient platform that bridges the gap between lost items and their owners. We leverage modern technology to make the process of finding lost belongings faster, easier, and more secure.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Whether it's a phone left in a taxi, keys misplaced at a venue, or a valuable item lost in transit, Refind connects finders with owners in a secure and transparent manner.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Security</h3>
            <p className="text-gray-600">
              We prioritize the security and privacy of our users. Every transaction and interaction is protected with industry-standard encryption.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
            <p className="text-gray-600">
              We believe in open communication with our community. Our processes are clear and straightforward, with no hidden fees or complications.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
            <p className="text-gray-600">
              We're building a community of honest, helpful people. By working together, we can help more people recover their lost items.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
            <p className="text-gray-600">
              We continuously improve our platform to make it easier and more effective for users to find and return lost belongings.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className=" py-16 bg-gradient-to-br from-orange-600 to-rose-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find what you're looking for?</h2>
          <Link
            to="/dashboard"
            className="inline-block bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
