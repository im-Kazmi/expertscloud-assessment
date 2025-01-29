"use client";
import { useCreateProjectSheet } from "@/app/store/use-create-project-sheet";
import { Button } from "@repo/design-system/components/ui/button";
import { PlusCircle } from "lucide-react";

export const NewProjectButton = () => {
  const { onOpen } = useCreateProjectSheet();
  return (
    <Button onClick={onOpen}>
      <PlusCircle /> New Project
    </Button>
  );
};
