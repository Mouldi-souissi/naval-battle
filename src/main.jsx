import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "./gameLogic/Context";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);
