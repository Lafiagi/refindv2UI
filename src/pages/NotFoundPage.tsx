export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-primary-600">404</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Page not found</h1>
        <p className="mt-2 text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="/" className="btn btn-primary">Go home</a>
          <a href="/items" className="btn btn-secondary">Browse items</a>
        </div>
      </div>
    </div>
  );
}
