import { client } from "@repo/api/client";
import type { InferRequestType, InferResponseType } from "@repo/api/index";
import { useMutation, useQueryClient } from "@repo/react-query";

type RequestType = InferRequestType<
  (typeof client.api.task)[":id"]["assign"]["$post"]
>["json"];

export const useAssignTask = (taskId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.task[":id"]["assign"]["$post"]({
        json: json,
        param: {
          id: taskId,
        },
      });

      if (!res.ok) {
        throw new Error("cannot assign task!");
      }

      const data = await res.json();
      return data;
    },
  });

  return mutation;
};
