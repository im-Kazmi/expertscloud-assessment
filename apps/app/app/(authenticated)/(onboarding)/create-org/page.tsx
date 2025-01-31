import { CreateOrganization } from "@repo/auth/client";

export default function Page() {
  return (
    <div className="w-screen h-screen bg-red flex items-center justify-center">
      <CreateOrganization afterCreateOrganizationUrl={"/dashboard"} />;
    </div>
  );
}
