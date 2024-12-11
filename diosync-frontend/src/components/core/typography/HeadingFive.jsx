import React from "react";

function HeadingFive({ children, className }) {
  return (
    <h5
      className={`md:text-[30px] md:leading-[42px] sm:text-[28px] sm:leading-[40px] text-[24px] leading-[32px] font-semibold ${
        className ? className : ""
      }`}
    >
      {children}
    </h5>
  );
}

export default HeadingFive;
