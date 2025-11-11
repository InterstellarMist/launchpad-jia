import { Card } from "../FormComponents/Card";
import {
  CachedFormData,
  CvReviewFormData,
  AiInterviewFormData,
  PipelineStagesFormData,
} from "@/lib/types/careerFormTypes";
import { assetConstants } from "@/lib/utils/constantsV2";
import { Button } from "../FormComponents/Button";
import { Badge } from "../FormComponents/Card";

const formatCurrency = (amount: number) => {
  return `₱${amount.toLocaleString("en-US")}`;
};

export const EditButton = () => {
  return (
    <Button
      variant="secondary"
      size="xs"
      icon={assetConstants.edit}
      iconSize={16}
      onClick={() => {}}
    />
  );
};

export const TextPair = ({
  label,
  value,
  isHtml = false,
  badgeText,
  icon,
}: {
  label: string;
  value: string;
  isHtml?: boolean;
  badgeText?: string;
  icon?: string;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <p
        style={{
          fontSize: 14,
          color: "#181D27",
          fontWeight: 700,
          marginBottom: 0,
        }}
      >
        {icon && (
          <img
            src={assetConstants[icon]}
            alt="icon"
            height={20}
            width={20}
            style={{ marginRight: 8 }}
          />
        )}
        {label}{" "}
        {badgeText && (
          <span style={{ marginLeft: 4, display: "inline-block" }}>
            <Badge text={badgeText} />
          </span>
        )}
      </p>
      {isHtml ? (
        value && value.trim() && value.replace(/<[^>]*>/g, "").trim() ? (
          <div
            style={{
              fontSize: 16,
              color: "#414651",
              fontWeight: 500,
              margin: 0,
              lineHeight: "1.5",
            }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <p
            style={{
              fontSize: 16,
              color: "#414651",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Not specified
          </p>
        )
      ) : (
        <p
          style={{ fontSize: 16, color: "#414651", fontWeight: 500, margin: 0 }}
        >
          {value}
        </p>
      )}
    </div>
  );
};

export const CustomTextPair = ({
  label,
  children,
  badgeText,
}: {
  label: string;
  children: React.ReactNode;
  badgeText?: string;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <p
        style={{
          fontSize: 14,
          color: "#181D27",
          fontWeight: 700,
          marginBottom: 0,
        }}
      >
        {label}{" "}
        {badgeText && (
          <span style={{ marginLeft: 4, display: "inline-block" }}>
            <Badge text={badgeText} />
          </span>
        )}
      </p>
      {children}
    </div>
  );
};

export const Divider = () => {
  return <hr style={{ margin: "16px 0", borderColor: "#E9EAEB" }} />;
};

export const RenderPreScreeningQuestions = ({
  questions,
}: {
  questions: CvReviewFormData["preScreeningQuestions"];
}) => {
  return (
    <ol
      style={{
        margin: 0,
        paddingLeft: 16,
        fontSize: 16,
        color: "#414651",
        fontWeight: 500,
      }}
    >
      {questions.map((question) => (
        <li key={question.id} style={{ marginBottom: 8 }}>
          {question.question}
          {question.type === "Dropdown" && (
            <ul style={{ paddingLeft: 24, listStyleType: "disc" }}>
              {question.options?.map((option) => (
                <li key={option.id} style={{ marginBottom: 2 }}>
                  {option.name}
                </li>
              ))}
            </ul>
          )}
          {question.type === "Checkboxes" && (
            <ul style={{ paddingLeft: 24, listStyleType: "disc" }}>
              {question.options?.map((option) => (
                <li key={option.id} style={{ marginBottom: 2 }}>
                  {option.name}
                </li>
              ))}
            </ul>
          )}
          {question.type === "Range" && (
            <ul style={{ paddingLeft: 24, listStyleType: "disc" }}>
              <li style={{ marginBottom: 2 }}>
                Preferred: {formatCurrency(question.min || 0)} -{" "}
                {formatCurrency(question.max || 0)}
              </li>
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
};

export const RenderAiInterviewQuestions = ({
  categories,
}: {
  categories: AiInterviewFormData["aiInterviewQuestions"];
}) => {
  return (
    <div
      style={{
        margin: 0,
        paddingLeft: 0,
        fontSize: 16,
        color: "#414651",
        fontWeight: 500,
      }}
    >
      {categories.map((category) => (
        <div key={category.id} style={{ marginBottom: 16 }}>
          <p
            style={{
              fontSize: 14,
              color: "#414651",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            {category.category}
          </p>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {category.questions.map((question) => (
              <li key={question.id} style={{ marginBottom: 4 }}>
                {question.question}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
};

export const CareerDetailsSummaryCard = ({
  data,
  showEditButton = true,
}: {
  data: CachedFormData["careerDetails"];
  showEditButton?: boolean;
}) => {
  if (!data) return null;

  return (
    <Card
      collapsible
      title="Career Details & Team Access"
      button={showEditButton ? <EditButton /> : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <TextPair label="Job Title" value={data.jobTitle} />
        <Divider />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <TextPair label="Employment Type" value={data.employmentType} />
          <TextPair label="Work Setup" value={data.workSetup} />
        </div>
        <Divider />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <TextPair label="Country" value={data.country} />
          <TextPair label="Province" value={data.province} />
          <TextPair label="City" value={data.city} />
        </div>
        <Divider />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <TextPair
            label="Minimum Salary"
            value={formatCurrency(data.minimumSalary || 0)}
          />
          <TextPair
            label="Maximum Salary"
            value={formatCurrency(data.maximumSalary || 0)}
          />
          <TextPair
            label="Salary Negotiable"
            value={data.salaryNegotiable ? "Yes" : "No"}
          />
        </div>
        <Divider />
        <TextPair label="Description" value={data.description} isHtml={true} />
      </div>
    </Card>
  );
};

export const CvReviewSummaryCard = ({
  data,
  showEditButton = true,
}: {
  data: CvReviewFormData;
  showEditButton?: boolean;
}) => {
  if (!data) return null;

  const questionsCount = data.preScreeningQuestions?.length || 0;

  return (
    <Card
      collapsible
      title="CV Review & Pre-Screening"
      button={showEditButton ? <EditButton /> : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <TextPair label="CV Screening" value={data.cvScreeningSetting} />

        {data.cvSecretPrompt && (
          <>
            <Divider />
            <TextPair
              icon="star"
              label="CV Secret Prompt"
              value={data.cvSecretPrompt}
            />
          </>
        )}
        <Divider />
        <div>
          <CustomTextPair
            label="Pre-Screening Questions"
            badgeText={questionsCount.toString()}
          >
            <RenderPreScreeningQuestions
              questions={data.preScreeningQuestions || []}
            />
          </CustomTextPair>
        </div>
      </div>
    </Card>
  );
};

export const AiInterviewSummaryCard = ({
  data,
  showEditButton = true,
}: {
  data: AiInterviewFormData;
  showEditButton?: boolean;
}) => {
  if (!data) return null;

  const totalQuestions =
    data.aiInterviewQuestions?.reduce(
      (sum, category) => sum + (category.questions?.length || 0),
      0
    ) || 0;

  return (
    <Card
      collapsible
      title="AI Interview Setup"
      button={showEditButton ? <EditButton /> : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <TextPair
          label="AI Screening Setting"
          value={data.aiScreeningSetting}
        />

        <Divider />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 0,
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "#181D27",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Require Video on Interview
          </p>
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <p
              style={{
                fontSize: 16,
                color: "#414651",
                fontWeight: 500,
                margin: 0,
              }}
            >
              {data.requireVideo ? "Yes" : "No"}
            </p>
            {data.requireVideo ? (
              <img
                src={assetConstants.checkV2}
                alt="check"
                height={24}
                width={24}
              />
            ) : (
              <img
                src={assetConstants.userRejected}
                alt="x"
                height={24}
                width={24}
              />
            )}
          </span>
        </div>

        {data.aiSecretPrompt && (
          <>
            <Divider />
            <TextPair
              icon="star"
              label="AI Interview Secret Prompt"
              value={data.aiSecretPrompt}
            />
          </>
        )}
        <Divider />
        <CustomTextPair
          label="Interview Questions"
          badgeText={totalQuestions.toString()}
        >
          <RenderAiInterviewQuestions categories={data.aiInterviewQuestions} />
        </CustomTextPair>
      </div>
    </Card>
  );
};

export const PipelineStagesSummaryCard = ({
  data,
  showEditButton = true,
}: {
  data: PipelineStagesFormData;
  showEditButton?: boolean;
}) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card
        collapsible
        title="Pipeline Stages"
        button={showEditButton ? <EditButton /> : undefined}
      >
        <p
          style={{
            fontSize: 16,
            color: "#717680",
            fontWeight: 500,
            margin: 0,
          }}
        >
          No pipeline stages configured
        </p>
      </Card>
    );
  }

  return (
    <Card
      collapsible
      title="Pipeline Stages"
      button={showEditButton ? <EditButton /> : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.map((stage, index) => (
          <div
            key={stage.id || index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "#F8F9FC",
                border: "1px solid #D5D9EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#363F72",
              }}
            >
              {index + 1}
            </div>
            <p
              style={{
                fontSize: 16,
                color: "#181D27",
                fontWeight: 500,
                margin: 0,
              }}
            >
              {stage.name || `Pipeline Stage ${index + 1}`}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
