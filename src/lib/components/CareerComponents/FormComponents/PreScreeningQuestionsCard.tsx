"use client";
import { assetConstants } from "@/lib/utils/constantsV2";
import { Card } from "./Card";
import { Button } from "./Button";
import { useState } from "react";
import { guid } from "@/lib/Utils";
import CustomDropdown from "../CustomDropdown";
import { TextInput } from "./TextInput";

interface Option {
  id: string;
  name: string;
}

type QuestionType =
  | "Short answer"
  | "Long answer"
  | "Dropdown"
  | "Checkboxes"
  | "Range";

export interface PreScreeningQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: Option[];
  min?: number;
  max?: number;
}
interface SuggestedPreScreeningQuestion
  extends Omit<PreScreeningQuestion, "id"> {
  name: string;
  isAdded?: boolean;
}

const questionTypes = [
  {
    name: "Short answer",
    icon: assetConstants.user,
  },
  {
    name: "Long answer",
    icon: assetConstants.subject,
  },
  {
    name: "Dropdown",
    icon: assetConstants.circleDown,
  },
  {
    name: "Checkboxes",
    icon: assetConstants.user,
  },
  {
    name: "Range",
    icon: assetConstants.numbers,
  },
];

const suggestedPreScreeningQuestions: SuggestedPreScreeningQuestion[] = [
  {
    name: "Notice Period",
    question: "What is your notice period?",
    type: "Dropdown",
    options: [
      { id: guid(), name: "Immediately" },
      { id: guid(), name: "< 30 days" },
      { id: guid(), name: "> 30 days" },
    ],
    isAdded: false,
  },
  {
    name: "Work Setup",
    question: "How often are you willing to report to the office each week?",
    type: "Dropdown",
    options: [
      { id: guid(), name: "At most 1-2x a week" },
      { id: guid(), name: "At most 3-4x a week" },
      { id: guid(), name: "Open to fully onsite work" },
      { id: guid(), name: "Open to fully remote work" },
    ],
    isAdded: false,
  },
  {
    name: "Asking Salary",
    question: "How much is your expected monthly salary?",
    type: "Range",
    min: 40000,
    max: 60000,
    isAdded: false,
  },
];

const AddQuestionButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      icon={assetConstants.plus}
      text="Add custom"
      variant="primary"
    />
  );
};

const AddButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <Button
      onClick={onClick}
      text={disabled ? "Added" : "Add"}
      variant="secondary"
      disabled={disabled}
    />
  );
};

const DropdownQuestionOptions = ({
  question,
  onDeleteOption,
  onAddOption,
  onUpdateOption,
}: {
  question: PreScreeningQuestion;
  onDeleteOption: (questionId: string, optionId: string) => void;
  onAddOption: (questionId: string) => void;
  onUpdateOption: (questionId: string, optionId: string, value: string) => void;
}) => {
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editingOptionName, setEditingOptionName] = useState<string>("");

  const handleEditOption = () => {
    onUpdateOption(question.id, editingOptionId, editingOptionName);
    setEditingOptionName("");
  };

  return (
    <>
      {question.options?.map((option, index) => (
        <div
          key={option.id}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
          }}
        >
          <div
            style={{
              width: "100%",
              border: "1px solid #E9EAEB",
              borderRadius: 8,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                borderRight: "1px solid #E9EAEB",
                color: "#181D27",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 0,
                padding: "10px 14px",
                lineHeight: "20px",
              }}
            >
              {index + 1}
            </div>
            <div
              onClick={() => {
                if (editingOptionId === option.id) return;
                handleEditOption();
                setEditingOptionName(option.name);
                setEditingOptionId(option.id);
              }}
              style={{
                width: "100%",
                cursor: editingOptionId === option.id ? "default" : "pointer",
              }}
            >
              {editingOptionId === option.id ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <input
                    className="form-control"
                    value={editingOptionName}
                    onChange={(e) => setEditingOptionName(e.target.value)}
                    placeholder="Option name"
                    style={{
                      fontSize: "14px",
                      color: "#181D27",
                      fontWeight: 500,
                      borderRadius: "8px",
                      padding: "4px 8px",
                      height: "fit-content",
                      margin: "0px 8px",
                      width: "200px",
                    }}
                  />
                  <Button
                    icon={assetConstants.checkV4}
                    variant="ghost"
                    onClick={() => {
                      handleEditOption();
                      setEditingOptionId(null);
                      setEditingOptionName("");
                    }}
                  />
                </div>
              ) : (
                <p
                  style={{
                    color: "#181D27",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 0,
                    lineHeight: "20px",
                    padding: "10px 14px",
                  }}
                >
                  {option.name}
                </p>
              )}
            </div>
          </div>
          <Button
            icon={assetConstants.xV4}
            variant="secondary"
            onClick={() => {
              onDeleteOption(question.id, option.id);
            }}
          />
        </div>
      ))}
      <Button
        icon={assetConstants.plusDark}
        text="Add Option"
        variant="ghost"
        onClick={() => {
          onAddOption(question.id);
        }}
      />
    </>
  );
};

