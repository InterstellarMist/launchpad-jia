import { useImperativeHandle, Ref, useEffect } from "react";
import { Card } from "../FormComponents/Card";
import { Label } from "../FormComponents/Label";
import { Textarea } from "../FormComponents/Textarea";
import { assetConstants } from "@/lib/utils/constantsV2";
import InterviewQuestionGeneratorV2 from "../InterviewQuestionGeneratorV2";
import { DropdownInput } from "../FormComponents/DropdownInput";
import { useForm, Control, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAppContext } from "@/lib/context/AppContext";
import { successToast, errorToast } from "@/lib/Utils";
import {
  AiInterviewSchema,
  AiInterviewFormData,
  InterviewQuestion,
  AiInterviewQuestions,
} from "@/lib/types/careerFormTypes";
import { TipsCard } from "../FormComponents/TipsCard";

const screeningSettingList = [
  {
    name: "Good Fit and above",
    icon: "la la-check",
  },
  {
    name: "Only Strong Fit",
    icon: "la la-check-double",
  },
  {
    name: "No Automatic Promotion",
    icon: "la la-times",
  },
];

const tips = [
  {
    statement: "Add a Secret Prompt ",
    description:
      "to fine-tune how Jia scores and evaluates the interview responses",
  },
  {
    statement: "Use “Generate Questions” ",
    description:
      "to quickly create tailored interview questions, then refine or mix them with your own for balanced results.",
  },
];

const defaultInterviewQuestions = [
  {
    id: 1,
    category: "CV Validation / Experience",
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: 2,
    category: "Technical",
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: 3,
    category: "Behavioral",
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: 4,
    category: "Analytical",
    questionCountToAsk: null,
    questions: [],
  },
  {
    id: 5,
    category: "Others",
    questionCountToAsk: null,
    questions: [],
  },
];

const AiInterviewSettingsCard = ({
  control,
}: {
  control: Control<AiInterviewFormData>;
}) => {
  return (
    <Card title="1. AI Interview Settings">
      <div>
        <Label
          text="AI Interview Screening"
          subtitle="Jia automatically endorses candidates who meet the chosen criteria."
        />
        <div style={{ width: 320 }}>
          <DropdownInput
            label=""
            control={control}
            name="aiScreeningSetting"
            options={screeningSettingList}
            placeholder="Choose AI interview screening setting"
          />
        </div>
        <hr style={{ margin: "24px 0", borderColor: "#E9EAEB" }} />

        <Label
          text="Require Video on Interview"
          subtitle="Require candidates to keep their camera on. Recordings will appear on their analysis page."
        />
        <Controller
          control={control}
          name="requireVideo"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <img
                    src={assetConstants["videocam"]}
                    alt="videocam"
                    height={24}
                    width={24}
                  />
                  <span
                    style={{ fontSize: 16, color: "#414651", fontWeight: 500 }}
                  >
                    Require Video Interview
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span
                    style={{ fontSize: 16, color: "#414651", fontWeight: 500 }}
                  >
                    {value ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              {error && (
                <p
                  style={{
                    color: "#F04438",
                    fontSize: 14,
                    marginBottom: 0,
                    marginTop: 6,
                    fontWeight: 400,
                  }}
                >
                  {error.message}
                </p>
              )}
            </div>
          )}
        />

        <hr style={{ margin: "24px 0", borderColor: "#E9EAEB" }} />
        <Label
          isOptional
          icon="star"
          text="AI Interview Secret Prompt"
          subtitle="Secret Prompts give you extra control over Jia's evaluation style, complementing her accurate assessment of requirements from the job description."
        />
        <Controller
          control={control}
          name="aiSecretPrompt"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <Textarea
                value={value || ""}
                onChange={onChange}
                placeholder="Enter a secret prompt (e.g. Treat candidates who speak in Taglish, English, or Tagalog equally. Focus on clarity, coherence, and confidence rather than language preference or accent.)"
              />
              {error && (
                <p
                  style={{
                    color: "#F04438",
                    fontSize: 14,
                    marginBottom: 0,
                    marginTop: 6,
                    fontWeight: 400,
                  }}
                >
                  {error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </Card>
  );
};

interface AiInterviewSectionRef {
  onClick: () => void;
}

export const AiIntervewSection = ({
  ref,
  setHasChanges,
  setHasErrors,
  setIsSavingCareer,
  data,
  onDataChange,
  moveNextStep,
  careerID,
  jobTitle,
  description,
}: {
  ref: Ref<AiInterviewSectionRef>;
  setHasChanges: (hasChanges: boolean) => void;
  setHasErrors: (hasErrors: boolean) => void;
  setIsSavingCareer: (isSavingCareer: boolean) => void;
  data: AiInterviewFormData | null;
  onDataChange: (data: any) => void;
  moveNextStep: () => void;
  careerID: string;
  jobTitle: string;
  description: string;
}) => {
  const { user } = useAppContext();
  const { control, handleSubmit, formState } = useForm<AiInterviewFormData>({
    resolver: zodResolver(AiInterviewSchema),
    defaultValues: {
      aiScreeningSetting: data?.aiScreeningSetting || "Good Fit and above",
      aiSecretPrompt: data?.aiSecretPrompt || "",
      requireVideo: data?.requireVideo ?? true,
      aiInterviewQuestions:
        data?.aiInterviewQuestions || defaultInterviewQuestions,
    },
  });

  useEffect(() => {
    setHasChanges(formState.isDirty);
    setHasErrors(Object.keys(formState.errors).length > 0);
  }, [formState]);

  const onSubmit = async (data: AiInterviewFormData) => {
    console.log("AI Interview form submitted successfully:", data);

    onDataChange(data);

    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };

    const aiInterviewData = {
      ...data,
      lastEditedBy: userInfoSlice,
      _id: careerID,
    };

    console.log("AI Interview data:", aiInterviewData);

    try {
      setIsSavingCareer(true);
      const response = await axios.post("/api/update-career", aiInterviewData);
      if (response.status === 200) {
        successToast("AI Interview updated successfully", 1300);
        onDataChange(data);
        moveNextStep();
      }
    } catch (error) {
      console.error(error);
      errorToast("Failed to update AI Interview", 1300);
    } finally {
      setIsSavingCareer(false);
    }
  };

  const onError = (errors: any) => {
    console.log("Validation errors preventing submission:", errors);
  };

  useImperativeHandle(
    ref,
    () => ({
      onClick: () => {
        handleSubmit(onSubmit, onError)();
      },
    }),
    [handleSubmit, onSubmit, onError]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <AiInterviewSettingsCard control={control} />

          <Controller
            control={control}
            name="aiInterviewQuestions"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <InterviewQuestionGeneratorV2
                  questions={value || []}
                  setQuestions={onChange}
                  jobTitle={jobTitle}
                  description={description}
                />
                {error && (
                  <p
                    style={{
                      color: "#F04438",
                      fontSize: 14,
                      marginBottom: 0,
                      marginTop: 6,
                      fontWeight: 400,
                    }}
                  >
                    {error.message ||
                      "Please ensure each category has at least one question"}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <div
          style={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <TipsCard tips={tips} />
        </div>
      </div>
    </form>
  );
};
