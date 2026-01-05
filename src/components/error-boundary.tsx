import React, { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Global Error Boundary Component
 * Catches and displays errors in child components gracefully
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("Error caught by boundary:", error);
      console.error("Error info:", info);
    }

    // You can also log the error to an error reporting service here
    // logErrorToService(error, info);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="w-full max-w-md space-y-4">
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
              <h2 className="text-lg font-semibold text-destructive mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                An unexpected error occurred. Please try refreshing the page.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <details className="text-xs text-muted-foreground mb-4 cursor-pointer">
                  <summary className="mb-2 font-mono">Error details</summary>
                  <pre className="bg-muted p-2 rounded overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Refresh Page
                </button>
                <button
                  onClick={this.resetError}
                  className="flex-1 px-4 py-2 border border-border rounded hover:bg-muted transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              If the problem persists, please contact support
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
