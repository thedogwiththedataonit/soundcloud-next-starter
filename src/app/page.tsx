import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-white mb-4">
              SoundCloud Search
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Discover amazing music from SoundCloud's vast library
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="text-lg font-semibold mb-2">Search Tracks</h3>
              <p className="text-orange-100 text-sm">
                Find your favorite songs, discover new artists, and explore genres
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Fast Results</h3>
              <p className="text-orange-100 text-sm">
                Get instant search results with server-side rendering
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Smart Pagination</h3>
              <p className="text-orange-100 text-sm">
                Browse through thousands of tracks with easy navigation
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Link
              href="/search"
              className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold text-lg rounded-lg hover:bg-orange-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
            >
              Start Searching Music
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="text-orange-100 text-sm">
              No account required • Powered by SoundCloud API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
