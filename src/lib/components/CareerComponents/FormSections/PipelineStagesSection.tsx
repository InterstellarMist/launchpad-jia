import { Ref, useEffect, useImperativeHandle } from "react";

interface PipelineStagesSectionRef {
  onClick: () => void;
}

export const PipelineStagesSection = ({
  ref,
  moveNextStep,
  setHasChanges,
  setHasErrors,
  onDataChange,
}: {
  ref: Ref<PipelineStagesSectionRef>;
  moveNextStep: () => void;
  setHasChanges: (hasChanges: boolean) => void;
  setHasErrors: (hasErrors: boolean) => void;
  onDataChange: (data: any) => void;
}) => {
  useImperativeHandle(
    ref,
    () => ({
      onClick: () => {
        console.log("Pipeline Stages section submit");
        onDataChange([
          {
            id: "1",
            name: "Pipeline Stage 1",
            description: "Pipeline Stage 1 description",
            color: "#000000",
            nextStage: "Pipeline Stage 2",
            currentStage: "Pipeline Stage 1",
          },
        ]);
        moveNextStep();
      },
    }),
    [moveNextStep]
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
