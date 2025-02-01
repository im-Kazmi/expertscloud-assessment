import { SignIn as ClerkSignIn } from "@clerk/nextjs";

export const SignIn = ({
  fallbackRedirectUrl,
}: {
  fallbackRedirectUrl?: string;
}) => (
  <ClerkSignIn
    appearance={{
      elements: {
        header: "hidden",
      },
    }}
  />
);
