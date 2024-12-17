import React from "react";
import { Navigation } from "../../components/navigation";
import { Header } from "../../components/header";
import { Features } from "../../components/features";
import { About } from "../../components/about"; 
import { Services } from "../../components/services";
import { Gallery } from "../../components/gallery";
import { Contact } from "../../components/contact";
import { Profile } from "../../components/profile";


const Homepage = () => {
    return (
      <div>
        <Navigation />
        <Header />
        <Features />
        <About />
        <Services />
        <Gallery />
        <Profile />
        <Contact />
      </div>
    );
  };
  
  export default Homepage; 
  