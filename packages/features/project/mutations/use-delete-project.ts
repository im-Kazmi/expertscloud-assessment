import { client } from "@repo/api/client";
import type { InferResponseType } from "@repo/api/index";
import { useMutation, useQueryClient } from "@repo/react-query";

type ResponseType = InferResponseType<
  (typeof client.api.project)[":id"]["delete"]["$post"],
  200
>;

export const useDeleteProject = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const res = await client.api.project[":id"]["delete"]["$post"]({
        param: {
          id,
        },
      });

      if (!res.ok) {
        throw new Error("cannot delete project!");
      }

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {},
  });

  return mutation;
};
