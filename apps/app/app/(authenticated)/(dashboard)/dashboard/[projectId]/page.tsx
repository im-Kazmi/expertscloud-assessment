import { ClientPage } from "./client-page";

export type paramsType = Promise<{ projectId: string }>;

type Props = {
  params: paramsType;
};

const Page = async ({ params }: Props) => {
  const { projectId } = await params;
  return (
    <>
      <ClientPage id={projectId} />
    </>
  );
};

export default Page;
