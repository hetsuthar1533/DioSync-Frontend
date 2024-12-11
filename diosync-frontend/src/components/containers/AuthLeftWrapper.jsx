import React from "react";
import Logo from "../../assets/images/logo.svg";
import Paragraph from "../core/typography/Paragraph";
import DashboardScreen from "../../assets/images/dashboard_screen.png";

function AuthLeftWrapper() {
  return (
    <div className="bg-primary-blue/5 p-4 md:p-6 lg:p-8 lg:rounded-[20px] rounded-2xl flex flex-col items-start justify-center lg:min-h-[calc(100vh-112px)] sm:min-h-[calc(100vh-64px)] min-h-[calc(100vh-48px)]">
      <div className="mb-14">
        <img src={Logo} alt="logo" width="32px" height="32px" />
      </div>
      <Paragraph text24 className={"mb-8"}>
        Start Your Journey With Us.
      </Paragraph>
      <div>
        <img
          src={DashboardScreen}
          alt="dashboard_mockup"
          width="586px"
          height="430px"
        />
      </div>
    </div>
  );
}

export default AuthLeftWrapper;
