"use client";
import { useState, useEffect, useCallback } from "react";
import type { GetCohortForDetailPage as GetCohort } from "@/modules/cohort/components/forms/read/get-one-for-detail-page-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { WorkStatus } from "@/modules/common/database/prisma/generated/prisma";
import { toast } from "sonner";
import { updateStatusOnlyAction as updateCohortStatusAction } from "../update-status-only-action";
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
import { Button } from "@ui/button";
import { Checkbox } from "@ui/checkbox";
import { Label } from "@ui/label";

interface ChecklistState {
  finalBrochure: boolean;
  ecAutomation: boolean;
  marketingCampaigns: boolean;
  cohortIdSalesforce: boolean;
  emailsConfiguration: {
    autoMailers: boolean;
    welcomeMail: boolean;
    offerLetter: boolean;
  };
  paymentPage: boolean;
}

export default function CohortStatusUpdate({ cohort }: { cohort: GetCohort }) {
  const [status, setStatus] = useState(cohort.status);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistState>({
    finalBrochure: false,
    ecAutomation: false,
    marketingCampaigns: false,
    cohortIdSalesforce: false,
    emailsConfiguration: {
      autoMailers: false,
      welcomeMail: false,
      offerLetter: false,
    },
    paymentPage: false,
  });

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

  const isChecklistComplete = useCallback(() => {
    return (
      checklist.finalBrochure &&
      checklist.ecAutomation &&
      checklist.marketingCampaigns &&
      checklist.cohortIdSalesforce &&
      checklist.emailsConfiguration.autoMailers &&
      checklist.emailsConfiguration.welcomeMail &&
      checklist.emailsConfiguration.offerLetter &&
      checklist.paymentPage
    );
  }, [checklist]);

  const handleChecklistChange = (
    key: keyof ChecklistState,
    value?: boolean
  ) => {
    if (key === "emailsConfiguration") {
      // This won't be called directly, handled separately
      return;
    }
    setChecklist((prev) => ({
      ...prev,
      [key]: value ?? !prev[key],
    }));
  };

  const handleEmailSubChecklistChange = (
    subKey: keyof ChecklistState["emailsConfiguration"],
    value?: boolean
  ) => {
    setChecklist((prev) => ({
      ...prev,
      emailsConfiguration: {
        ...prev.emailsConfiguration,
        [subKey]: value ?? !prev.emailsConfiguration[subKey],
      },
    }));
  };

  const handleConfirmActivation = async () => {
    if (!isChecklistComplete()) {
      toast.error(
        "Please complete all checklist items before activating the cohort"
      );
      return;
    }

    try {
      await updateCohortStatusAction(cohort.id, WorkStatus.ACTIVE);
      toast.success(`Status updated to ${enumDisplay(WorkStatus.ACTIVE)}`);
      setShowConfirmationDialog(false);
      // Reset checklist for next time
      setChecklist({
        finalBrochure: false,
        ecAutomation: false,
        marketingCampaigns: false,
        cohortIdSalesforce: false,
        emailsConfiguration: {
          autoMailers: false,
          welcomeMail: false,
          offerLetter: false,
        },
        paymentPage: false,
      });
    } catch (error) {
      toast.error("Failed to activate cohort");
      console.error(error);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowConfirmationDialog(false);
      // Reset status to current cohort status if dialog is closed
      setStatus(cohort.status);
      // Reset checklist
      setChecklist({
        finalBrochure: false,
        ecAutomation: false,
        marketingCampaigns: false,
        cohortIdSalesforce: false,
        emailsConfiguration: {
          autoMailers: false,
          welcomeMail: false,
          offerLetter: false,
        },
        paymentPage: false,
      });
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

        // Validation passed, show confirmation dialog
        setShowConfirmationDialog(true);
        return;
      }

      // For non-ACTIVE status, update directly
      updateCohortStatusAction(cohort.id, status);
      toast.success(`Status updated to ${enumDisplay(status)}`);
    };
    fn();
  }, [status, cohort, validateCohort]);

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

      <Dialog open={showConfirmationDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Cohort Activation</DialogTitle>
            <DialogDescription>
              Please confirm that all the following items are completed before
              activating this cohort.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {/* Final Brochure */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="final-brochure"
                  checked={checklist.finalBrochure}
                  onCheckedChange={(checked) =>
                    handleChecklistChange("finalBrochure", checked as boolean)
                  }
                />
                <Label
                  htmlFor="final-brochure"
                  className="text-sm font-normal cursor-pointer"
                >
                  Final Brochure added
                </Label>
              </div>

              {/* EC Automation */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ec-automation"
                  checked={checklist.ecAutomation}
                  onCheckedChange={(checked) =>
                    handleChecklistChange("ecAutomation", checked as boolean)
                  }
                />
                <Label
                  htmlFor="ec-automation"
                  className="text-sm font-normal cursor-pointer"
                >
                  EC Automation
                </Label>
              </div>

              {/* Marketing campaigns */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing-campaigns"
                  checked={checklist.marketingCampaigns}
                  onCheckedChange={(checked) =>
                    handleChecklistChange(
                      "marketingCampaigns",
                      checked as boolean
                    )
                  }
                />
                <Label
                  htmlFor="marketing-campaigns"
                  className="text-sm font-normal cursor-pointer"
                >
                  Marketing campaigns configured
                </Label>
              </div>

              {/* Cohort Id Salesforce */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cohort-id-salesforce"
                  checked={checklist.cohortIdSalesforce}
                  onCheckedChange={(checked) =>
                    handleChecklistChange(
                      "cohortIdSalesforce",
                      checked as boolean
                    )
                  }
                />
                <Label
                  htmlFor="cohort-id-salesforce"
                  className="text-sm font-normal cursor-pointer"
                >
                  Cohort Id added to Salesforce
                </Label>
              </div>

              {/* Emails configuration with sub-checkboxes */}
              <div className="space-y-2 pl-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emails-configuration"
                    checked={
                      checklist.emailsConfiguration.autoMailers &&
                      checklist.emailsConfiguration.welcomeMail &&
                      checklist.emailsConfiguration.offerLetter
                    }
                    onCheckedChange={(checked) => {
                      const value = checked as boolean;
                      handleEmailSubChecklistChange("autoMailers", value);
                      handleEmailSubChecklistChange("welcomeMail", value);
                      handleEmailSubChecklistChange("offerLetter", value);
                    }}
                  />
                  <Label
                    htmlFor="emails-configuration"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Emails configuration
                  </Label>
                </div>
                <div className="space-y-2 pl-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto-mailers"
                      checked={checklist.emailsConfiguration.autoMailers}
                      onCheckedChange={(checked) =>
                        handleEmailSubChecklistChange(
                          "autoMailers",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="auto-mailers"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Auto mailers (Brevo)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="welcome-mail"
                      checked={checklist.emailsConfiguration.welcomeMail}
                      onCheckedChange={(checked) =>
                        handleEmailSubChecklistChange(
                          "welcomeMail",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="welcome-mail"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Welcome mail
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="offer-letter"
                      checked={checklist.emailsConfiguration.offerLetter}
                      onCheckedChange={(checked) =>
                        handleEmailSubChecklistChange(
                          "offerLetter",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="offer-letter"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Offer letter
                    </Label>
                  </div>
                </div>
              </div>

              {/* Payment page */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="payment-page"
                  checked={checklist.paymentPage}
                  onCheckedChange={(checked) =>
                    handleChecklistChange("paymentPage", checked as boolean)
                  }
                />
                <Label
                  htmlFor="payment-page"
                  className="text-sm font-normal cursor-pointer"
                >
                  Payment page
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleDialogClose(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmActivation}
              disabled={!isChecklistComplete()}
            >
              Activate Cohort
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
