import { IMicrosite } from "@/modules/common/services/db/types/interfaces";
import Card from "./card";

type CardListProps = {
  microsites: IMicrosite[];
};

export default function CardList({ microsites }: CardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {microsites.map((microsite) => (
        <Card key={microsite._id} microsite={microsite} />
      ))}
    </div>
  );
}

