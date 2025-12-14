"use server";

import { CohortSectionType } from "@/modules/common/database/prisma";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { getLoggedInUser } from "@/modules/user/utils";

export async function handleUpdateSectionPositions() {
  const cohorts = await primaryDB.cohort.findMany({
    select: {
      id: true,
      overview_section_id: true,
      benefits_section_id: true,
      design_curriculum_section_id: true,
      faculty_section_id: true,
      industry_experts_section_id: true,
      statistics_section_id: true,
      certification_section_id: true,
      testimonial_section_id: true,
      who_should_apply_section_id: true,
    },
  });

  for (const cohort of cohorts) {
    const user = await getLoggedInUser();
    const commonObject = {
      cohort_id: cohort.id,
      updated_by_id: user.id,
    };

    await primaryDB.cohortSectionOrder.createMany({
      data: [
        {
          ...commonObject,
          section_type: CohortSectionType.overview_section,
          section_id: cohort.overview_section_id!,
          section_position: 1,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.benefits_section,
          section_id: cohort.benefits_section_id!,
          section_position: 2,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.design_curriculum_section,
          section_id: cohort.design_curriculum_section_id!,
          section_position: 3,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.faculty_section,
          section_id: cohort.faculty_section_id!,
          section_position: 4,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.industry_experts_section,
          section_id: cohort.industry_experts_section_id!,
          section_position: 5,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.statistics_section,
          section_id: cohort.statistics_section_id!,
          section_position: 6,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.certification_section,
          section_id: cohort.certification_section_id!,
          section_position: 7,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.testimonial_section,
          section_id: cohort.testimonial_section_id!,
          section_position: 8,
        },
        {
          ...commonObject,
          section_type: CohortSectionType.who_should_apply_section,
          section_id: cohort.who_should_apply_section_id!,
          section_position: 9,
        },
      ],
    });
  }

  console.log("Section positions updated successfully");
  return true;
}

const OLD_CDN = "https://xite.xedinstitute.org/api/v1/";
const NEW_CDN = process.env.FILE_CDN_API_BASE_URL!;

if (!NEW_CDN) {
  throw new Error(
    "❌ FILE_CDN_API_BASE_URL is not set in environment variables"
  );
}

// ✅ Utility function to safely update URLs
function fixCdnUrl(url?: string | null): string | null {
  if (!url) return null;
  // If already uses new CDN, return as-is
  if (url.startsWith(NEW_CDN)) return url;
  // If contains old CDN, replace it
  if (url.startsWith(OLD_CDN)) {
    return url.replace(OLD_CDN, `${NEW_CDN}/`);
  }
  // Else treat it as relative or wrong — extract file part and prepend new CDN
  const parts = url.split("/api/v1/");
  if (parts.length > 1) return `${NEW_CDN}/${parts[1]}`;
  return url;
}

export async function handleUpdateMediaUrls() {
  console.log("🚀 Starting CDN URL correction...");

  // === FACULTY TABLE ===
  const faculty = await primaryDB.faculty.findMany({
    where: { profile_image: { not: null } },
    select: { id: true, profile_image: true },
  });

  for (const f of faculty) {
    const fixed = fixCdnUrl(f.profile_image);
    if (fixed !== f.profile_image) {
      await primaryDB.faculty.update({
        where: { id: f.id },
        data: { profile_image: fixed },
      });
    }
  }

  // === ACADEMIC PARTNER ===
  const university = await primaryDB.academicPartner.findMany({
    where: { logo_url: { not: null } },
    select: { id: true, logo_url: true },
  });

  for (const u of university) {
    const fixed = fixCdnUrl(u.logo_url);
    if (fixed !== u.logo_url) {
      await primaryDB.academicPartner.update({
        where: { id: u.id },
        data: { logo_url: fixed },
      });
    }
  }

  // === BENEFITS ITEM ===
  const benefits = await primaryDB.cohortBenefitsItem.findMany({
    where: { icon_image_url: { not: null } },
    select: { id: true, icon_image_url: true },
  });

  for (const b of benefits) {
    const fixed = fixCdnUrl(b.icon_image_url);
    if (fixed !== b.icon_image_url) {
      await primaryDB.cohortBenefitsItem.update({
        where: { id: b.id },
        data: { icon_image_url: fixed },
      });
    }
  }

  // === MEDIA SECTION ===
  const media = await primaryDB.cohortMediaSection.findMany({
    select: {
      id: true,
      brochure_url: true,
      university_logo_url: true,
      university_banner_url: true,
      banner_image_url: true,
    },
  });

  for (const m of media) {
    const fixedData = {
      brochure_url: fixCdnUrl(m.brochure_url),
      university_logo_url: fixCdnUrl(m.university_logo_url),
      university_banner_url: fixCdnUrl(m.university_banner_url),
      banner_image_url: fixCdnUrl(m.banner_image_url),
    };

    await primaryDB.cohortMediaSection.update({
      where: { id: m.id },
      data: fixedData,
    });
  }

  // === TESTIMONIALS ===
  const testimonials = await primaryDB.cohortTestimonialItem.findMany({
    where: { user_image_url: { not: null } },
    select: { id: true, user_image_url: true },
  });

  for (const t of testimonials) {
    const fixed = fixCdnUrl(t.user_image_url);
    if (fixed !== t.user_image_url) {
      await primaryDB.cohortTestimonialItem.update({
        where: { id: t.id },
        data: { user_image_url: fixed },
      });
    }
  }

  // === CERTIFICATES ===
  const certificates = await primaryDB.cohortCertificationSection.findMany({
    where: { certificate_image_url: { not: null } },
    select: { id: true, certificate_image_url: true },
  });

  for (const c of certificates) {
    const fixed = fixCdnUrl(c.certificate_image_url);
    if (fixed !== c.certificate_image_url) {
      await primaryDB.cohortCertificationSection.update({
        where: { id: c.id },
        data: { certificate_image_url: fixed },
      });
    }
  }

  // === STATISTICS (WORK EXPERIENCE) ===
  const stats = await primaryDB.cohortStatisticsWorkExperienceItem.findMany({
    where: { chart_image_url: { not: null } },
    select: { id: true, chart_image_url: true },
  });

  for (const s of stats) {
    const fixed = fixCdnUrl(s.chart_image_url);
    if (fixed !== s.chart_image_url) {
      await primaryDB.cohortStatisticsWorkExperienceItem.update({
        where: { id: s.id },
        data: { chart_image_url: fixed },
      });
    }
  }

  // === COMPANY LOGOS ===
  const companies = await primaryDB.cohortStatisticsCompanyItem.findMany({
    where: { image_url: { not: null } },
    select: { id: true, image_url: true },
  });

  for (const c of companies) {
    const fixed = fixCdnUrl(c.image_url);
    if (fixed !== c.image_url) {
      await primaryDB.cohortStatisticsCompanyItem.update({
        where: { id: c.id },
        data: { image_url: fixed },
      });
    }
  }

  console.log("✅ All CDN URLs updated successfully!");
  return true;
}
