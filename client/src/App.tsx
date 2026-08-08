import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";
import ServicesAIWorkshops from "@/pages/ServicesAIWorkshops";
import ServicesWorkshopsB2B from "@/pages/ServicesWorkshopsB2B";
import ServicesLectures from "@/pages/ServicesLectures";
import ServicesProcessMapping from "@/pages/ServicesProcessMapping";
import Community from "@/pages/Community";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/blog"} component={BlogIndex} />
      <Route path={"/blog/"} component={BlogIndex} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/blog/:slug/"} component={BlogPost} />
      <Route path={"/services/ai-workshops-for-finance"} component={ServicesAIWorkshops} />
      <Route path={"/services/ai-workshops-for-finance/"} component={ServicesAIWorkshops} />
      <Route path={"/services/ai-workshops-finance-teams"} component={ServicesWorkshopsB2B} />
      <Route path={"/services/ai-workshops-finance-teams/"} component={ServicesWorkshopsB2B} />
      <Route path={"/community"} component={Community} />
      <Route path={"/community/"} component={Community} />
      <Route path={"/services/ai-lectures-executives"} component={ServicesLectures} />
      <Route path={"/services/ai-lectures-executives/"} component={ServicesLectures} />
      <Route path={"/services/ai-process-mapping-finance"} component={ServicesProcessMapping} />
      <Route path={"/services/ai-process-mapping-finance/"} component={ServicesProcessMapping} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <FloatingWhatsApp />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
