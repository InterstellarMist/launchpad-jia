import { Ref, useEffect, useImperativeHandle } from "react";
import axios from "axios";
import { successToast, errorToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";

const pipelineStagesDefaultData = [
  {
    id: "1",
    name: "Pipeline Stage 1",
  },
  {
    id: "2",
    name: "Pipeline Stage 2",
  },
  {
    id: "3",
    name: "Pipeline Stage 3",
  },
];

interface PipelineStagesSectionRef {
  onClick: () => void;
}

export const PipelineStagesSection = ({
  ref,
  moveNextStep,
  setHasChanges,
  setHasErrors,
  onDataChange,
  careerID,
}: {
  ref: Ref<PipelineStagesSectionRef>;
  moveNextStep: () => void;
  setHasChanges: (hasChanges: boolean) => void;
  setHasErrors: (hasErrors: boolean) => void;
  onDataChange: (data: any) => void;
  careerID: string;
}) => {
  const { user } = useAppContext();
  const onSubmit = async () => {
    console.log("Pipeline Stages section submit");

    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };

    const pipelineStagesData = {
      _id: careerID,
      lastEditedBy: userInfoSlice,
      pipelineStages: pipelineStagesDefaultData,
    };
    try {
      const response = await axios.post(
        "/api/update-career",
        pipelineStagesData
      );
      if (response.status === 200) {
        successToast("Pipeline Stages updated successfully", 1300);
        onDataChange(pipelineStagesDefaultData);
        moveNextStep();
      }
    } catch (error) {
      console.error(error);
      errorToast("Failed to update Pipeline Stages", 1300);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      onClick: () => {
        console.log("Pipeline Stages section submit");
        onSubmit();
      },
    }),
    [onSubmit]
  );

  useEffect(() => {
    setHasChanges(false);
    setHasErrors(false);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      <p style={{ fontSize: 32, color: "#717680", fontWeight: 700 }}>
        Work in progress... 🚧
      </p>
    </div>
  );
};
