"use client";

import { useRef, useState, useEffect } from "react";
import { candidateActionToast, errorToast, successToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";
import axios from "axios";
import CareerActionModal from "../CareerActionModal";
import FullScreenLoadingAnimation from "../FullScreenLoadingAnimation";
import { SegmentedFormProgressBar } from "./SegmentedFormProgressBar";
import { CareerDetailsSection } from "../FormSections/CareerDetailsSection";
import { CvReviewSection } from "../FormSections/CvReviewSection";
import { AiIntervewSection } from "../FormSections/AiIntervewSection";
import { Button } from "./Button";
import { assetConstants } from "@/lib/utils/constantsV2";
import { PipelineStagesSection } from "../FormSections/PipelineStagesSection";
import { ReviewCareerSection } from "../FormSections/ReviewCareerSection";
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
  cachedFormData,
  currentStep,
}: {
  hasErrors: boolean;
  onSubmit: (status: string) => void;
  cachedFormData: CachedFormData;
  currentStep: string;
}) => {
  const jobTitle = cachedFormData?.careerDetails?.jobTitle;
  const isReviewStep = currentStep === steps[4];

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
        {jobTitle ? (
          <>
            <span style={{ color: "#717680" }}>[Draft] </span>
            {jobTitle}
          </>
        ) : (
          "Add new career"
        )}
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
          onClick={() => onSubmit("inactive")}
          disabled={hasErrors}
        />
        <Button
          icon={isReviewStep && assetConstants.checkCircle}
          text={isReviewStep ? "Publish" : "Save and Continue"}
          variant="primary"
          onClick={() => onSubmit(isReviewStep ? "active" : "inactive")}
          disabled={hasErrors}
        >
          {!isReviewStep && <img src={assetConstants.arrowWhite} alt="arrow" />}
        </Button>
      </div>
    </div>
  );
};

export default function SegmentedCareerForm({
  formType,
  careerID: initialCareerID,
}: {
  formType: string;
  careerID?: string;
}) {
  const [isSavingCareer, setIsSavingCareer] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState("");
  const [isLoadingCareerData, setIsLoadingCareerData] = useState(false);
  // const savingCareerRef = useRef(false);

  // Cached data
  const [cachedFormData, setCachedFormData] = useState<CachedFormData>({
    careerDetails: null,
    cvReview: null,
    aiInterview: null,
    pipelineStages: null,
  });
  const { orgID, user } = useAppContext();
  const [careerID, setCareerID] = useState<string | null>(
    initialCareerID || null
  );

  // Segmented Form Steps
  const [currentStep, setCurrentStep] = useState(steps[0]);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  // Fetch career data when editing
  useEffect(() => {
    const fetchCareerData = async () => {
      if (formType === "edit" && careerID) {
        setIsLoadingCareerData(true);
        try {
          const response = await axios.post("/api/career-data", {
            id: careerID,
            orgID,
          });

          const careerData = response.data;

          // Map fetched career data to cachedFormData structure
          setCachedFormData({
            careerDetails: {
              jobTitle: careerData.jobTitle || "",
              description: careerData.description || "",
              employmentType: careerData.employmentType || "",
              workSetup: careerData.workSetup || "",
              country: careerData.country || "Philippines",
              province: careerData.province || "",
              city: careerData.city || "",
              minimumSalary: careerData.minimumSalary || 0,
              maximumSalary: careerData.maximumSalary || 0,
              salaryNegotiable: careerData.salaryNegotiable ?? true,
            },
            cvReview: {
              cvScreeningSetting:
                careerData.cvScreeningSetting || "Good Fit and above",
              cvSecretPrompt: careerData.cvSecretPrompt || "",
              preScreeningQuestions: careerData.preScreeningQuestions || [],
            },
            aiInterview: {
              aiScreeningSetting:
                careerData.aiScreeningSetting || "Good Fit and above",
              aiSecretPrompt: careerData.aiSecretPrompt || "",
              requireVideo: careerData.requireVideo ?? true,
              aiInterviewQuestions: careerData.aiInterviewQuestions || [],
            },
            pipelineStages: careerData.pipelineStages || null,
          });

          // Set careerID from fetched data
          if (careerData._id) {
            setCareerID(careerData._id);
          }
        } catch (error) {
          console.error("Error fetching career data:", error);
          errorToast("Failed to load career data", 1300);
        } finally {
          setIsLoadingCareerData(false);
        }
      }
    };

    fetchCareerData();
  }, [formType, careerID, orgID]);

  // Refs for form sections
  const careerDetailsSectionRef = useRef(null);
  const cvReviewSectionRef = useRef(null);
  const aiInterviewSectionRef = useRef(null);
  const pipelineStagesSectionRef = useRef(null);
  const reviewCareerSectionRef = useRef(null);

  const updateCachedFormData = (section: keyof CachedFormData, data: any) => {
    setCachedFormData({ ...cachedFormData, [section]: data });
  };

  const moveNextStep = () => {
    if (steps.indexOf(currentStep) === steps.length - 1) return;
    setCurrentStep(steps[steps.indexOf(currentStep) + 1]);
  };

  const onSubmit = (status: string) => {
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
    } else if (currentStep === steps[4]) {
      reviewCareerSectionRef.current?.onClick(status);
      console.log("Review Career section submit");
    }
  };

  const onTestSubmit = () => {
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
  };

  const handleStepClick = (step: string) => {
    const cacheCount = Object.keys(cachedFormData).filter(
      (key) => cachedFormData[key as keyof CachedFormData] !== null
    ).length;
    if (
      steps.indexOf(step) > steps.indexOf(currentStep) &&
      steps.indexOf(step) > cacheCount
    ) {
      errorToast("Submit to proceed to the next step", 1300);
      return;
    }
    if (hasChanges) {
      errorToast("Please save the changes first", 1300);
      return;
    }
    setCurrentStep(step);
  };

  return (
    <div className="col" style={{ marginBottom: "32px" }}>
      <TopBar
        onSubmit={onSubmit}
        hasErrors={hasErrors}
        cachedFormData={cachedFormData}
        currentStep={currentStep}
      />

      <SegmentedFormProgressBar
        steps={steps}
        currentStep={currentStep}
        hasErrors={hasErrors}
        hasChanges={hasChanges}
        onClick={handleStepClick}
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
          formType={formType}
          careerID={careerID || undefined}
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
          careerID={careerID || ""}
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
          careerID={careerID || ""}
          jobTitle={cachedFormData.careerDetails?.jobTitle || ""}
          description={cachedFormData.careerDetails?.description || ""}
        />
      )}
      {currentStep === steps[3] && (
        <PipelineStagesSection
          ref={pipelineStagesSectionRef}
          moveNextStep={moveNextStep}
          setHasChanges={setHasChanges}
          setHasErrors={setHasErrors}
          onDataChange={(data: any) =>
            updateCachedFormData("pipelineStages", data)
          }
          careerID={careerID || ""}
        />
      )}
      {currentStep === steps[4] && (
        <ReviewCareerSection
          ref={reviewCareerSectionRef}
          data={cachedFormData}
          onDataChange={() => {}}
          moveNextStep={moveNextStep}
          careerID={careerID || ""}
          setIsSavingCareer={setIsSavingCareer}
        />
      )}

      {showSaveModal && (
        <CareerActionModal
          action={showSaveModal}
          onAction={(action) => console.log("action", action)}
        />
      )}
      {isLoadingCareerData && (
        <FullScreenLoadingAnimation
          title="Loading career data..."
          subtext="Please wait while we load the career information"
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
