import { client } from "@repo/api/client";
import type { InferResponseType } from "@repo/api/index";
import { useQuery } from "@repo/react-query";
type ResponseType = InferResponseType<typeof client.api.task.list.$get, 200>;

export const useGetTasks = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await client.api.task.list.$get({ query: {} });

      if (!res.ok) {
        throw new Error("error getting tasks!");
      }

      const data = await res.json();

      return data;
    },
  });

  return query;
};
