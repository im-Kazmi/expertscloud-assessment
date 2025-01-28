import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const title = "Welcome back";
const description = "Enter your details to sign in.";

import { SignIn } from "@repo/auth/components/sign-in";

export const metadata: Metadata = createMetadata({ title, description });

const SignInPage = () => (
  <>
    <SignIn fallbackRedirectUrl="/dashboard" />
  </>
);

export default SignInPage;
