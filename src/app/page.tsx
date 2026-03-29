import SpaceJourneyClient from "./SpaceJourneyClient";
import { getPhaseContent, getArticles } from "@/app/admin/actions";

export default async function Page() {
  const content = await getPhaseContent();
  const allArticles = await getArticles();
  const genelArticles = allArticles.filter(a => !a.category || a.category === "genel");
  return <SpaceJourneyClient phasesData={content} articles={genelArticles} />;
}
