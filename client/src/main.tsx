import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./redesign/site.css";
import "./redesign/art-direction.css";
// Static page content remains available to crawlers and without JavaScript.
createRoot(document.getElementById("root")!).render(<App />);
