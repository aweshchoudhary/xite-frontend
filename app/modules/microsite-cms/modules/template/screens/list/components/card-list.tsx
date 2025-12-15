import { ITemplate } from "@/modules/common/services/db/types/interfaces";
import Card from "./card";

type CardListProps = {
  templates: ITemplate[];
};

export default function CardList({ templates }: CardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {templates.map((template) => (
        <Card key={template._id} template={template} />
      ))}
    </div>
  );
}
