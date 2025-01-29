import { client } from "@repo/api/client";
import type { InferResponseType } from "@repo/api/index";
import { useQuery } from "@repo/react-query";
type ResponseType = InferResponseType<typeof client.api.project.list.$get, 200>;

export const useGetProjects = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await client.api.project.list.$get({ query: {} });

      if (!res.ok) {
        throw new Error("error getting projects!");
      }

      const data = await res.json();

      return data;
    },
  });

  return query;
};
