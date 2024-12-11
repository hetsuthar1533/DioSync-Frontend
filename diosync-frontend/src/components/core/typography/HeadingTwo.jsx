import React from "react";

function HeadingTwo({ children, className }) {
  return (
    <h2
      className={`lg:text-[52px] lg:leading-[64px] md:text-[40px] md:leading-[54px] sm:text-[34px] sm:leading-[46px] text-[28px] leading-[36px] font-bold ${
        className ? className : ""
      }`}
    >
      {children}
    </h2>
  );
}

export default HeadingTwo;
