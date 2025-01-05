import React from "react";
import { Navigation } from "../../components/navigation";
import { Header } from "../../components/header";
import { Features } from "../../components/features";
import { About } from "../../components/about"; 
import { Services } from "../../components/services";
import { Gallery } from "../../components/gallery";
import { Contact } from "../../components/contact";


const Homepage = () => {
    return (
      <div>
        <Navigation />
        <Header />
        <Gallery />
        <Features />
        <About />
        <Services />
        <Contact />
      </div>
    );
  };
  
  export default Homepage; 
  