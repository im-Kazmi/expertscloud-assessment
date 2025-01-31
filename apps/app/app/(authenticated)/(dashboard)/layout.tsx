"use client";
import { RedirectToSignIn, useUser } from "@repo/auth/client";
import { type ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { OrganizationSwitcher } from "@repo/auth/client";
import { useOrganization, useOrganizationList } from "@repo/auth/client";
import { redirect } from "next/navigation";

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProperties) => {
  const { user, isSignedIn } = useUser();

  const { membership, organization, isLoaded } = useOrganization({
    memberships: true,
  });

  const { setActive } = useOrganizationList();

  if (!isSignedIn) {
    RedirectToSignIn({});
  }

  if (isSignedIn && isLoaded && (!membership || !organization)) {
    return redirect("/create-org");
  }

  return (
    <div className="p-10 flex min-h-[100vh]  flex-1 flex-col gap-4 bg-muted/50 ">
      <OrganizationSwitcher
        afterLeaveOrganizationUrl="/dashboard"
        afterCreateOrganizationUrl={"/dashboard"}
        afterSelectPersonalUrl={"/dashboard"}
        afterSwitchOrganizationUrl="/dashboard"
        afterSelectOrganizationUrl={"/dashboard"}
      />
      <div className=" flex-1  rounded-xl md:min-h-min p-5">{children}</div>
    </div>
  );
};

export default AppLayout;
