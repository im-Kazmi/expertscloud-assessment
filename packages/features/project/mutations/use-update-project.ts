import { client } from "@repo/api/client";
import type { InferRequestType, InferResponseType } from "@repo/api/index";
import { useMutation, useQueryClient } from "@repo/react-query";

type ResponseType = InferResponseType<
  (typeof client.api.project)[":id"]["update"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.project)[":id"]["update"]["$post"]
>["json"] & {
  id: string;
};

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.project[":id"]["update"]["$post"]({
        json: json,
        param: {
          id,
        },
      });

      if (!res.ok) {
        throw new Error("cannot update project!");
      }

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", { id }] });
    },
    onError: () => {},
  });

  return mutation;
};
