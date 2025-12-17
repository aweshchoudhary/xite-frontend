import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/common/components/ui/tabs";
import Microsites from "@/modules/microsite-cms/modules/microsite/screens/list";
import Templates from "@/modules/microsite-cms/modules/template/screens/list";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>;
}) {
  const { tab } = await searchParams;
  return (
    <main>
      <section>
        <Tabs defaultValue={tab ?? "templates"}>
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="microsites">Microsites</TabsTrigger>
          </TabsList>
          <TabsContent value="templates">
            <div className="lg:p-10 max-w-6xl mx-auto">
              <Templates />
            </div>
          </TabsContent>
          <TabsContent value="microsites">
            <div className="lg:p-10 max-w-6xl mx-auto">
              <Microsites />
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
