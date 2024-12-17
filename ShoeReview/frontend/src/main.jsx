// src/views/Main.jsx
import React from "react";
import { Navigation } from "../components/navigation";
import { Header } from "../components/header";
import { Features } from "../components/features";
import { About } from "../components/about";
import { Services } from "../components/services";
import { Gallery } from "../components/gallery";
import { Contact } from "../components/contact";
import JsonData from "../data/data.json";

const Main = () => {
  return (
    <div>
      <Navigation />
      <Header data={JsonData.Header} />
      <Features data={JsonData.Features} />
      <About data={JsonData.About} />
      <Services data={JsonData.Services} />
      <Gallery data={JsonData.Gallery} />
      <Contact data={JsonData.Contact} />
    </div>
  );
};

export default Main;
