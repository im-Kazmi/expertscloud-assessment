"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@repo/design-system/components/ui/button";
import { useCreateProjectSheet } from "@/app/store/use-create-project-sheet";

export const EmptyProjectState = () => {
  const { onOpen } = useCreateProjectSheet();
  return (
    <div className="flex flex-col items-center justify-center h-[300px] bg-muted/20 border border-dashed shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
      <div className="p-4 md:p-5 text-center">
        <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center bg-muted rounded-full">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
          No projects yet
        </h3>
        <p className="text-gray-500 dark:text-neutral-400 mb-4">
          Get started by creating your first project
        </p>
        <Button
          onClick={onOpen}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Create Project
        </Button>
      </div>
      <div className="bg-muted border-t rounded-b-xl py-3 px-4 md:py-4 md:px-5 dark:bg-neutral-900 dark:border-neutral-700 w-full text-center">
        <p className="text-sm text-gray-500 dark:text-neutral-500">
          You haven't created any projects yet
        </p>
      </div>
    </div>
  );
};
