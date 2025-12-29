"use client";
import { fetchMicrosites } from "./actions/fetch";
import { useState, useEffect } from "react";
import { IMicrosite } from "../../../common/services/db/types/interfaces";
import DataTable from "./components/data-table";

export default function Microsites() {
  const [microsites, setMicrosites] = useState<IMicrosite[]>([]);
  useEffect(() => {
    const fetchMicrositesEffect = async () => {
      const microsites = await fetchMicrosites("generic");
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
      <DataTable microsites={microsites} />
    </div>
  );
}
