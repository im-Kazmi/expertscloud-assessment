import { client } from "@repo/api/client";
import type { InferResponseType } from "@repo/api/index";
import { useQuery } from "@repo/react-query";
type ResponseType = InferResponseType<
  (typeof client.api.project)[":id"]["$get"],
  200
>;

export const useGetProject = (id: string) => {
  const query = useQuery<ResponseType, Error>({
    enabled: !!id,
    queryKey: ["projects", { id }],
    queryFn: async () => {
      const res = await client.api.project[":id"].$get({
        param: {
          id,
        },
      });

      if (!res.ok) {
        throw new Error("error getting project!");
      }

      const data = await res.json();

      return data;
    },
  });

  return query;
};
