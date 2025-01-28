import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";

const title = "Create an account";
const description = "Enter your details to get started.";

import { SignUp } from "@repo/auth/components/sign-up";

export const metadata: Metadata = createMetadata({ title, description });

const SignUpPage = () => (
  <>
    <SignUp />
  </>
);

export default SignUpPage;
