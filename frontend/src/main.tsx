import React from "react";
import ReactDOM from "react-dom/client";
import Test from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Test />
    </Router>
  </React.StrictMode>
);
