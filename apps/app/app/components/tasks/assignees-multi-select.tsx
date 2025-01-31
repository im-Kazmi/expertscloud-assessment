"use client";
import { useOrganization } from "@repo/auth/client";
import { useState, useEffect, useId } from "react";
import MultipleSelector from "@repo/design-system/components/ui/multiselect";
import { assignUserSchema } from "@repo/types";
import { useGetTaskAssignees } from "@repo/features/task";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  label: string;
  value: string;
  imageUrl?: string;
  email?: string;
};

export function AssigneesMultiSelector({
  onChange,
  defaultValues,
  disabled = false,
}: {
  onChange: (userIds: string[]) => void;
  defaultValues?: { label: string; value: string }[];
  disabled?: boolean;
}) {
  const id = useId();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useOrganization();

  useEffect(() => {
    async function fetchUsers() {
      if (!organization) {
        setLoading(false);
        return;
      }

      try {
        const memberList = await organization.getMemberships();

        if (!memberList?.data?.length) {
          setError("No users found in this organization");
          setLoading(false);
          return;
        }

        const userList = memberList.data
          .filter((membership) => membership.publicUserData)
          .map((membership) => ({
            id: membership.publicUserData.userId,
            value: membership.publicUserData.userId,
            label:
              `${membership.publicUserData.firstName || ""} ${membership.publicUserData.lastName || ""}`.trim(),
            firstName: membership.publicUserData.firstName ?? "Unknown",
            lastName: membership.publicUserData.lastName ?? "User",
            imageUrl: membership.publicUserData.imageUrl ?? "",
            email: membership.publicUserData.identifier ?? "",
          }));

        setUsers(userList as any);
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [organization]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  onChange;

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (!users.length) {
    return <div>No users available</div>;
  }

  return (
    <div className="space-y-2 z-[100] w-full">
      <MultipleSelector
        commandProps={{ label: "Select Assignees" }}
        defaultOptions={users.map((user) => ({
          label: user.label,
          value: user.value,
        }))}
        value={defaultValues ?? undefined}
        onChange={(opts) => onChange(opts.map((opt) => opt.value))}
        placeholder="Select Assignees"
        hideClearAllButton
        hidePlaceholderWhenSelected
        emptyIndicator={<p className="text-center text-sm">No results found</p>}
        disabled={disabled}
      />
    </div>
  );
}
