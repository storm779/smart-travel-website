import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-3xl shadow-xl p-10">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 font-kugile">
                Something went wrong
              </h2>
              <p className="text-gray-500 mb-8 text-sm">
                We encountered an unexpected error. Please try refreshing or go back to the home page.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition font-medium text-sm">
                  <RotateCcw className="h-4 w-4" />
                  Refresh
                </button>
                <a
                  href="/"
                  className="flex items-center gap-2 px-5 py-2.5 bg-lilac-600 hover:bg-lilac-700 text-white rounded-xl transition font-medium text-sm">
                  <Home className="h-4 w-4" />
                  Go Home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
