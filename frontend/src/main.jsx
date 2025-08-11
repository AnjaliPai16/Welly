import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css" // This is the main entry for Tailwind CSS
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
