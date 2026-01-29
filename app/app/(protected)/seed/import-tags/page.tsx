import { seedProgramTags } from "./action";

export default async function ImportTagsPage() {
  await seedProgramTags();
  return <div>Tags imported successfully</div>;
}