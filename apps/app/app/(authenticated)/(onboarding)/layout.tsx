"use client";
import { type ReactNode } from "react";

type Props = {
  readonly children: ReactNode;
};

const OnBoardingLayout = ({ children }: Props) => {
  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default OnBoardingLayout;
