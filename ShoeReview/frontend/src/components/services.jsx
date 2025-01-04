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

  // Inline style for the section
  const sectionStyle = {
    backgroundImage: "url('/img/services.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    color: "#fff",
    padding: "50px 0",
    position: "relative",
  };

  // Inline style for the overlay
  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Faded overlay effect
    zIndex: 1,
  };

  // Inline style for the content container
  const containerStyle = {
    position: "relative",
    zIndex: 2, // Ensure content is above the overlay
  };

  return (
    <div id="services" style={sectionStyle}>
      <div style={overlayStyle}></div>
      <div className="container text-center" style={containerStyle}>
        <div className="section-title mb-5">
          <h2>Our Services</h2>
          <p>
            Discover premium services designed to enhance your shopping journey
            with comfort, speed, and trust.
          </p>
        </div>
        <div className="row">
          {servicesData.map((service, index) => (
            <div
              key={`${service.name}-${index}`}
              className="col-md-4 mb-4"
            >
              <i
                className={service.icon}
                style={{
                  fontSize: "3rem",
                  color: "#fff",
                  marginBottom: "20px",
                }}
              ></i>
              <div className="service-desc">
                <h3 style={{ fontWeight: "bold" }}>{service.name}</h3>
                <p>{service.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
