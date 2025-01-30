"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design-system/components/ui/form";
import { Input } from "@repo/design-system/components/ui/input";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { createProjectSchema, CreateProjectFormValues } from "@repo/types";

type Props = {
  id?: string;
  onSubmit: (values: CreateProjectFormValues) => void;
  onDelete?: () => void;
  defaultValues?: CreateProjectFormValues;
  disabled: boolean;
};

export function ProjectForm({
  id,
  onSubmit,
  onDelete,
  defaultValues,
  disabled,
}: Props) {
  const form = useForm<CreateProjectFormValues>({
    // resolver: zodResolver(createProjectSchema),
    defaultValues: defaultValues,
  });

  function handleDelete() {
    onDelete?.();
  }

  return (
    <div className="pt-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 min-w-full "
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="anything..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g An abc project for a xyz client."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-y-2">
            <Button disabled={disabled} type="submit" className="w-full">
              {id ? "Save changes" : "Create Project"}
            </Button>
            {!!id && (
              <Button
                type="button"
                disabled={disabled}
                onClick={handleDelete}
                variant={"destructive"}
              >
                <Trash className=" size-4 mr-2 " /> Delete Project
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
