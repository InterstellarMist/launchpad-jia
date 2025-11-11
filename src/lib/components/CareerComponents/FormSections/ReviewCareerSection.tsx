import { Ref, useImperativeHandle } from "react";
import { CachedFormData } from "@/lib/types/careerFormTypes";
import { useAppContext } from "@/lib/context/AppContext";
import { errorToast, successToast } from "@/lib/Utils";
import axios from "axios";
import {
  CareerDetailsSummaryCard,
  CvReviewSummaryCard,
  AiInterviewSummaryCard,
  PipelineStagesSummaryCard,
} from "./SummaryCards";

interface ReviewCareerSectionRef {
  onClick: (status: string) => void;
}

export const ReviewCareerSection = ({
  ref,
  data,
  onDataChange,
  moveNextStep,
  careerID,
  setIsSavingCareer,
}: {
  ref: Ref<ReviewCareerSectionRef>;
  data: CachedFormData;
  onDataChange: (data: any) => void;
  moveNextStep: () => void;
  careerID: string;
  setIsSavingCareer: (isSavingCareer: boolean) => void;
}) => {
  const { user } = useAppContext();
  const onSubmit = async (status: string) => {
    if (!careerID) {
      errorToast("Career ID is missing", 1300);
      return;
    }

    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };

    try {
      setIsSavingCareer(true);
      const response = await axios.post("/api/update-career", {
        _id: careerID,
        status,
        lastEditedBy: userInfoSlice,
      });

      if (response.status === 200) {
        successToast(
          status === "active"
            ? "Career published successfully"
            : "Career saved successfully",
          1300
        );
        window.location.href =
          "/recruiter-dashboard/careers/manage/" + careerID;
      }
    } catch (error) {
      console.error(
        status === "active"
          ? "Error publishing career:"
          : "Error saving career:",
        error
      );
      errorToast(
        status === "active"
          ? "Failed to publish career"
          : "Failed to save career",
        1300
      );
    } finally {
      setIsSavingCareer(false);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      onClick: (status: string) => {
        onSubmit(status);
      },
    }),
    [onSubmit]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        width: "100%",
        paddingBottom: 32,
      }}
    >
      <CareerDetailsSummaryCard data={data.careerDetails} />
      <CvReviewSummaryCard data={data.cvReview} />
      <AiInterviewSummaryCard data={data.aiInterview} />
      <PipelineStagesSummaryCard data={data.pipelineStages} />
    </div>
  );
};
