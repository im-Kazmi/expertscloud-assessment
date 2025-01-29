import { client } from "@repo/api/client";
import type { InferResponseType } from "@repo/api/index";
import { useMutation, useQueryClient } from "@repo/react-query";

type ResponseType = InferResponseType<
  (typeof client.api.task)[":id"]["delete"]["$post"],
  200
>;

export const useDeleteTask = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const res = await client.api.task[":id"]["delete"]["$post"]({
        param: {
          id,
        },
      });

      if (!res.ok) {
        throw new Error("cannot delete task!");
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
