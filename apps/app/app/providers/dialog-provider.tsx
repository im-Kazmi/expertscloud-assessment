"use client";

import { NewAssigneeDialog } from "../components/tasks/new-assignee-dialog";
import { NewTaskDialog } from "../components/tasks/new-task-dialog";

export const DialogProvider = () => {
  return (
    <>
      <NewTaskDialog />
      <NewAssigneeDialog />
    </>
  );
};
