import React from "react";
import "../index.css";

const Banner = () => {
  return (
    <div className="banner-container">
      <div className="banner-text">
        <h2>50% ფასდაკლება პადელის კორტებზე</h2>
        <p>საბურთალო, ვაკე, დიდუბე, ისანი, მუხიანი.</p>
        <button className="banner-btn">დაჯავშნე</button>
      </div>
      <div className="banner-image">
        <img 
          src="./images/bruno-vaccaro-vercellino-0zKlQ_X7_zY-unsplash 1.png" 
          alt="Banner" 
        />
      </div>
    </div>
  );
};

export default Banner;
