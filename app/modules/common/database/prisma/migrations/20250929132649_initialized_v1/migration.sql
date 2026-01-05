-- CreateEnum
CREATE TYPE "public"."WorkStatus" AS ENUM ('DRAFT', 'PLANNING', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."ProgramStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."ProgramType" AS ENUM ('OPEN', 'CUSTOM', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "public"."SectionWidth" AS ENUM ('center', 'full');

-- CreateEnum
CREATE TYPE "public"."ContentActionBlockType" AS ENUM ('primary', 'secondary', 'link');

-- CreateEnum
CREATE TYPE "public"."FacultyType" AS ENUM ('PROFESSOR_TIER_1', 'PROFESSOR_TIER_2', 'PROFESSOR_TIER_3', 'COACH', 'SUCCESS_COACH');

-- CreateEnum
CREATE TYPE "public"."ContactRole" AS ENUM ('MANAGER');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('Admin', 'User');

-- CreateTable
CREATE TABLE "public"."AcademicPartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "description" TEXT,
    "logo_url" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Enterprise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "note" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enterprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "program_key" TEXT NOT NULL,
    "short_name" TEXT NOT NULL DEFAULT 'Program',
    "status" "public"."ProgramStatus" NOT NULL DEFAULT 'DRAFT',
    "type" "public"."ProgramType" NOT NULL DEFAULT 'OPEN',
    "enterprise_id" TEXT,
    "academic_partner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."List" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "program_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cohort" (
    "id" TEXT NOT NULL,
    "status" "public"."WorkStatus" NOT NULL DEFAULT 'DRAFT',
    "name" TEXT,
    "description" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "format" TEXT,
    "duration" TEXT,
    "location" TEXT,
    "cohort_key" TEXT,
    "cohort_num" INTEGER NOT NULL DEFAULT 1,
    "program_id" TEXT NOT NULL,
    "max_cohort_size" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "media_section_id" TEXT,
    "microsite_section_id" TEXT,
    "overview_section_id" TEXT,
    "benefits_section_id" TEXT,
    "curriculum_section_id" TEXT,
    "statistics_section_id" TEXT,
    "faculty_section_id" TEXT,
    "industry_experts_section_id" TEXT,
    "certification_section_id" TEXT,
    "testimonial_section_id" TEXT,
    "who_should_apply_section_id" TEXT,
    "cohort_branding_id" TEXT,
    "design_curriculum_section_id" TEXT,
    "ownerId" TEXT,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortBranding" (
    "id" TEXT NOT NULL,
    "primary_color_id" TEXT,
    "secondary_color_id" TEXT,
    "background_color_id" TEXT,
    "default_border_radius" INTEGER NOT NULL,
    "font_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortBranding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortMediaSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "banner_image_url" TEXT,
    "banner_image_width" INTEGER,
    "brochure_url" TEXT,
    "university_logo_url" TEXT,
    "university_logo_width" INTEGER,
    "university_banner_url" TEXT,
    "university_banner_width" INTEGER,
    "is_section_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortMediaSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContentColorsBlock" (
    "id" TEXT NOT NULL,
    "background_color" TEXT,
    "text_color" TEXT NOT NULL,
    "color_type" TEXT DEFAULT 'hex',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentColorsBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortSectionMicrositeSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "visibility_start_date" TIMESTAMP(3),
    "visibility_end_date" TIMESTAMP(3),
    "custom_domain" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortSectionMicrositeSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MicrositePages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content_html" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MicrositePages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortOverviewSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "top_description" TEXT,
    "bottom_description" TEXT,
    "description_html" TEXT,
    "description_plain" TEXT,
    "is_section_visible" BOOLEAN NOT NULL DEFAULT true,
    "section_width" "public"."SectionWidth" DEFAULT 'center',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortOverviewSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortBenefitsSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "top_description" TEXT,
    "bottom_description" TEXT,
    "section_width" "public"."SectionWidth" DEFAULT 'center',
    "is_section_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortBenefitsSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortBenefitsItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon_image_url" TEXT,
    "parent_section_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortBenefitsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortCurriculumSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "top_description" TEXT,
    "bottom_description" TEXT,
    "section_width" "public"."SectionWidth" DEFAULT 'center',
    "is_section_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortCurriculumSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortCurriculumItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description_html" TEXT,
    "description_plain" TEXT,
    "parent_section_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortCurriculumItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DesignCohortCurriculumSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview_plain" TEXT,
    "overview_html" TEXT,
    "is_section_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignCohortCurriculumSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DesignCohortCurriculumSectionItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview_plain" TEXT,
    "overview_html" TEXT,
    "parent_section_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cohortId" TEXT,

    CONSTRAINT "DesignCohortCurriculumSectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DesignCohortCurriculumObjective" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "parent_section_id" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "designCohortCurriculumSessionId" TEXT,

    CONSTRAINT "DesignCohortCurriculumObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DesignCohortCurriculumSession" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview_plain" TEXT,
    "overview_html" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "parent_section_id" TEXT,

    CONSTRAINT "DesignCohortCurriculumSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortStatisticsSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "top_description" TEXT,
    "bottom_description" TEXT,
    "work_experience_item_id" TEXT,
    "industry_item_id" TEXT,
    "designation_item_id" TEXT,
    "company_item_id" TEXT,
    "is_section_visible" BOOLEAN NOT NULL DEFAULT true,
    "section_width" "public"."SectionWidth" DEFAULT 'center',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortStatisticsSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortStatisticsWorkExperienceItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "chart_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortStatisticsWorkExperienceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortStatisticsIndustryItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "data_list_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortStatisticsIndustryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortStatisticsDesignationItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "data_list_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortStatisticsDesignationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortStatisticsCompanyItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "top_description" TEXT,
    "bottom_description" TEXT,
    "section_width" "public"."SectionWidth" DEFAULT 'center',
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortStatisticsCompanyItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortFacultySection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "top_description" TEXT,
    "bottom_description" TEXT,
    "section_width" "public"."SectionWidth" DEFAULT 'center',
    "is_section_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortFacultySection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortFacultySectionItem" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "facultyId" TEXT NOT NULL,
    "parent_section_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortFacultySectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortIndustryExpertsSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "top_description" TEXT,
    "bottom_description" TEXT,
    "section_width" "public"."SectionWidth" DEFAULT 'center',
    "is_section_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortIndustryExpertsSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortIndustryExpertsSectionItem" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "facultyId" TEXT NOT NULL,
    "parent_section_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortIndustryExpertsSectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortCertificationSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "top_description" TEXT,
    "bottom_description" TEXT,
    "certificate_image_url" TEXT,
    "is_section_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortCertificationSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortTestimonialSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_section_visible" BOOLEAN NOT NULL DEFAULT true,
    "section_width" "public"."SectionWidth" DEFAULT 'center',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortTestimonialSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortTestimonialItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "quote" TEXT NOT NULL,
    "user_image_url" TEXT,
    "user_name" TEXT NOT NULL,
    "user_designation" TEXT NOT NULL,
    "user_company" TEXT NOT NULL,
    "parent_section_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortTestimonialItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortWhoShouldApplySection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "section_width" "public"."SectionWidth" DEFAULT 'center',
    "is_section_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortWhoShouldApplySection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContentActionBlock" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "target" "public"."ContentActionBlockType" NOT NULL DEFAULT 'primary',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentActionBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContentListBlock" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentListBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContentListItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "contentListBlockId" TEXT,

    CONSTRAINT "ContentListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortFee" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Currency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FacultySubjectArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacultySubjectArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FacultySubSubjectArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subject_area_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacultySubSubjectArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Faculty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "preferred_name" TEXT,
    "title" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "note" TEXT,
    "profile_image" TEXT,
    "academic_partner_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "faculty_type" "public"."FacultyType" NOT NULL DEFAULT 'PROFESSOR_TIER_1',
    "faculty_code_id" TEXT,
    "facultySubjectAreaId" TEXT,
    "ownerId" TEXT,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FacultyCode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacultyCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" "public"."ContactRole" DEFAULT 'MANAGER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cohort_id" TEXT NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserRole" (
    "id" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'User',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "username" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "public"."Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "public"."_CohortToCohortFee" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CohortToCohortFee_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_FacultyToFacultySubSubjectArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FacultyToFacultySubSubjectArea_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_UserToUserRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserToUserRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicPartner_name_key" ON "public"."AcademicPartner"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicPartner_display_name_key" ON "public"."AcademicPartner"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "Program_program_key_key" ON "public"."Program"("program_key");

-- CreateIndex
CREATE UNIQUE INDEX "Program_program_key_id_key" ON "public"."Program"("program_key", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_cohort_key_key" ON "public"."Cohort"("cohort_key");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_media_section_id_key" ON "public"."Cohort"("media_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_microsite_section_id_key" ON "public"."Cohort"("microsite_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_overview_section_id_key" ON "public"."Cohort"("overview_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_benefits_section_id_key" ON "public"."Cohort"("benefits_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_curriculum_section_id_key" ON "public"."Cohort"("curriculum_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_statistics_section_id_key" ON "public"."Cohort"("statistics_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_faculty_section_id_key" ON "public"."Cohort"("faculty_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_industry_experts_section_id_key" ON "public"."Cohort"("industry_experts_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_certification_section_id_key" ON "public"."Cohort"("certification_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_testimonial_section_id_key" ON "public"."Cohort"("testimonial_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_who_should_apply_section_id_key" ON "public"."Cohort"("who_should_apply_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_cohort_branding_id_key" ON "public"."Cohort"("cohort_branding_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_design_curriculum_section_id_key" ON "public"."Cohort"("design_curriculum_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_cohort_key_id_key" ON "public"."Cohort"("cohort_key", "id");

-- CreateIndex
CREATE UNIQUE INDEX "CohortBranding_primary_color_id_key" ON "public"."CohortBranding"("primary_color_id");

-- CreateIndex
CREATE UNIQUE INDEX "CohortBranding_secondary_color_id_key" ON "public"."CohortBranding"("secondary_color_id");

-- CreateIndex
CREATE UNIQUE INDEX "CohortBranding_background_color_id_key" ON "public"."CohortBranding"("background_color_id");

-- CreateIndex
CREATE UNIQUE INDEX "CohortSectionMicrositeSection_custom_domain_key" ON "public"."CohortSectionMicrositeSection"("custom_domain");

-- CreateIndex
CREATE UNIQUE INDEX "MicrositePages_slug_key" ON "public"."MicrositePages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CohortStatisticsSection_work_experience_item_id_key" ON "public"."CohortStatisticsSection"("work_experience_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "CohortStatisticsSection_industry_item_id_key" ON "public"."CohortStatisticsSection"("industry_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "CohortStatisticsSection_designation_item_id_key" ON "public"."CohortStatisticsSection"("designation_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "CohortStatisticsSection_company_item_id_key" ON "public"."CohortStatisticsSection"("company_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "CohortFacultySectionItem_facultyId_parent_section_id_key" ON "public"."CohortFacultySectionItem"("facultyId", "parent_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_code_key" ON "public"."Currency"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FacultySubjectArea_name_key" ON "public"."FacultySubjectArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FacultySubSubjectArea_name_key" ON "public"."FacultySubSubjectArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_name_preferred_name_key" ON "public"."Faculty"("name", "preferred_name");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyCode_name_key" ON "public"."FacultyCode"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "public"."Authenticator"("credentialID");

-- CreateIndex
CREATE INDEX "_CohortToCohortFee_B_index" ON "public"."_CohortToCohortFee"("B");

-- CreateIndex
CREATE INDEX "_FacultyToFacultySubSubjectArea_B_index" ON "public"."_FacultyToFacultySubSubjectArea"("B");

-- CreateIndex
CREATE INDEX "_UserToUserRole_B_index" ON "public"."_UserToUserRole"("B");

-- AddForeignKey
ALTER TABLE "public"."Program" ADD CONSTRAINT "Program_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "public"."Enterprise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Program" ADD CONSTRAINT "Program_academic_partner_id_fkey" FOREIGN KEY ("academic_partner_id") REFERENCES "public"."AcademicPartner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."List" ADD CONSTRAINT "List_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_media_section_id_fkey" FOREIGN KEY ("media_section_id") REFERENCES "public"."CohortMediaSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_microsite_section_id_fkey" FOREIGN KEY ("microsite_section_id") REFERENCES "public"."CohortSectionMicrositeSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_overview_section_id_fkey" FOREIGN KEY ("overview_section_id") REFERENCES "public"."CohortOverviewSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_benefits_section_id_fkey" FOREIGN KEY ("benefits_section_id") REFERENCES "public"."CohortBenefitsSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_curriculum_section_id_fkey" FOREIGN KEY ("curriculum_section_id") REFERENCES "public"."CohortCurriculumSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_statistics_section_id_fkey" FOREIGN KEY ("statistics_section_id") REFERENCES "public"."CohortStatisticsSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_faculty_section_id_fkey" FOREIGN KEY ("faculty_section_id") REFERENCES "public"."CohortFacultySection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_industry_experts_section_id_fkey" FOREIGN KEY ("industry_experts_section_id") REFERENCES "public"."CohortIndustryExpertsSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_certification_section_id_fkey" FOREIGN KEY ("certification_section_id") REFERENCES "public"."CohortCertificationSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_testimonial_section_id_fkey" FOREIGN KEY ("testimonial_section_id") REFERENCES "public"."CohortTestimonialSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_who_should_apply_section_id_fkey" FOREIGN KEY ("who_should_apply_section_id") REFERENCES "public"."CohortWhoShouldApplySection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_cohort_branding_id_fkey" FOREIGN KEY ("cohort_branding_id") REFERENCES "public"."CohortBranding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_design_curriculum_section_id_fkey" FOREIGN KEY ("design_curriculum_section_id") REFERENCES "public"."DesignCohortCurriculumSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cohort" ADD CONSTRAINT "Cohort_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortBranding" ADD CONSTRAINT "CohortBranding_background_color_id_fkey" FOREIGN KEY ("background_color_id") REFERENCES "public"."ContentColorsBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortBranding" ADD CONSTRAINT "CohortBranding_primary_color_id_fkey" FOREIGN KEY ("primary_color_id") REFERENCES "public"."ContentColorsBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortBranding" ADD CONSTRAINT "CohortBranding_secondary_color_id_fkey" FOREIGN KEY ("secondary_color_id") REFERENCES "public"."ContentColorsBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MicrositePages" ADD CONSTRAINT "MicrositePages_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."CohortSectionMicrositeSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortBenefitsItem" ADD CONSTRAINT "CohortBenefitsItem_parent_section_id_fkey" FOREIGN KEY ("parent_section_id") REFERENCES "public"."CohortBenefitsSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortCurriculumItem" ADD CONSTRAINT "CohortCurriculumItem_parent_section_id_fkey" FOREIGN KEY ("parent_section_id") REFERENCES "public"."CohortCurriculumSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesignCohortCurriculumSectionItem" ADD CONSTRAINT "DesignCohortCurriculumSectionItem_parent_section_id_fkey" FOREIGN KEY ("parent_section_id") REFERENCES "public"."DesignCohortCurriculumSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesignCohortCurriculumSectionItem" ADD CONSTRAINT "DesignCohortCurriculumSectionItem_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "public"."Cohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesignCohortCurriculumObjective" ADD CONSTRAINT "DesignCohortCurriculumObjective_parent_section_id_fkey" FOREIGN KEY ("parent_section_id") REFERENCES "public"."DesignCohortCurriculumSectionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesignCohortCurriculumObjective" ADD CONSTRAINT "DesignCohortCurriculumObjective_designCohortCurriculumSess_fkey" FOREIGN KEY ("designCohortCurriculumSessionId") REFERENCES "public"."DesignCohortCurriculumSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesignCohortCurriculumSession" ADD CONSTRAINT "DesignCohortCurriculumSession_parent_section_id_fkey" FOREIGN KEY ("parent_section_id") REFERENCES "public"."DesignCohortCurriculumSectionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortStatisticsSection" ADD CONSTRAINT "CohortStatisticsSection_work_experience_item_id_fkey" FOREIGN KEY ("work_experience_item_id") REFERENCES "public"."CohortStatisticsWorkExperienceItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortStatisticsSection" ADD CONSTRAINT "CohortStatisticsSection_industry_item_id_fkey" FOREIGN KEY ("industry_item_id") REFERENCES "public"."CohortStatisticsIndustryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortStatisticsSection" ADD CONSTRAINT "CohortStatisticsSection_designation_item_id_fkey" FOREIGN KEY ("designation_item_id") REFERENCES "public"."CohortStatisticsDesignationItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortStatisticsSection" ADD CONSTRAINT "CohortStatisticsSection_company_item_id_fkey" FOREIGN KEY ("company_item_id") REFERENCES "public"."CohortStatisticsCompanyItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortStatisticsIndustryItem" ADD CONSTRAINT "CohortStatisticsIndustryItem_data_list_id_fkey" FOREIGN KEY ("data_list_id") REFERENCES "public"."ContentListBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortStatisticsDesignationItem" ADD CONSTRAINT "CohortStatisticsDesignationItem_data_list_id_fkey" FOREIGN KEY ("data_list_id") REFERENCES "public"."ContentListBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortFacultySectionItem" ADD CONSTRAINT "CohortFacultySectionItem_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "public"."Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortFacultySectionItem" ADD CONSTRAINT "CohortFacultySectionItem_parent_section_id_fkey" FOREIGN KEY ("parent_section_id") REFERENCES "public"."CohortFacultySection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortIndustryExpertsSectionItem" ADD CONSTRAINT "CohortIndustryExpertsSectionItem_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "public"."Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortIndustryExpertsSectionItem" ADD CONSTRAINT "CohortIndustryExpertsSectionItem_parent_section_id_fkey" FOREIGN KEY ("parent_section_id") REFERENCES "public"."CohortIndustryExpertsSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortTestimonialItem" ADD CONSTRAINT "CohortTestimonialItem_parent_section_id_fkey" FOREIGN KEY ("parent_section_id") REFERENCES "public"."CohortTestimonialSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentListItem" ADD CONSTRAINT "ContentListItem_contentListBlockId_fkey" FOREIGN KEY ("contentListBlockId") REFERENCES "public"."ContentListBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CohortFee" ADD CONSTRAINT "CohortFee_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "public"."Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FacultySubSubjectArea" ADD CONSTRAINT "FacultySubSubjectArea_subject_area_id_fkey" FOREIGN KEY ("subject_area_id") REFERENCES "public"."FacultySubjectArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Faculty" ADD CONSTRAINT "Faculty_academic_partner_id_fkey" FOREIGN KEY ("academic_partner_id") REFERENCES "public"."AcademicPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Faculty" ADD CONSTRAINT "Faculty_faculty_code_id_fkey" FOREIGN KEY ("faculty_code_id") REFERENCES "public"."FacultyCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Faculty" ADD CONSTRAINT "Faculty_facultySubjectAreaId_fkey" FOREIGN KEY ("facultySubjectAreaId") REFERENCES "public"."FacultySubjectArea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Faculty" ADD CONSTRAINT "Faculty_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CohortToCohortFee" ADD CONSTRAINT "_CohortToCohortFee_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CohortToCohortFee" ADD CONSTRAINT "_CohortToCohortFee_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."CohortFee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FacultyToFacultySubSubjectArea" ADD CONSTRAINT "_FacultyToFacultySubSubjectArea_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FacultyToFacultySubSubjectArea" ADD CONSTRAINT "_FacultyToFacultySubSubjectArea_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."FacultySubSubjectArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserToUserRole" ADD CONSTRAINT "_UserToUserRole_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserToUserRole" ADD CONSTRAINT "_UserToUserRole_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."UserRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
