import React from "react";

export const Features = () => {
  const featuresData = [
    {
      icon: "fa fa-comments",
      title: "Customer Support",
      text: "24/7 support to ensure a seamless and stress-free shopping experience.",
    },
    {
      icon: "fa fa-bullhorn",
      title: "Latest Trends",
      text: "Stay ahead of the curve with shoes designed for modern style and elegance.",
    },
    {
      icon: "fa fa-users",
      title: "Community Focus",
      text: "We prioritize customer feedback to deliver what you truly need.",
    },
    {
      icon: "fa fa-magic",
      title: "Exquisite Design",
      text: "Unique, sophisticated designs crafted to make every step stylish.",
    },
  ];

  return (
    <div id="features" className="text-center">
      <div className="container">
        <div className="col-md-10 col-md-offset-1 section-title">
          <h2>Features</h2>
        </div>
        <div className="row">
          {featuresData.map((d, i) => (
            <div key={`${d.title}-${i}`} className="col-xs-6 col-md-3">
              <i className={d.icon}></i>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
