import { client } from "@repo/api/client";
import type { InferRequestType, InferResponseType } from "@repo/api/index";
import { useMutation, useQueryClient } from "@repo/react-query";

type ResponseType = InferResponseType<typeof client.api.project.$post, 200>;
type RequestType = InferRequestType<typeof client.api.project.$post>["json"];

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.project.$post({
        json: json,
      });

      if (!res.ok) {
        throw new Error("cannot create project!");
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
