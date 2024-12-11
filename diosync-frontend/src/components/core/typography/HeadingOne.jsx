import React from "react";

function HeadingOne({ children, className }) {
  return (
    <h1
      className={`lg:text-[58px] lg:leading-[72px] md:text-[42px] md:leading-[54px] sm:text-[36px] sm:leading-[46px] text-[32px] leading-[40px] font-bold ${
        className ? className : ""
      }`}
    >
      {children}
    </h1>
  );
}

export default HeadingOne;
