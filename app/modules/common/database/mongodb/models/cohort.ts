import mongoose, { models } from "mongoose";
import { WorkStatus } from "./enums";

const CohortSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(WorkStatus),
      default: WorkStatus.DRAFT,
    },
    name: { type: String },
    description: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    format: { type: String },
    duration: { type: String },
    location: { type: String },
    cohort_key: { type: String, required: true, unique: true },
    cohort_num: { type: Number, default: 1 },
    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    max_cohort_size: { type: Number, default: 0 },
    media_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortMediaSection",
      unique: true,
      sparse: true,
    },
    microsite_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortSectionMicrositeSection",
      unique: true,
      sparse: true,
    },
    overview_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortOverviewSection",
      unique: true,
      sparse: true,
    },
    benefits_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortBenefitsSection",
      unique: true,
      sparse: true,
    },
    curriculum_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortCurriculumSection",
      unique: true,
      sparse: true,
    },
    statistics_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortStatisticsSection",
      unique: true,
      sparse: true,
    },
    faculty_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortFacultySection",
      unique: true,
      sparse: true,
    },
    industry_experts_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortIndustryExpertsSection",
      unique: true,
      sparse: true,
    },
    certification_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortCertificationSection",
      unique: true,
      sparse: true,
    },
    testimonial_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortTestimonialSection",
      unique: true,
      sparse: true,
    },
    who_should_apply_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortWhoShouldApplySection",
      unique: true,
      sparse: true,
    },
    cohort_branding_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CohortBranding",
      unique: true,
      sparse: true,
    },
    design_curriculum_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignCohortCurriculumSection",
      unique: true,
      sparse: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

CohortSchema.index({ cohort_key: 1, _id: 1 }, { unique: true });

export const CohortModel =
  models.Cohort || mongoose.model("Cohort", CohortSchema);

export default CohortModel;

