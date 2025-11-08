import { assetConstants } from "@/lib/utils/constantsV2";

export const SegmentedFormProgressBar = ({
  currentStep,
  hasErrors,
  hasChanges,
}: {
  currentStep: string;
  hasErrors: boolean;
  hasChanges: boolean;
}) => {
  const step = [
    "Career Details & Team Access",
    "CV Review & Pre-Screening",
    "AI Interview Setup",
    "Pipeline Stages",
    "Review Career",
  ];
  const stepStatus = ["completed", "pending", "in_progress", "error"];

  const processState = (index: number, isAdvance = false) => {
    const currentStepIndex = step.indexOf(currentStep);

    if (currentStepIndex == index) {
      if (index == stepStatus.length - 1) {
        return stepStatus[0];
      }
      return hasErrors
        ? stepStatus[3]
        : isAdvance || hasChanges
        ? stepStatus[2]
        : stepStatus[1];
    }

    if (currentStepIndex > index) {
      return stepStatus[0];
    }

    return stepStatus[1];
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          maxWidth: 1620,
          width: "100%",
          flexShrink: 0,
        }}
      >
        {step.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: index === step.length - 1 ? "auto" : "100%",
              flexShrink: index === step.length - 1 ? 0 : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <img
                alt=""
                src={assetConstants[processState(index, true)]}
                height={24}
                width={24}
              />
              {index < step.length - 1 && (
                <hr
                  style={{
                    width: "100%",
                    height: 6,
                    border: "unset",
                    borderRadius: 10,
                    margin: 0,
                    background:
                      processState(index) === "completed"
                        ? "linear-gradient(90deg, #9FCAED 0%, #CEB6DA 34%, #EBACC9 67%, #FCCEC0 100%)"
                        : processState(index) === "in_progress"
                        ? "linear-gradient(90deg, #9FCAED 0%, #CEB6DA 17%, #EBACC9 34%, #FCCEC0 50%, #d9d9d9 50%, #d9d9d9)"
                        : "#d9d9d9",
                  }}
                />
              )}
            </div>
            <span
              style={{
                width: index === step.length - 1 ? "initial" : "100%",
                fontWeight: 700,
                fontSize: 14,
                lineHeight: "20px",
                color:
                  processState(index, true) === "pending"
                    ? "#717680"
                    : "#181D27",
              }}
              key={index}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
      <hr
        style={{
          width: "100%",
          borderBottom: "1px solid #EAECF5",
          borderTop: "none",
          margin: "24px 0px",
        }}
      />
    </div>
  );
};
