import SpaceJourneyClient from "./SpaceJourneyClient";
import { getPhaseContent } from "@/app/admin/actions";

export default async function Page() {
  const content = await getPhaseContent();
  return <SpaceJourneyClient phasesData={content} />;
}
