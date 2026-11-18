import React, { Component } from 'react'

export class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-semibold text-ink">Something went wrong</h2>
          <p className="mt-2 text-sm text-graphite">
            The page encountered an unexpected issue, but your data is safe.
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="mt-4 rounded-full bg-azure px-5 py-2 text-sm font-medium text-white hover:bg-azure-deep transition"
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
