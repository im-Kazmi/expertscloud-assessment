"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/design-system/components/ui/sheet";
import { useCreateProject } from "@repo/features/project";
import { useRouter } from "next/navigation";
import { Protect, useAuth } from "@repo/auth/client";
import { createProjectSchema, CreateProjectFormValues } from "@repo/types";
import { ProjectForm } from "./project-form";
import { useCreateProjectSheet } from "@/app/store/use-create-project-sheet";

const CreateProjectSheet = () => {
  const { isOpen, onClose } = useCreateProjectSheet();
  const { has, orgId } = useAuth();
  const mutation = useCreateProject();
  const router = useRouter();

  function onSubmit(data: CreateProjectFormValues) {
    mutation.mutate(data, {
      onSuccess: (data, vars) => {
        onClose();
        router.push(`/dashboard/${data?.id}`);
      },
      onError: () => {},
      onSettled: () => {},
    });
  }

  if (!has) return null;

  const havePermissions =
    has({ role: "org:admin" }) || has({ role: "org:member" });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Create Project</SheetTitle>
          <SheetDescription>Create a new project</SheetDescription>
        </SheetHeader>
        <ProjectForm
          onSubmit={onSubmit}
          defaultValues={{
            name: "",
            description: "",
            orgId: orgId!,
          }}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CreateProjectSheet;
