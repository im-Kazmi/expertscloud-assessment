"use client";
import {
  CreateOrganization,
  RedirectToSignIn,
  UserButton,
  useUser,
} from "@repo/auth/client";
import { type ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@repo/auth/client";
import { useOrganization, useOrganizationList } from "@repo/auth/client";
import { redirect } from "next/navigation";
import { Button } from "@repo/design-system/components/ui/button";
import { IsClientComponent } from "@/app/components/shared/is-only-client";

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProperties) => {
  const { user, isSignedIn } = useUser();

  const router = useRouter();

  const { membership, organization, isLoaded } = useOrganization({
    memberships: true,
  });

  if (!isSignedIn) {
    RedirectToSignIn({});
  }

  if (isSignedIn && isLoaded && (!membership || !organization)) {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen">
        <CreateOrganization afterCreateOrganizationUrl={"/dashboard"} />
      </div>
    );
  }

  return (
    <IsClientComponent>
      <div className="p-10 flex min-h-[100vh]  flex-1 flex-col gap-4 bg-muted/50 ">
        <div className="flex justify-between w-full">
          <div className="flex gap-x-3">
            <Button variant={"ghost"} size={"icon"}>
              <img alt="logo" src="../../../icon.png" className="size-8" />
            </Button>
            <OrganizationSwitcher />
          </div>
          <UserButton />
        </div>
        <div className=" flex-1  rounded-xl md:min-h-min p-5">{children}</div>
      </div>
    </IsClientComponent>
  );
};

export default AppLayout;
