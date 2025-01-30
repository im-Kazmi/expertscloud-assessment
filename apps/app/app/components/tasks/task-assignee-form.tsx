"use client";

import { useOrganization } from "@repo/auth/client";
import { useState, useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MultipleSelector from "@repo/design-system/components/ui/multiselect";
import { assignUserSchema } from "@repo/types";
import { Button } from "@repo/design-system/components/ui/button";
import { AssigneesMultiSelector } from "./assignees-multi-select";

const schema = z.object({
  assignees: assignUserSchema,
});

type FormData = z.infer<typeof schema>;

export function TaskAssigneeForm() {
  const id = useId();
  const { organization } = useOrganization();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { assignees: [] },
  });

  const onSubmit = (data: FormData) => {
    console.log("Selected Assignees:", data.assignees);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2 z-[100] w-full">
        <AssigneesMultiSelector
          onChange={(values) => setValue("assignees", values)}
        />

        {errors.assignees && (
          <p className="text-red-500 text-sm">{errors.assignees.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </Button>
    </form>
  );
}
