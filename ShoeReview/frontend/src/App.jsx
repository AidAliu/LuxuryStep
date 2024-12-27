import React from "react";
import Router from "./router/Router";
import { Navigation } from "./components/navigation";

const App = () => {
  return (
    <div>
      <Router >
        <Navigation/>
        </Router>
      
    </div>
  );
};

export default App;
