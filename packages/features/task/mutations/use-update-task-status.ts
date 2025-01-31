import { client } from "@repo/api/client";
import type { InferRequestType, InferResponseType } from "@repo/api/index";
import { useMutation, useQueryClient } from "@repo/react-query";

type ResponseType = InferResponseType<
  (typeof client.api.task)[":id"]["update"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.task)[":id"]["update"]["$post"]
>["json"] & {
  id: string;
};

export const useUpdateTaskStatus = (projectId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ id, status }) => {
      const res = await client.api.task[":id"]["update"]["$post"]({
        json: {
          status,
        },
        param: {
          id: id,
        },
      });

      if (!res.ok) {
        throw new Error("cannot update task!");
      }

      const data = await res.json();
      return data;
    },
    onMutate: async (newTask: any) => {
      await queryClient.cancelQueries({
        queryKey: ["projects", { id: projectId }],
      });

      const previousProject: any = queryClient.getQueryData<ResponseType>([
        "projects",
        { id: projectId },
      ]);

      if (previousProject) {
        const updatedTasks = previousProject.tasks.map((task: any) =>
          task.id === newTask.id ? { ...task, ...newTask } : task,
        );

        queryClient.setQueryData<ResponseType>(
          ["projects", { id: projectId }],
          {
            ...previousProject,
            tasks: updatedTasks,
          },
        );
      }

      return { previousProject };
    },
    onError: (err: any, newTask: any, context: any) => {
      if (context?.previousProject) {
        queryClient.setQueryData<ResponseType>(
          ["projects", { id: projectId }],
          context.previousProject,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", { id: projectId }],
      });
    },
  });

  return mutation;
};
