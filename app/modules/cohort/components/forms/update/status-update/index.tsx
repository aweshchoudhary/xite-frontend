"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { GetCohort } from "@/modules/cohort/components/forms/read/action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";
import { toast } from "sonner";
import {
  updateCohortStatusAction,
  updateCohortChecklistAndStatusAction,
} from "../action";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import { Badge } from "@ui/badge";
import { isSectionsCompleted } from "@/modules/cohort/modules/cohort-content/cohort-content-container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { Label } from "@ui/label";

export default function CohortStatusUpdate({ cohort }: { cohort: GetCohort }) {
  const [status, setStatus] = useState(cohort.status);
  const [showChecklistDialog, setShowChecklistDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateCohort = useCallback(() => {
    const {
      max_cohort_size,
      fees,
      start_date,
      end_date,
      mkt_start_date,
      mkt_end_date,
      format,
      duration,
      location,
    } = cohort;

    const errors: string[] = [];

    if (max_cohort_size === undefined) errors.push("Cohort: Max Cohort Size");
    if (!start_date) errors.push("Cohort: Start Date");
    if (!end_date) errors.push("Cohort: End Date");
    if (!mkt_start_date) errors.push("Cohort: Marketing Start Date");
    if (!mkt_end_date) errors.push("Cohort: Marketing End Date");
    if (!format) errors.push("Cohort: Format");
    if (!duration) errors.push("Cohort: Duration");
    if (!location) errors.push("Cohort: Location");
    if (!fees || fees.length === 0) errors.push("Cohort: Fees");

    const isCompleted = isSectionsCompleted(cohort);

    if (!isCompleted) errors.push("Core Content Section");

    return errors;
  }, [cohort]);

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    const allowedExtensions = [
      ".pdf",
      ".docx",
      ".doc",
      ".xlsx",
      ".xls",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
    ];

    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    return (
      allowedTypes.includes(file.type) ||
      allowedExtensions.includes(fileExtension)
    );
  };

  const handleFileUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (!validateFile(file)) {
      toast.error(
        "Invalid file type. Please upload a PDF, DOCX, Excel sheet, or image file."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    try {
      await updateCohortChecklistAndStatusAction(cohort.id, file);
      toast.success(
        `Checklist uploaded and status updated to ${enumDisplay(
          WorkStatus.ACTIVE
        )}`
      );
      setShowChecklistDialog(false);
      // Update local status to reflect the change
      setStatus(WorkStatus.ACTIVE);
    } catch (error) {
      toast.error("Failed to upload checklist file");
      console.error(error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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

        // Validation passed, show checklist dialog
        setShowChecklistDialog(true);
        return;
      }

      // For non-ACTIVE status, update directly
      updateCohortStatusAction(cohort.id, status);
      toast.success(`Status updated to ${enumDisplay(status)}`);
    };
    fn();
  }, [status, cohort, validateCohort]);

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowChecklistDialog(false);
      // Reset status to current cohort status if dialog is closed
      setStatus(cohort.status);
    }
  };

  return (
    <>
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
              disabled={
                index < Object.values(WorkStatus).indexOf(cohort.status)
              }
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

      <Dialog open={showChecklistDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Checklist File</DialogTitle>
            <DialogDescription>
              Please upload a checklist file (PDF, DOCX, Excel sheet, or image)
              to activate this cohort.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="checklist-file">Checklist File</Label>
              <Input
                id="checklist-file"
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.xlsx,.xls,image/*"
                disabled={isUploading}
              />
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, DOCX, Excel (XLSX, XLS), Images (JPG,
                PNG, GIF, WEBP). Max size: 10MB
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleFileUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload & Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
