import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "./index.css";

// load local env-vars
import "./config";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
