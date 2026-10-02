import { Component, type ReactNode } from "react";
import { useGoogleAnalytics } from "@/hooks/use-google-analytics";

function AnalyticsTracker() {
  useGoogleAnalytics();
  return null;
}

class AnalyticsErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) {
      console.warn("[GoogleTagLoader] Suppressed analytics initialization error:", error);
    }
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/**
 * Component mounted at the root shell to initialize Google Tag & GA4 tracking.
 * Wrapped in an error boundary so analytics never breaks page rendering or causes a blank screen.
 */
export function GoogleTagLoader() {
  return (
    <AnalyticsErrorBoundary>
      <AnalyticsTracker />
    </AnalyticsErrorBoundary>
  );
}
