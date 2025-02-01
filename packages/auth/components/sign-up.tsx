import { SignUp as ClerkSignUp } from "@clerk/nextjs";

export const SignUp = () => (
  <ClerkSignUp
    forceRedirectUrl="/dashboard"
    appearance={{
      elements: {
        header: "hidden",
      },
    }}
  />
);
