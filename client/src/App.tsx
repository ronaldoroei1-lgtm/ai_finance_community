import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
const Admin = lazy(() => import("@/pages/Admin"));
import Site from "@/redesign/Site";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// The redesign (client/src/redesign/Site.tsx) owns its own routing: it
// takes the raw path and matches he/ and /en/-prefixed routes itself (see
// routeInfo() in Site.tsx). App.tsx only needs to hand off the current
// wouter location and keep /admin on the legacy Admin page.
function SiteRoute() {
  const [location] = useLocation();
  return <Site path={location} />;
}

function Router() {
  return (
    <Switch>
      <Route path={"/admin"} component={Admin} />
      {/* Every other path - home, services, community, knowledge/blog,
          about, contact, accessibility, the /en mirror, and 404 - is
          handled inside <Site/> via routeInfo(). */}
      <Route component={SiteRoute} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={<p role="status">AI Finance…</p>}><Router /></Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
