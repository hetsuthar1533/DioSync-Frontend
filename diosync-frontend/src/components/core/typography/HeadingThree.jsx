import React from "react";

function HeadingThree({ className, children }) {
  return (
    <h3
      className={`lg:text-[42px] lg:leading-[54px] md:text-[36px] md:leading-[48px] sm:text-[30px] sm:leading-[42px] text-[26px] leading-[34px] font-bold ${
        className ? className : ""
      }`}
    >
      {children}
    </h3>
  );
}

export default HeadingThree;
