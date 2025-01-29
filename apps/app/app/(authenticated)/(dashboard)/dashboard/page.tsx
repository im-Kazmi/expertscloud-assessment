import { Tasks } from "@/app/components/tasks/tasks";
import { OrganizationSwitcher } from "@repo/auth/client";

export default function Page() {
  return (
    <div>
      <OrganizationSwitcher />
      <Tasks />
    </div>
  );
}
