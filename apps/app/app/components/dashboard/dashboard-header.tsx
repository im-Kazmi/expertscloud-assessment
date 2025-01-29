import { Separator } from "@repo/design-system/components/ui/separator";
import type React from "react";

type Props = {
  children?: React.ReactNode;
};

const DashboardHeader = ({ children }: Props) => {
  return (
    <div className=" flex h-14 bg-muted border border-dashed justify-between w-full items-center px-3">
      {children}
    </div>
  );
};

export default DashboardHeader;