const QuestionCard = ({
  question,
  preScreeningQuestions,
  onChange,
}: {
  question: PreScreeningQuestion;
  preScreeningQuestions: PreScreeningQuestion[];
  onChange: (questions: PreScreeningQuestion[]) => void;
}) => {
  const [questionType, setQuestionType] = useState(question.type);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestionName, setEditingQuestionName] = useState<string>("");

  const handleDeleteQuestion = (questionId: string) => {
    onChange(preScreeningQuestions.filter((q) => q.id !== questionId));
  };

  const handleDeleteOption = (questionId: string, optionId: string) => {
    onChange(
      preScreeningQuestions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options?.filter((o) => o.id !== optionId) }
          : q
      )
    );
  };

  const handleAddOption = (questionId: string) => {
    onChange(
      preScreeningQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...(q.options || []),
                { id: guid(), name: "Option name" },
              ],
            }
          : q
      )
    );
  };

  const handleUpdateOption = (
    questionId: string,
    optionId: string,
    value: string
  ) => {
    onChange(
      preScreeningQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((o) =>
                o.id === optionId ? { ...o, name: value } : o
              ),
            }
          : q
      )
    );
  };

  const handleUpdateQuestion = () => {
    onChange(
      preScreeningQuestions.map((q) =>
        q.id === question.id ? { ...q, question: editingQuestionName } : q
      )
    );
  };

  const handleChangeQuestionType = (type: QuestionType) => {
    onChange(
      preScreeningQuestions.map((q) =>
        q.id === question.id ? { ...q, type: type } : q
      )
    );
    setQuestionType(type);
  };

  const handleRangeInputChange = (type: "min" | "max", value: string) => {
    const numValue =
      value === "" || isNaN(Number(value)) ? undefined : Number(value);
    onChange(
      preScreeningQuestions.map((q) =>
        q.id === question.id ? { ...q, [type]: numValue } : q
      )
    );
  };

  return (
    <div style={{ border: "1px solid #E9EAEB", borderRadius: 8 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#F8F9FC",
          padding: "12px 16px",
          gap: 16,
        }}
      >
        <div
          onClick={() => {
            if (!isEditingQuestion) setIsEditingQuestion(true);
            setEditingQuestionName(question.question);
          }}
          style={{
            flex: 1,
            cursor: isEditingQuestion ? "default" : "pointer",
          }}
        >
          {isEditingQuestion ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <input
                className="form-control"
                value={editingQuestionName}
                onChange={(e) => setEditingQuestionName(e.target.value)}
                placeholder="Question text"
                style={{
                  fontSize: "14px",
                  color: "#414651",
                  fontWeight: 500,
                  borderRadius: "8px",
                  padding: "10px 14px",
                  height: "fit-content",
                  width: "100%",
                }}
              />
              <Button
                icon={assetConstants.checkV4}
                variant="ghost"
                onClick={() => {
                  handleUpdateQuestion();
                  setIsEditingQuestion(false);
                  setEditingQuestionName("");
                }}
              />
            </div>
          ) : (
            <p
              style={{
                color: "#414651",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 0,
              }}
            >
              {question.question}
            </p>
          )}
        </div>
        <CustomDropdown
          size="xs"
          width={232}
          value={questionType}
          onSelect={handleChangeQuestionType}
          options={questionTypes}
        />
      </div>

      <div
        style={{
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {question.type === "Dropdown" && (
          <DropdownQuestionOptions
            question={question}
            onDeleteOption={handleDeleteOption}
            onAddOption={handleAddOption}
            onUpdateOption={handleUpdateOption}
          />
        )}
        {question.type === "Checkboxes" && (
          <DropdownQuestionOptions
            question={question}
            onDeleteOption={handleDeleteOption}
            onAddOption={handleAddOption}
            onUpdateOption={handleUpdateOption}
          />
        )}
        {question.type === "Range" && (
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 14,
                  color: "#414651",
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Minimum
              </p>
              <input
                type="number"
                className="form-control"
                value={question.min !== undefined ? question.min : ""}
                onChange={(e) => handleRangeInputChange("min", e.target.value)}
                placeholder="0"
                min={0}
                style={{
                  fontSize: 16,
                  color: "#181D27",
                  fontWeight: 500,
                  borderRadius: "8px",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 14,
                  color: "#414651",
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Maximum
              </p>
              <input
                type="number"
                className="form-control"
                value={question.max !== undefined ? question.max : ""}
                onChange={(e) => handleRangeInputChange("max", e.target.value)}
                placeholder="0"
                min={0}
                style={{
                  fontSize: 16,
                  color: "#181D27",
                  fontWeight: 500,
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        )}
        <hr style={{ margin: "0 0 12px 0", borderColor: "#E9EAEB" }} />
        <div style={{ alignSelf: "flex-end" }}>
          <Button
            icon={assetConstants.trashV2}
            text="Delete Question"
            variant="destructive"
            onClick={() => {
              handleDeleteQuestion(question.id);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const SuggestedQuestionsSection = ({
  preScreeningQuestions,
  onChange,
}: {
  preScreeningQuestions: PreScreeningQuestion[];
  onChange: (questions: PreScreeningQuestion[]) => void;
}) => {
  const handleAddSuggestedQuestion = (
    question: SuggestedPreScreeningQuestion
  ) => {
    onChange([
      ...preScreeningQuestions,
      {
        id: guid(),
        question: question.question,
        type: question.type,
        options: question.options,
        min: question.min,
        max: question.max,
      },
    ]);
    question.isAdded = true;
  };

  return (
    <div>
      <hr style={{ margin: "0 0 24px 0", borderColor: "#E9EAEB" }} />

      <p style={{ color: "#414651", fontSize: 16, fontWeight: 700 }}>
        Suggested Pre-screening Questions
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {suggestedPreScreeningQuestions.map((question) => (
          <div
            key={question.name}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  color: question.isAdded ? "#D5D7DA" : "#414651",
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 0,
                  lineHeight: "20px",
                }}
              >
                {question.name}
              </p>
              <p
                style={{
                  color: question.isAdded ? "#D5D7DA" : "#717680",
                  fontSize: 14,
                  fontWeight: 500,
                  marginBottom: 0,
                  lineHeight: "20px",
                }}
              >
                {question.question}
              </p>
            </div>
            <AddButton
              onClick={() => handleAddSuggestedQuestion(question)}
              disabled={question.isAdded}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const PreScreeningQuestionsCard = ({
  value,
  onChange,
}: {
  value: PreScreeningQuestion[];
  onChange: (questions: PreScreeningQuestion[]) => void;
}) => {
  const preScreeningQuestions = value || [];

  const handleAddQuestion = () => {
    onChange([
      ...preScreeningQuestions,
      {
        id: guid(),
        question: "Write your question ...",
        type: "Dropdown",
        options: [{ id: guid(), name: "Option 1" }],
      },
    ]);
  };

  return (
    <Card
      title="2. Pre-Screening Questions"
      isOptional
      count={preScreeningQuestions.length}
      button={<AddQuestionButton onClick={handleAddQuestion} />}
    >
      {preScreeningQuestions.length > 0 ? (
        <>
          {preScreeningQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              preScreeningQuestions={preScreeningQuestions}
              onChange={onChange}
            />
          ))}
        </>
      ) : (
        <p
          style={{
            color: "#414651",
            fontSize: 16,
            fontWeight: 500,
            marginBottom: 0,
          }}
        >
          No pre-screening questions added yet
        </p>
      )}
      <SuggestedQuestionsSection
        preScreeningQuestions={preScreeningQuestions}
        onChange={onChange}
      />
    </Card>
  );
};
