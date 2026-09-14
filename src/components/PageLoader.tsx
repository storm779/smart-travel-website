export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-lilac-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
