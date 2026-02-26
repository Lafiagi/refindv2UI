import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, ShieldCheckIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-24 lg:pt-16 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6">
                <span className="flex h-2 w-2 rounded-full bg-orange-600 mr-2 animate-pulse"></span>
                Now available in your city
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
                Lost something? <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                  Lets find it.
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Refind connects communities to recover lost valuables. From keys to phones, securely report and reclaim your items with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/items/report/lost" className="btn-primary text-lg px-8 py-4">
                  I Lost Something
                </Link>
                <Link to="/items" className="btn-secondary text-lg px-8 py-4">
                  Browse Found Items
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-slate-500">
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="h-6 w-6" />
                  <span className="font-semibold">10k+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-6 w-6" />
                  <span className="font-semibold">Verified Matches</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-slate-100">
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-xl animate-bounce">
                  <MapPinIcon className="h-8 w-8 text-orange-500" />
                </div>
                <img
                  src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="Lost and Found"
                  className="rounded-2xl w-full h-[400px] object-cover"
                />
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Recent Match</p>
                    <p className="text-lg font-bold text-slate-900">iPhone 14 Pro</p>
                  </div>
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-bold text-sm">
                    Reclaimed
                  </span>
                </div>
              </div>

              {/* Decorative blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-200/30 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How Refind Works</h2>
            <p className="text-slate-600 text-lg">Our smart matching system works around the clock to connect lost items with their owners.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="glass-panel p-8 rounded-3xl text-center relative z-10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MagnifyingGlassIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Report</h3>
              <p className="text-slate-500 leading-relaxed">
                Provide details about your lost or found item. Visuals and location help speed up the process.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl text-center relative z-10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Match</h3>
              <p className="text-slate-500 leading-relaxed">
                Our AI algorithms compare descriptions and images to find potential matches in real-time.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl text-center relative z-10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPinIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Recover</h3>
              <p className="text-slate-500 leading-relaxed">
                Verify ownership through our secure chat and arrange a safe pickup or delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands of Happy Users</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Real stories from real people who found their lost belongings using Refind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "I thought I'd lost my grandmother's necklace forever. Refind connected me with a kind soul who found it two days later!",
                user: "Sarah Jenkins",
                role: "Found Jewelry",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                text: "The community here is amazing. I reported a lost wallet and within hours someone had spotted it near the park entrance.",
                user: "Michael Chen",
                role: "Recovered Wallet",
                image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                text: "As a frequent traveler, this app gives me peace of mind. The 'Vault' feature is brilliant for keeping track of my gear.",
                user: "Emily Rodriguez",
                role: "Frequent Traveler",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                <div className="absolute top-8 right-8 text-orange-200">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.096 14.017 14.742 14.453 13.937C14.906 13.101 15.651 12.632 16.686 12.532V11.237C16.143 11.237 15.665 10.99 15.251 10.496C14.869 9.972 14.678 9.3 14.678 8.479C14.678 7.418 15.009 6.64 15.671 6.145C16.333 5.621 17.154 5.359 18.134 5.359C17.929 5.359 18.232 5.38 19.043 5.38V12.112C19.043 15.21 18.329 17.589 16.901 19.248C15.473 20.907 16.623 21 14.017 21ZM5 21L5 18C5 16.096 5 14.742 5.435 13.937C5.888 13.101 6.633 12.632 7.668 12.532V11.237C7.125 11.237 6.647 10.99 6.233 10.496C5.851 9.972 5.66 9.3 5.66 8.479C5.66 7.418 5.991 6.64 6.653 6.145C7.315 5.621 8.136 5.359 9.116 5.359C8.911 5.359 9.214 5.38 10.025 5.38V12.112C10.025 15.21 9.311 17.589 7.883 19.248C6.455 20.907 7.605 21 5 21Z" /></svg>
                </div>
                <p className="text-slate-600 mb-6 italic relative z-10">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.user} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900">{t.user}</h4>
                    <p className="text-xs text-orange-500 font-semibold uppercase">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download (Card Style) */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-600 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-16">
              <div className="relative z-10 text-white">
                <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500 border border-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
                  Our Application
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                  Best platform to find <br />
                  your missing items
                </h2>
                <p className="text-lg text-orange-100 mb-8 max-w-lg leading-relaxed">
                  Experience the power of Refind on the go! List items, scan codes, and get real-time notifications right from your pocket.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-900 transition-colors shadow-lg">
                    <div className="text-2xl"></div>
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold leading-none">Download on the</div>
                      <div className="text-sm font-bold leading-tight">App Store</div>
                    </div>
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-900 transition-colors shadow-lg">
                    <div className="text-2xl">▶</div>
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold leading-none">Get it on</div>
                      <div className="text-sm font-bold leading-tight">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative z-10 flex justify-center lg:justify-end mt-8 md:mt-0">
                <div className="relative group perspective-1000">
                  <div className="absolute -inset-4 bg-orange-500 rounded-full blur-3xl opacity-50"></div>
                  <img
                    src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                    alt="App Mockup"
                    className="relative w-72 lg:w-[400px] drop-shadow-2xl rounded-3xl transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section (Light Style) */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-600 font-bold tracking-wider uppercase text-sm mb-2 block">Newsletter</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Stay Updated with Refind</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto text-lg">
            Get the latest updates, success stories, and priority listing alerts directly to your inbox.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
            />
            <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
              Subscribe
            </button>
          </form>
          <p className="text-slate-400 text-sm mt-6">
            Join 10,000+ subscribers. No spam, ever.
          </p>
        </div>
      </section>

      {/* CTA (Vibrant Gradient Style) */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-rose-600"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
            Ready to find your belongings?
          </h2>
          <p className="text-orange-100 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the fastest-growing lost & found community today. Secure your valuables and help others in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register" className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-xl shadow-orange-900/20 text-lg transform hover:-translate-y-1">
              Get Started Free
            </Link>
            <Link to="/items" className="bg-orange-800/30 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl font-bold hover:bg-orange-800/40 transition-all text-lg">
              Browse Items
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
