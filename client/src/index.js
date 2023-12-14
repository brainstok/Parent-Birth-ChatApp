import "./index.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import React, { Profiler } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const handleRender = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
  console.log("~~~~~~~", id, phase, actualDuration, baseDuration, startTime, commitTime)
}

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={`${window.location.origin}/chat`}
    audience={"https://robyn/api"}
  >
    {process.env.REACT_APP_ENVIRONMENT !== "production" && (
      <div className="staging">👋 You're are using the Staging App</div>
    )}
    <Profiler id="App" onRender={handleRender}>
      <App />
    </Profiler>
  </Auth0Provider>,
  document.getElementById("root")
);
