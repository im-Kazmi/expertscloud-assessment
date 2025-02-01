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
import Link from "next/link";
import { Computer } from "lucide-react";

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProperties) => {
  const { user, isSignedIn } = useUser();

  const router = useRouter();

  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: true,
  });

  const { membership, organization } = useOrganization({
    memberships: true,
  });

  if (!isSignedIn) {
    RedirectToSignIn({});
  }

  if (isSignedIn && isLoaded && !userMemberships.data?.length) {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen">
        <CreateOrganization
          skipInvitationScreen={true}
          afterCreateOrganizationUrl={"/dashboard"}
        />
      </div>
    );
  }

  return (
    <IsClientComponent>
      <div className="p-10 flex min-h-[100vh]  flex-1 flex-col gap-4 bg-muted/50 ">
        <div className="flex justify-between w-full">
          <div className="flex gap-x-3">
            <Link href={"/"}>
              <Button variant={"ghost"} size={"icon"}>
                <img alt="logo" src="../../../icon.png" className="size-8" />
              </Button>
            </Link>
            <OrganizationSwitcher
              afterSelectOrganizationUrl="/dashboard"
              afterLeaveOrganizationUrl="/dashboard"
            />
          </div>
          <UserButton />
        </div>
        {!organization ? (
          <div className="flex min-w-full h-[calc(100vh-200px)] border border-dashed bg-muted/50">
            <div className="m-auto">
              <div className="flex flex-col text-neutral-600 gap-y-3 justify-center items-center">
                <Computer size={30} />
                <h1>Please Select an organization to manage projects</h1>
              </div>
            </div>
          </div>
        ) : (
          <div className=" flex-1  rounded-xl md:min-h-min p-5">{children}</div>
        )}
      </div>
    </IsClientComponent>
  );
};

export default AppLayout;
