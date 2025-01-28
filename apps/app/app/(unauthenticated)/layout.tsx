import type { ReactNode } from "react";

type AuthLayoutProps = {
  readonly children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="min-w-screen min-h-screen flex items-center justify-center">
    {children}
  </div>
);

export default AuthLayout;
