import { z } from "zod";

export const requiredErrorText = "This is a required field.";

export interface CachedFormData {
  careerDetails: CareerDetailsFormData | null;
  cvReview: CvReviewFormData | null;
  aiInterview: AiInterviewFormData | null;
  pipelineStages: any;
}

// Career Details Schema
export const careerDetailsSchema = z
  .object({
    jobTitle: z.string().min(1, requiredErrorText),
    description: z.string().min(1, requiredErrorText),
    employmentType: z.string().min(1, requiredErrorText),
    workSetup: z.string().min(1, requiredErrorText),
    country: z.string().min(1, requiredErrorText),
    province: z.string().min(1, requiredErrorText),
    city: z.string().min(1, requiredErrorText),
    minimumSalary: z
      .transform(Number)
      .pipe(z.number(requiredErrorText).gt(0, requiredErrorText)),
    maximumSalary: z
      .transform(Number)
      .pipe(z.number(requiredErrorText).gt(0, requiredErrorText)),
    salaryNegotiable: z.boolean(),
  })
  .refine(
    (data) => {
      if (
        data.minimumSalary !== undefined &&
        data.maximumSalary !== undefined
      ) {
        return (
          data.minimumSalary >= 0 &&
          data.maximumSalary >= 0 &&
          data.minimumSalary < data.maximumSalary
        );
      }
      return true;
    },
    {
      message: "Minimum salary must be less than maximum salary",
      path: ["minimumSalary"],
    }
  );

export type CareerDetailsFormData = z.infer<typeof careerDetailsSchema>;

export const AddCareerRequestSchema = careerDetailsSchema.safeExtend({
  orgID: z.string(),
  lastEditedBy: z.any(),
  createdBy: z.any(),
  status: z.string(),
});

// CV Review Schema
const optionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Option name cannot be empty"),
});

export const preScreeningQuestionSchema = z
  .object({
    id: z.string(),
    question: z.string().min(1, "Question cannot be empty"),
    type: z.enum([
      "Short answer",
      "Long answer",
      "Dropdown",
      "Checkboxes",
      "Range",
    ]),
    options: z.array(optionSchema).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "Dropdown" || data.type === "Checkboxes") {
        return data.options && data.options.length > 0;
      }
      return true;
    },
    {
      message: "At least one option is required for Dropdown and Checkboxes",
      path: ["options"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "Range") {
        return (
          data.min !== undefined &&
          data.max !== undefined &&
          data.min >= 0 &&
          data.max >= 0 &&
          data.min < data.max
        );
      }
      return true;
    },
    {
      message: "Range must have valid min and max values (min < max)",
      path: ["min"],
    }
  );

export const CvReviewSchema = z.object({
  cvScreeningSetting: z.string().min(1, requiredErrorText),
  cvSecretPrompt: z.string().optional(),
  preScreeningQuestions: z.array(preScreeningQuestionSchema).optional(),
});

export type CvReviewFormData = z.infer<typeof CvReviewSchema>;

// AI Interview Schema
export interface InterviewQuestion {
  id: string;
  question: string;
}

export interface AiInterviewQuestions {
  id: number;
  category: string;
  questionCountToAsk: number | null;
  questions: InterviewQuestion[];
}

const interviewQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, "Question cannot be empty"),
});

const aiInterviewQuestionsSchema = z.object({
  id: z.number(),
  category: z.string(),
  questionCountToAsk: z.number().nullable(),
  questions: z.array(interviewQuestionSchema),
});

export const AiInterviewSchema = z.object({
  aiScreeningSetting: z.string().min(1, requiredErrorText),
  aiSecretPrompt: z.string().optional(),
  requireVideo: z.boolean(),
  aiInterviewQuestions: z.array(aiInterviewQuestionsSchema).refine(
    (questions) => {
      return questions.every((q) => q.questions.length > 0);
    },
    {
      message: "Each category must have at least one question",
    }
  ),
});

export type AiInterviewFormData = z.infer<typeof AiInterviewSchema>;

export const PipelineStagesSchema = z.object({
  pipelineStages: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Pipeline stage name cannot be empty"),
    })
  ),
});

export type PipelineStagesFormData = z.infer<typeof PipelineStagesSchema>;

// Update Career Request Schema
export const UpdateCareerRequestSchema = z
  .object({
    ...AddCareerRequestSchema.shape,
    ...CvReviewSchema.shape,
    ...AiInterviewSchema.shape,
    ...PipelineStagesSchema.shape,
    updatedAt: z.date(),
  })
  .partial()
  .extend({
    _id: z.string(),
  });
