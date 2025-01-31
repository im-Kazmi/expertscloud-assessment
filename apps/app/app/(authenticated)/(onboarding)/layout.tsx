"use client";
import { type ReactNode } from "react";

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const OnBoardingLayout = ({ children }: OnBoardingLayoutProperties) => {
  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default AppLayout;
