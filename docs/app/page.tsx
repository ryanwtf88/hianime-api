
export default function Home() {
  return (
    <div className="prose max-w-none">
      <h1>HiAnime API Documentation</h1>

      <p>
        Welcome to the unofficial HiAnime API documentation. This API allows you to scrape and retrieve anime data
        from HiAnime (formerly AniWatch).
      </p>

      <h2>Base URL</h2>
      <pre><code>http://localhost:3030/api/v1</code></pre>
      <p>
        (Or wherever you deploy this API)
      </p>

      <h2>Response Format</h2>
      <p>
        All responses are returned in JSON format.
      </p>
      <pre><code>{`{
  "status": 200,
  "message": "Success",
  "data": { ... }
}`}</code></pre>

      <h2>Getting Started</h2>
      <p>
        Use the sidebar to navigate through the different endpoints.
      </p>
    </div>
  );
}
