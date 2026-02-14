export default function Home() {
  return (
    <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
      <div className="not-prose mb-8 sm:mb-10 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
          HiAnime API Documentation
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
          Unofficial API for scraping anime data from HiAnime (formerly AniWatch)
        </p>
      </div>

      {/* Feature Cards - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 not-prose mb-10 sm:mb-12">
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-blue-600 mb-3">
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Fast & Reliable</h3>
          <p className="text-sm sm:text-base text-gray-600">Built with Bun and Hono for maximum performance</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-blue-600 mb-3">
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Complete Coverage</h3>
          <p className="text-sm sm:text-base text-gray-600">Access anime details, episodes, streaming links, and more</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="text-blue-600 mb-3">
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Easy Integration</h3>
          <p className="text-sm sm:text-base text-gray-600">Simple REST API with JSON responses</p>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl">Base URL</h2>
      <div className="overflow-x-auto">
        <pre className="text-xs sm:text-sm"><code>https://your-deployment-url.com/api/v1</code></pre>
      </div>
      <p className="text-sm text-gray-600">
        Replace with your actual deployment URL (localhost:3030 for local development)
      </p>

      <h2 className="text-2xl sm:text-3xl">Quick Start</h2>
      <p>Get started with a simple request:</p>
      <div className="overflow-x-auto">
        <pre className="text-xs sm:text-sm"><code className="language-bash">{`curl https://your-api-url.com/api/v1/home`}</code></pre>
      </div>

      <h2 className="text-2xl sm:text-3xl">Response Format</h2>
      <p>All responses follow a consistent JSON structure:</p>
      <div className="overflow-x-auto">
        <pre className="text-xs sm:text-sm"><code className="language-json">{`{
  "success": true,
  "data": {
    // Response data here
  }
}`}</code></pre>
      </div>

      <h2 className="text-2xl sm:text-3xl">Navigation</h2>
      <p>
        Use the sidebar to explore different endpoint categories. Each section includes detailed
        documentation with request examples and response schemas.
      </p>
    </div>
  );
}
