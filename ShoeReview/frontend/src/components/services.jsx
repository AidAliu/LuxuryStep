import React from "react";

export const Services = () => {
  const servicesData = [
    {
      icon: "fa fa-shopping-cart",
      name: "Seamless Shopping",
      text: "Enjoy an intuitive and hassle-free shopping experience, tailored just for you.",
    },
    {
      icon: "fa fa-truck",
      name: "Fast Delivery",
      text: "Get your products delivered quickly and reliably to your doorstep.",
    },
    {
      icon: "fa fa-thumbs-up",
      name: "Top Quality Assurance",
      text: "Our shoes are crafted with premium materials to ensure style, comfort, and durability.",
    },
    {
      icon: "fa fa-credit-card",
      name: "Secure Payments",
      text: "Make worry-free purchases with our secure and trusted payment options.",
    },
    {
      icon: "fa fa-refresh",
      name: "Easy Returns",
      text: "Hassle-free return and exchange policy for your peace of mind.",
    },
    {
      icon: "fa fa-star",
      name: "Exceptional Value",
      text: "High-quality footwear at prices that provide unbeatable value.",
    },
  ];

  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>
            Discover premium services designed to enhance your shopping journey
            with comfort, speed, and trust.
          </p>
        </div>
        <div className="row">
          {servicesData.map((d, i) => (
            <div key={`${d.name}-${i}`} className="col-md-4">
              <i className={d.icon}></i>
              <div className="service-desc">
                <h3>{d.name}</h3>
                <p>{d.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
