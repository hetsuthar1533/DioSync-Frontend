import React from "react";

function HeadingFour({ className, children }) {
  return (
    <h4
      className={`lg:text-[36px] lg:leading-[48px] md:text-[34px] md:leading-[46px] sm:text-[30px] sm:leading-[42px] text-[26px] leading-[34px] font-semibold ${
        className ? className : ""
      }`}
    >
      {children}
    </h4>
  );
}

export default HeadingFour;
