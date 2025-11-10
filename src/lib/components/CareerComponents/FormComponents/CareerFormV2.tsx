"use client";

import { useRef, useState } from "react";
import { candidateActionToast, errorToast, successToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";
import CareerActionModal from "../CareerActionModal";
import FullScreenLoadingAnimation from "../FullScreenLoadingAnimation";
import { SegmentedFormProgressBar } from "./SegmentedFormProgressBar";
import { CareerDetailsSection } from "../FormSections/CareerDetailsSection";
import { CvReviewSection } from "../FormSections/CvReviewSection";
import { AiIntervewSection } from "../FormSections/AiIntervewSection";
import { Button } from "./Button";
import { assetConstants } from "@/lib/utils/constantsV2";
import { PipelineStagesSection } from "../FormSections/PipelineStagesSection";
import { CachedFormData } from "@/lib/types/careerFormTypes";

const steps = [
  "Career Details & Team Access",
  "CV Review & Pre-Screening",
  "AI Interview Setup",
  "Pipeline Stages",
  "Review Career",
];

const TopBar = ({
  hasErrors,
  onSubmit,
  onTestSubmit,
}: {
  hasErrors: boolean;
  onSubmit: () => void;
  onTestSubmit: () => void;
}) => {
  return (
    <div
      style={{
        marginBottom: "24px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#181D27" }}>
        Add new career
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Button
          text="Save as Unpublished"
          variant="secondary"
          onClick={() => onTestSubmit()}
          disabled={hasErrors}
        />
        <Button
          text="Save and Continue"
          variant="primary"
          onClick={() => onSubmit()}
          disabled={hasErrors}
        >
          <img src={assetConstants.arrowWhite} alt="arrow" />
        </Button>
      </div>
    </div>
  );
};

export default function SegmentedCareerForm({
  formType,
}: {
  formType: string;
}) {
  const [isSavingCareer, setIsSavingCareer] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState("");
  // const savingCareerRef = useRef(false);

  // Cached data
  const [cachedFormData, setCachedFormData] = useState<CachedFormData>({
    careerDetails: null,
    cvReview: null,
    aiInterview: null,
    pipelineStages: null,
  });
  const [careerID, setCareerID] = useState<string | null>(null);

  // Segmented Form Steps
  const [currentStep, setCurrentStep] = useState(steps[0]);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  // Refs for form sections
  const careerDetailsSectionRef = useRef(null);
  const cvReviewSectionRef = useRef(null);
  const aiInterviewSectionRef = useRef(null);
  const pipelineStagesSectionRef = useRef(null);

  const updateCachedFormData = (section: keyof CachedFormData, data: any) => {
    setCachedFormData({ ...cachedFormData, [section]: data });
  };

  const moveNextStep = () => {
    if (steps.indexOf(currentStep) === steps.length - 1) return;
    setCurrentStep(steps[steps.indexOf(currentStep) + 1]);
  };

  const onSubmit = () => {
    // Trigger form submission based on current step
    if (currentStep === steps[0]) {
      careerDetailsSectionRef.current?.onClick();
      console.log("Career Details section submit");
    } else if (currentStep === steps[1]) {
      cvReviewSectionRef.current?.onClick();
      console.log("CV Review section submit");
    } else if (currentStep === steps[2]) {
      aiInterviewSectionRef.current?.onClick();
      console.log("AI Interview section submit");
    } else if (currentStep === steps[3]) {
      pipelineStagesSectionRef.current?.onClick();
      console.log("Pipeline Stages section submit");
    }
  };

  const onTestSubmit = () => {
    // errorToast("Please fill in all fields", 1300);

    // successToast("Career added successfully", 1300);
    // candidateActionToast(
    //   <div
    //     style={{
    //       display: "flex",
    //       flexDirection: "row",
    //       alignItems: "center",
    //       gap: 8,
    //       marginLeft: 8,
    //     }}
    //   >
    //     <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>
    //       Career added successfully
    //     </span>
    //   </div>,
    //   1300,
    //   <i
    //     className="la la-check-circle"
    //     style={{ color: "#039855", fontSize: 32 }}
    //   ></i>
    // );
    // setShowSaveModal("active");
    setIsSavingCareer(true);
    setTimeout(() => {
      setIsSavingCareer(false);
    }, 1300);
  };

  return (
    <div className="col" style={{ marginBottom: "32px" }}>
      {formType === "add" && (
        <TopBar
          onSubmit={onSubmit}
          hasErrors={hasErrors}
          onTestSubmit={onTestSubmit}
        />
      )}

      <SegmentedFormProgressBar
        steps={steps}
        currentStep={currentStep}
        hasErrors={hasErrors}
        hasChanges={hasChanges}
        onClick={setCurrentStep}
      />

      {currentStep === steps[0] && (
        <CareerDetailsSection
          ref={careerDetailsSectionRef}
          setHasChanges={setHasChanges}
          setHasErrors={setHasErrors}
          setIsSavingCareer={setIsSavingCareer}
          data={cachedFormData.careerDetails}
          onDataChange={(data: any) =>
            updateCachedFormData("careerDetails", data)
          }
          moveNextStep={moveNextStep}
          setCareerID={setCareerID}
        />
      )}
      {currentStep === steps[1] && (
        <CvReviewSection
          ref={cvReviewSectionRef}
          setHasChanges={setHasChanges}
          setHasErrors={setHasErrors}
          setIsSavingCareer={setIsSavingCareer}
          data={cachedFormData.cvReview}
          onDataChange={(data: any) => updateCachedFormData("cvReview", data)}
          moveNextStep={moveNextStep}
          careerID={careerID}
        />
      )}
      {currentStep === steps[2] && (
        <AiIntervewSection
          ref={aiInterviewSectionRef}
          setHasChanges={setHasChanges}
          setHasErrors={setHasErrors}
          setIsSavingCareer={setIsSavingCareer}
          data={cachedFormData.aiInterview}
          onDataChange={(data: any) =>
            updateCachedFormData("aiInterview", data)
          }
          moveNextStep={moveNextStep}
          careerID={careerID}
          jobTitle={cachedFormData.careerDetails?.jobTitle}
          description={cachedFormData.careerDetails?.description}
        />
      )}
      {currentStep === steps[3] && (
        <PipelineStagesSection
          ref={pipelineStagesSectionRef}
          moveNextStep={moveNextStep}
        />
      )}

      {showSaveModal && (
        <CareerActionModal
          action={showSaveModal}
          onAction={(action) => console.log("action", action)}
        />
      )}
      {isSavingCareer && (
        <FullScreenLoadingAnimation
          title={formType === "add" ? "Saving career..." : "Updating career..."}
          subtext={`Please wait while we are ${
            formType === "add" ? "saving" : "updating"
          } the career`}
        />
      )}
    </div>
  );
}
