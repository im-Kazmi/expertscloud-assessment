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

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({
      id,
      description,
      dueDate,
      priority,
      status,
      title,
    }) => {
      const res = await client.api.task[":id"]["update"]["$post"]({
        json: {
          description,
          dueDate,
          priority,
          status,
          title,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {},
  });

  return mutation;
};
