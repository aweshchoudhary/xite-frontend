import { PrimaryDB } from "@/modules/common/database/prisma/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/accordion";
import { BookOpen } from "lucide-react";

type Props = {
  data?: PrimaryDB.DesignCohortCurriculumSectionGetPayload<{
    include: {
      items: {
        include: {
          objectives: true;
          sessions: {
            include: {
              objectives: true;
            };
          };
        };
      };
    };
  }> | null;
};

export default function CohortContentDetailsOverviewView({ data }: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">
        {data?.title || "Program Curriculum"}
      </h3>

      {data?.items && data.items.length > 0 ? (
        <Accordion type="multiple" className="space-y-3">
          {data.items
            .sort((a, b) => a.position - b.position)
            .map((item, index) => (
              <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3 text-left">
                    <div className="size-8 bg-primary-accent rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-primary-accent-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="mb-2 text-muted-foreground font-medium text-sm">
                        Overview
                      </h4>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.overview ?? "No description available",
                        }}
                      ></div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-muted-foreground font-medium text-sm">
                        Objectives
                      </h4>
                      <div className="space-y-2">
                        {item.objectives
                          .sort((a, b) => a.position - b.position)
                          .map((objective) => (
                            <div key={objective.id}>
                              {objective.description}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-lg border">
                    <h4 className="mb-2 text-muted-foreground font-medium text-sm">
                      Sessions
                    </h4>

                    <div>
                      <div className="space-y-5">
                        {item.sessions
                          .sort((a, b) => a.position - b.position)
                          .map((session) => (
                            <div
                              key={session.id}
                              className="border w-full p-5 shadow bg-gray-100 rounded-lg"
                            >
                              <h3 className="mb-2 font-medium">
                                Session #{session.position} - {session.title}
                              </h3>

                              <hr className="mb-5 border-gray-200" />

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="mb-2 text-muted-foreground font-medium text-sm">
                                    Overview
                                  </h4>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        session.overview ||
                                        "No description available",
                                    }}
                                  ></div>
                                </div>
                                <div>
                                  <h4 className="mb-2 text-muted-foreground font-medium text-sm">
                                    Objectives
                                  </h4>
                                  <ul className="list-disc list-inside pl-5 space-y-2">
                                    {session.objectives
                                      .sort((a, b) => a.position - b.position)
                                      .map((objective) => (
                                        <li key={objective.id}>
                                          {objective.description}
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      ) : (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
          <BookOpen className="size-8 mx-auto mb-2 opacity-50" />
          <p>No curriculum modules added yet</p>
          <p className="text-sm">
            Click the edit button to add curriculum modules
          </p>
        </div>
      )}
    </div>
  );
}
