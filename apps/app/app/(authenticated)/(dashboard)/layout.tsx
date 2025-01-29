"use client";
import { RedirectToSignIn, useUser } from "@repo/auth/client";
import { Button } from "@repo/design-system/components/ui/button";
import { type ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProperties) => {
  const { user, isSignedIn } = useUser();

  // const pathname = usePathname();

  // const { onOpen } = useOnboardingDialog();

  // const { data, isLoading } = useGetStores();

  if (!isSignedIn) {
    RedirectToSignIn({});
  }

  // useEffect(() => {
  //   if (!isLoading && !data?.data) {
  //     onOpen();
  //   }
  // }, [isLoading]);

  // if (pathname.includes("/products/new")) {
  //   return children;
  // }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-muted/50">
      <div className="min-h-[100vh]  flex-1 rounded-xl md:min-h-min p-5">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
