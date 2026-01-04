"use client";
import { useState, useEffect, useCallback } from "react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";
import { toast } from "sonner";
import { updateCohortStatusAction } from "../action";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import { Badge } from "@ui/badge";
import { isSectionsCompleted } from "@/modules/cohort/modules/cohort-content/cohort-content-container";

export default function CohortStatusUpdate({ cohort }: { cohort: GetCohort }) {
  const [status, setStatus] = useState(cohort.status);

  const validateCohort = useCallback(() => {
    const {
      max_cohort_size,
      fees,
      start_date,
      end_date,
      format,
      duration,
      location,
    } = cohort;

    const errors: string[] = [];

    if (max_cohort_size === undefined) errors.push("Cohort: Max Cohort Size");
    if (!start_date) errors.push("Cohort: Start Date");
    if (!end_date) errors.push("Cohort: End Date");
    if (!format) errors.push("Cohort: Format");
    if (!duration) errors.push("Cohort: Duration");
    if (!location) errors.push("Cohort: Location");
    if (!fees || fees.length === 0) errors.push("Cohort: Fees");

    const isCompleted = isSectionsCompleted(cohort);

    if (!isCompleted) errors.push("Core Content Section");

    return errors;
  }, [cohort]);

  useEffect(() => {
    const fn = async () => {
      if (status === cohort.status) return;

      if (status === WorkStatus.ACTIVE) {
        const errors = validateCohort();
        if (errors.length > 0) {
          toast.error("Data incomplete.", {
            description: (
              <ul className="list-disc text-foreground text-base list-inside">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            ),
            classNames: {
              title: "text-base font-semibold text-destructive",
            },
          });
          setStatus(cohort.status);
          return;
        }
      }

      updateCohortStatusAction(cohort.id, status);
      toast.success(`Status updated to ${enumDisplay(status)}`);
    };
    fn();
  }, [status, cohort, validateCohort]);

  return (
    <Select
      onValueChange={(value) => setStatus(value as WorkStatus)}
      value={status}
    >
      <SelectTrigger className="capitalize">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        {/* disable previous status */}
        {Object.values(WorkStatus).map((val, index) => (
          <SelectItem
            disabled={index < Object.values(WorkStatus).indexOf(cohort.status)}
            key={val}
            value={val}
            className="capitalize"
          >
            <Badge variant={val === "ACTIVE" ? "success" : "outline"}>
              {enumDisplay(val)}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
