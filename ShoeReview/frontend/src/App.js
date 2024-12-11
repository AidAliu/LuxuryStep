import React from "react";
import ShoeList from "./components/ShoeList";
import ShoeForm from "./components/ShoeForm";

function App() {
    return (
        <div>
            <h1>Shoe Review</h1>
            <ShoeForm />
            <ShoeList />
        </div>
    );
}

export default App;
