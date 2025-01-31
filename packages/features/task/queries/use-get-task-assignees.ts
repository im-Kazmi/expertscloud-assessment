import { client } from "@repo/api/client";
import type { InferResponseType } from "@repo/api/index";
import { useQuery } from "@repo/react-query";
type ResponseType = InferResponseType<
  (typeof client.api.task)[":id"]["assignees"]["$get"],
  200
>;

export const useGetTaskAssignees = (id: string) => {
  const query = useQuery<ResponseType, Error>({
    enabled: !!id,
    queryKey: ["tasks", { id }, "assignees"],
    queryFn: async () => {
      const res = await client.api.task[":id"]["assignees"].$get({
        param: {
          id,
        },
      });

      if (!res.ok) {
        throw new Error("error getting task assignees!");
      }

      const data = await res.json();

      return data;
    },
  });

  return query;
};
