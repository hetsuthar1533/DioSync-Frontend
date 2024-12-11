import React from "react";

function HeadingSix({ className, children }) {
  return (
    <h5
      className={`md:text-[24px] md:leading-[36px] text-[20px] leading-[30px] font-semibold ${
        className ? className : ""
      }`}
    >
      {children}
    </h5>
  );
}

export default HeadingSix;
