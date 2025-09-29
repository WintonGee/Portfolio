import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-6">
          Project Case Study Not Found
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The project case study you're looking for doesn't exist or has been
          moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Portfolio
        </Link>
      </div>
    </main>
  );
}
