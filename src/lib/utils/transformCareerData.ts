import { CachedFormData } from "@/lib/types/careerFormTypes";

/**
 * Transforms flat formData structure (from JobDescription) to nested CachedFormData structure
 * @param formData - Flat form data object from JobDescription component
 * @returns CachedFormData - Nested structure used by ReviewCareerSection and summary cards
 */
export function transformFormDataToCachedData(formData: any): CachedFormData {
  return {
    careerDetails: formData
      ? {
          jobTitle: formData.jobTitle || "",
          description: formData.description || "",
          employmentType: formData.employmentType || "",
          workSetup: formData.workSetup || "",
          country: formData.country || "Philippines",
          province: formData.province || "",
          city: formData.location || formData.city || "",
          minimumSalary: formData.minimumSalary || 0,
          maximumSalary: formData.maximumSalary || 0,
          salaryNegotiable: formData.salaryNegotiable ?? true,
        }
      : null,
    cvReview: formData
      ? {
          cvScreeningSetting:
            formData.cvScreeningSetting ||
            formData.screeningSetting ||
            "Good Fit and above",
          cvSecretPrompt: formData.cvSecretPrompt || undefined,
          preScreeningQuestions: formData.preScreeningQuestions || undefined,
        }
      : null,
    aiInterview: formData
      ? {
          aiScreeningSetting:
            formData.aiScreeningSetting ||
            formData.screeningSetting ||
            "Good Fit and above",
          aiSecretPrompt: formData.aiSecretPrompt || undefined,
          requireVideo: formData.requireVideo ?? true,
          aiInterviewQuestions: formData.questions || [],
        }
      : null,
    pipelineStages: formData?.pipelineStages || [],
  };
}
