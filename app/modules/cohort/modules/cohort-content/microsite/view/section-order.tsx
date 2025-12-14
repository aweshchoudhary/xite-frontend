import {
  CohortSectionWithData,
  getCohortSections,
} from "@/modules/cohort/server/cohort/read";
import { useEffect, useState } from "react";

export default function SectionOrder({ cohort_id }: { cohort_id: string }) {
  const [sections, setSections] = useState<CohortSectionWithData[]>([]);

  useEffect(() => {
    const fetchSections = async () => {
      setSections(await getCohortSections(cohort_id));
    };
    fetchSections();
  }, [cohort_id]);

  return (
    <div>
      <h3 className="mb-3">Sections Order</h3>
      <ol className="list-decimal max-w-md space-y-3">
        {sections
          .map((section: any) => {
            return section;
          })
          .map((section: any, index: number) => (
            <li
              key={section.id}
              className={
                "flex items-center justify-between px-3 py-2 rounded-lg shadow-sm border select-none"
              }
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">{index + 1}</span>
                <span className="font-medium text-sm truncate flex-1">
                  {section?.data?.title}
                </span>
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
}
