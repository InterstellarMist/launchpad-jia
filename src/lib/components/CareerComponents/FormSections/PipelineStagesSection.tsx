import { Ref, useImperativeHandle } from "react";

interface PipelineStagesSectionRef {
  onClick: () => void;
}

export const PipelineStagesSection = ({
  ref,
  moveNextStep,
}: {
  ref: Ref<PipelineStagesSectionRef>;
  moveNextStep: () => void;
}) => {
  useImperativeHandle(
    ref,
    () => ({
      onClick: () => {
        console.log("Pipeline Stages section submit");
        moveNextStep();
      },
    }),
    [moveNextStep]
  );

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
