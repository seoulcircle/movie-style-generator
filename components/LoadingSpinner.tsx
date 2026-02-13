export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-transparent border-t-gray-800 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-900 text-base font-medium mb-1">
        Generating...
      </p>
      <p className="text-gray-500 text-sm">
        Please wait
      </p>
    </div>
  );
}
