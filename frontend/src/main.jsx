import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css" // This is the main entry for Tailwind CSS
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"
import { PlaylistProvider } from "./contexts/PlaylistContext" // Added PlaylistProvider import
import { AuthProvider } from "./contexts/AuthContext" // Added AuthProvider import

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PlaylistProvider>
          {" "}
          {/* Wrapped App with PlaylistProvider for global playlist state */}
          <App />
        </PlaylistProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
