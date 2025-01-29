import { Separator } from "@repo/design-system/components/ui/separator";
import type React from "react";

type Props = {
  children?: React.ReactNode;
};

const DashboardHeader = ({ children }: Props) => {
  return (
    <div className=" flex flex-col gap-y-2  mb-5">
      <div className=" flex justify-between w-full">{children}</div>
      <Separator className=" w-full" />
    </div>
  );
};

export default DashboardHeader;
