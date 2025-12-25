"use client";
import { fetchMicrosites } from "./actions/fetch";
import CardList from "./components/card-list";
import { useState, useEffect } from "react";
import { IMicrosite } from "../../../common/services/db/types/interfaces";

export default function Microsites() {
  const [microsites, setMicrosites] = useState<IMicrosite[]>([]);
  useEffect(() => {
    const fetchMicrositesEffect = async () => {
      const microsites = await fetchMicrosites();
      setMicrosites(microsites || []);
    };
    fetchMicrositesEffect();
  }, []);

  if (microsites.length === 0) {
    return (
      <div className="min-h-50 bg-accent/50 flex items-center justify-center">
        No microsites yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CardList microsites={microsites} />
    </div>
  );
}
