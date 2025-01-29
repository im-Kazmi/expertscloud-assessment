import { z } from "zod";
import { createProjectSchema } from "./schemas";

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
