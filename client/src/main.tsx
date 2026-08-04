import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root")!;

// Blog routes are prerendered at build time (scripts/blog/prerender.mjs)
// with real static HTML baked into #root for crawlers/no-JS clients.
// When that markup is present we hydrate over it instead of clobbering it
// with a fresh client render.
if (rootEl.hasAttribute("data-prerendered")) {
  hydrateRoot(rootEl, <App />);
} else {
  createRoot(rootEl).render(<App />);
}
