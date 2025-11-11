import { useImperativeHandle, Ref, useEffect } from "react";
import { Card } from "../FormComponents/Card";
import { Label } from "../FormComponents/Label";
import { Textarea } from "../FormComponents/Textarea";
import { PreScreeningQuestionsCard } from "../FormComponents/PreScreeningQuestionsCard";
import { DropdownInput } from "../FormComponents/DropdownInput";
import { useForm, Control, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAppContext } from "@/lib/context/AppContext";
import { successToast, errorToast } from "@/lib/Utils";
import { CvReviewSchema, CvReviewFormData } from "@/lib/types/careerFormTypes";
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
    description: "to fine-tune how Jia scores and evaluates submitted CVs.",
  },
  {
    statement: "Add Pre-Screening questions ",
    description:
      "to collect key details such as notice period, work setup, or salary expectations to guide your review and candidate discussions.",
  },
];

const CvReviewSettingsCard = ({
  control,
}: {
  control: Control<CvReviewFormData>;
}) => {
  return (
    <Card title="1. CV Review Settings">
      <div>
        <Label
          text="CV Screening"
          subtitle="Jia automatically endorses candidates who meet the chosen criteria."
        />
        <div style={{ width: 320 }}>
          <DropdownInput
            label=""
            control={control}
            name="cvScreeningSetting"
            options={screeningSettingList}
            placeholder="Choose CV screening setting"
          />
        </div>
        <hr style={{ margin: "24px 0", borderColor: "#E9EAEB" }} />
        <Label
          isOptional
          icon="star"
          text="CV Secret Prompt"
          subtitle="Secret Prompts give you extra control over Jia's evaluation style, complementing her accurate assessment of requirements from the job description."
        />
        <Controller
          control={control}
          name="cvSecretPrompt"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <Textarea
                value={value || ""}
                onChange={onChange}
                placeholder="Enter a secret prompt (e.g. Give higher fit scores to candidates who participate in hackathons or competitions.)"
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

interface CvReviewSectionRef {
  onClick: () => void;
}

export const CvReviewSection = ({
  ref,
  setHasChanges,
  setHasErrors,
  setIsSavingCareer,
  data,
  onDataChange,
  moveNextStep,
  careerID,
}: {
  ref: Ref<CvReviewSectionRef>;
  setHasChanges: (hasChanges: boolean) => void;
  setHasErrors: (hasErrors: boolean) => void;
  setIsSavingCareer: (isSavingCareer: boolean) => void;
  data: CvReviewFormData | null;
  onDataChange: (data: any) => void;
  moveNextStep: () => void;
  careerID: string;
}) => {
  const { user } = useAppContext();
  const { control, handleSubmit, formState } = useForm<CvReviewFormData>({
    resolver: zodResolver(CvReviewSchema),
    defaultValues: {
      cvScreeningSetting: data?.cvScreeningSetting || "Good Fit and above",
      cvSecretPrompt: data?.cvSecretPrompt || "",
      preScreeningQuestions: data?.preScreeningQuestions || [],
    },
  });

  useEffect(() => {
    setHasChanges(formState.isDirty);
    setHasErrors(Object.keys(formState.errors).length > 0);
  }, [formState]);

  const onSubmit = async (data: CvReviewFormData) => {
    console.log("CV Review form submitted successfully:", data);

    onDataChange(data);

    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };

    const cvReviewData = {
      ...data,
      lastEditedBy: userInfoSlice,
      _id: careerID,
    };

    console.log("CV Review data:", cvReviewData);

    try {
      setIsSavingCareer(true);
      const response = await axios.post("/api/update-career", cvReviewData);
      if (response.status === 200) {
        successToast("CV Review updated successfully", 1300);
        onDataChange(data);
        moveNextStep();
      }
    } catch (error) {
      console.error(error);
      errorToast("Failed to update CV Review", 1300);
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
          <CvReviewSettingsCard control={control} />
          <Controller
            control={control}
            name="preScreeningQuestions"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                <PreScreeningQuestionsCard
                  value={value || []}
                  onChange={onChange}
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
                      "Please fix the errors in pre-screening questions"}
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
