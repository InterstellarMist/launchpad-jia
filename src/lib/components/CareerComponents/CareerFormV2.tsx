"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/lib/styles/screens/uploadCV.module.scss";
import { assetConstants } from "@/lib/utils/constantsV2";
import InterviewQuestionGeneratorV2 from "./InterviewQuestionGeneratorV2";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";
import { candidateActionToast, errorToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";
import axios from "axios";
import CareerActionModal from "./CareerActionModal";
import FullScreenLoadingAnimation from "./FullScreenLoadingAnimation";
// Setting List icons
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
const workSetupOptions = [
  {
    name: "Fully Remote",
  },
  {
    name: "Onsite",
  },
  {
    name: "Hybrid",
  },
];

const employmentTypeOptions = [
  {
    name: "Full-Time",
  },
  {
    name: "Part-Time",
  },
];

const SegmentedFormProgress = ({
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
                processState(index, true) === "pending" ? "#717680" : "#181D27",
            }}
            key={index}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  );
};

const Card = ({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: string;
}) => {
  return (
    <div className="layered-card-middle">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          margin: "4px 12px 0px 12px",
        }}
      >
        {icon && (
          <img
            src={assetConstants[icon]}
            alt="icon"
            height={20}
            width={20}
            style={{ marginRight: 0 }}
          />
        )}
        <h1
          style={{
            fontSize: 16,
            color: "#181D27",
            fontWeight: 700,
            lineHeight: "24px",
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>
      <div className="layered-card-content" style={{ gap: "24px" }}>
        {children}
      </div>
    </div>
  );
};

const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div style={{ flex: 1 }}>
      <p
        style={{
          fontSize: 14,
          color: "#414651",
          fontWeight: 500,
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <input
        value={value}
        className="form-control"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value || "")}
        style={{
          fontSize: 16,
          color: "#181D27",
          fontWeight: 500,
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default function CareerForm({
  career,
  formType,
  setShowEditModal,
}: {
  career?: any;
  formType: string;
  setShowEditModal?: (show: boolean) => void;
}) {
  const { user, orgID } = useAppContext();
  const [jobTitle, setJobTitle] = useState(career?.jobTitle || "");
  const [description, setDescription] = useState(career?.description || "");
  const [workSetup, setWorkSetup] = useState(career?.workSetup || "");
  const [workSetupRemarks, setWorkSetupRemarks] = useState(
    career?.workSetupRemarks || ""
  );
  const [screeningSetting, setScreeningSetting] = useState(
    career?.screeningSetting || "Good Fit and above"
  );
  const [employmentType, setEmploymentType] = useState(
    career?.employmentType || "Full-Time"
  );
  const [requireVideo, setRequireVideo] = useState(
    career?.requireVideo || true
  );
  const [salaryNegotiable, setSalaryNegotiable] = useState(
    career?.salaryNegotiable || true
  );
  const [minimumSalary, setMinimumSalary] = useState(
    career?.minimumSalary || ""
  );
  const [maximumSalary, setMaximumSalary] = useState(
    career?.maximumSalary || ""
  );
  const [questions, setQuestions] = useState(
    career?.questions || [
      {
        id: 1,
        category: "CV Validation / Experience",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 2,
        category: "Technical",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 3,
        category: "Behavioral",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 4,
        category: "Analytical",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 5,
        category: "Others",
        questionCountToAsk: null,
        questions: [],
      },
    ]
  );
  const [country, setCountry] = useState(career?.country || "Philippines");
  const [province, setProvince] = useState(career?.province || "");
  const [city, setCity] = useState(career?.location || "");
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState("");
  const [isSavingCareer, setIsSavingCareer] = useState(false);
  const savingCareerRef = useRef(false);

  // FIXME:
  // Segmented Form Steps
  const [currentStep, setCurrentStep] = useState(
    "Career Details & Team Access"
  );
  const [hasChanges, setHasChanges] = useState(true);
  const [hasErrors, setHasErrors] = useState(false);

  const isFormValid = () => {
    return (
      jobTitle?.trim().length > 0 &&
      description?.trim().length > 0 &&
      questions.some((q) => q.questions.length > 0) &&
      workSetup?.trim().length > 0
    );
  };

  const updateCareer = async (status: string) => {
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast("Minimum salary cannot be greater than maximum salary", 1300);
      return;
    }
    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };
    const updatedCareer = {
      _id: career._id,
      jobTitle,
      description,
      workSetup,
      workSetupRemarks,
      questions,
      lastEditedBy: userInfoSlice,
      status,
      updatedAt: Date.now(),
      screeningSetting,
      requireVideo,
      salaryNegotiable,
      minimumSalary: isNaN(Number(minimumSalary))
        ? null
        : Number(minimumSalary),
      maximumSalary: isNaN(Number(maximumSalary))
        ? null
        : Number(maximumSalary),
      country,
      province,
      // Backwards compatibility
      location: city,
      employmentType,
    };
    try {
      setIsSavingCareer(true);
      const response = await axios.post("/api/update-career", updatedCareer);
      if (response.status === 200) {
        candidateActionToast(
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginLeft: 8,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>
              Career updated
            </span>
          </div>,
          1300,
          <i
            className="la la-check-circle"
            style={{ color: "#039855", fontSize: 32 }}
          ></i>
        );
        setTimeout(() => {
          window.location.href = `/recruiter-dashboard/careers/manage/${career._id}`;
        }, 1300);
      }
    } catch (error) {
      console.error(error);
      errorToast("Failed to update career", 1300);
    } finally {
      setIsSavingCareer(false);
    }
  };

  const confirmSaveCareer = (status: string) => {
    if (
      Number(minimumSalary) &&
      Number(maximumSalary) &&
      Number(minimumSalary) > Number(maximumSalary)
    ) {
      errorToast("Minimum salary cannot be greater than maximum salary", 1300);
      return;
    }

    setShowSaveModal(status);
  };

  const saveCareer = async (status: string) => {
    setShowSaveModal("");
    if (!status) {
      return;
    }

    if (!savingCareerRef.current) {
      setIsSavingCareer(true);
      savingCareerRef.current = true;
      let userInfoSlice = {
        image: user.image,
        name: user.name,
        email: user.email,
      };
      const career = {
        jobTitle,
        description,
        workSetup,
        workSetupRemarks,
        questions,
        lastEditedBy: userInfoSlice,
        createdBy: userInfoSlice,
        screeningSetting,
        orgID,
        requireVideo,
        salaryNegotiable,
        minimumSalary: isNaN(Number(minimumSalary))
          ? null
          : Number(minimumSalary),
        maximumSalary: isNaN(Number(maximumSalary))
          ? null
          : Number(maximumSalary),
        country,
        province,
        // Backwards compatibility
        location: city,
        status,
        employmentType,
      };

      try {
        const response = await axios.post("/api/add-career", career);
        if (response.status === 200) {
          candidateActionToast(
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginLeft: 8,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>
                Career added {status === "active" ? "and published" : ""}
              </span>
            </div>,
            1300,
            <i
              className="la la-check-circle"
              style={{ color: "#039855", fontSize: 32 }}
            ></i>
          );
          setTimeout(() => {
            window.location.href = `/recruiter-dashboard/careers`;
          }, 1300);
        }
      } catch (error) {
        errorToast("Failed to add career", 1300);
      } finally {
        savingCareerRef.current = false;
        setIsSavingCareer(false);
      }
    }
  };

  useEffect(() => {
    const parseProvinces = () => {
      setProvinceList(philippineCitiesAndProvinces.provinces);
      const defaultProvince = philippineCitiesAndProvinces.provinces[0];
      if (!career?.province) {
        setProvince(defaultProvince.name);
      }
      const cities = philippineCitiesAndProvinces.cities.filter(
        (city) => city.province === defaultProvince.key
      );
      setCityList(cities);
      if (!career?.location) {
        setCity(cities[0].name);
      }
    };
    parseProvinces();
  }, [career]);

  return (
    <div className="col">
      {formType === "add" ? (
        <div
          style={{
            marginBottom: "35px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>
            Add new career
          </h1>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              disabled={!isFormValid() || isSavingCareer}
              style={{
                width: "fit-content",
                color: "#414651",
                background: "#fff",
                border: "1px solid #D5D7DA",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor:
                  !isFormValid() || isSavingCareer ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                confirmSaveCareer("inactive");
              }}
            >
              Save as Unpublished
            </button>
            <button
              disabled={!isFormValid() || isSavingCareer}
              style={{
                width: "fit-content",
                background:
                  !isFormValid() || isSavingCareer ? "#D5D7DA" : "black",
                color: "#fff",
                border: "1px solid #E9EAEB",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor:
                  !isFormValid() || isSavingCareer ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                confirmSaveCareer("active");
              }}
            >
              <i
                className="la la-check-circle"
                style={{ color: "#fff", fontSize: 20, marginRight: 8 }}
              ></i>
              Save as Published
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            marginBottom: "35px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>
            Edit Career Details
          </h1>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              style={{
                width: "fit-content",
                color: "#414651",
                background: "#fff",
                border: "1px solid #D5D7DA",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                setShowEditModal?.(false);
              }}
            >
              Cancel
            </button>
            <button
              disabled={!isFormValid() || isSavingCareer}
              style={{
                width: "fit-content",
                color: "#414651",
                background: "#fff",
                border: "1px solid #D5D7DA",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor:
                  !isFormValid() || isSavingCareer ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                updateCareer("inactive");
              }}
            >
              Save Changes as Unpublished
            </button>
            <button
              disabled={!isFormValid() || isSavingCareer}
              style={{
                width: "fit-content",
                background:
                  !isFormValid() || isSavingCareer ? "#D5D7DA" : "black",
                color: "#fff",
                border: "1px solid #E9EAEB",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor:
                  !isFormValid() || isSavingCareer ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                updateCareer("active");
              }}
            >
              <i
                className="la la-check-circle"
                style={{ color: "#fff", fontSize: 20, marginRight: 8 }}
              ></i>
              Save Changes as Published
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SegmentedFormProgress
          currentStep={currentStep}
          hasErrors={hasErrors}
          hasChanges={hasChanges}
        />
      </div>

      {/* TODO: 1. Career Information */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          gap: 16,
          alignItems: "flex-start",
          marginTop: 16,
        }}
      >
        <div
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Card title="1. Career Information">
            <div>
              <p
                style={{
                  fontSize: 14,
                  color: "#181D27",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Basic Information
              </p>
              <TextInput
                label="Job Title"
                value={jobTitle}
                onChange={setJobTitle}
                placeholder="Enter job title"
              />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  color: "#181D27",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Work Setting
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                <TextInput
                  label="Employment Type"
                  value={employmentType}
                  onChange={setEmploymentType}
                  placeholder="Choose employment type"
                />
                <TextInput
                  label="Arrangement"
                  value={workSetup}
                  onChange={setWorkSetup}
                  placeholder="Choose work arrangement"
                />
              </div>
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  color: "#181D27",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Location
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <TextInput
                    label="Country"
                    value={country}
                    onChange={setCountry}
                    placeholder="Choose country"
                  />
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <TextInput
                    label="Province"
                    value={province}
                    onChange={setProvince}
                    placeholder="Choose province"
                  />
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <TextInput
                    label="City"
                    value={city}
                    onChange={setCity}
                    placeholder="Choose city"
                  />
                </div>
              </div>
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  color: "#181D27",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Salary
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                <TextInput
                  label="Minimum Salary"
                  value={minimumSalary}
                  onChange={setMinimumSalary}
                  placeholder="Enter minimum salary"
                />
                <TextInput
                  label="Maximum Salary"
                  value={maximumSalary}
                  onChange={setMaximumSalary}
                  placeholder="Enter maximum salary"
                />
              </div>
            </div>
          </Card>
          <Card title="2. Job Description">
            {/* TODO: Edit Rich Text Editor */}
            <RichTextEditor setText={setDescription} text={description} />
          </Card>
          <InterviewQuestionGeneratorV2
            questions={questions}
            setQuestions={(questions) => setQuestions(questions)}
            jobTitle={jobTitle}
            description={description}
          />
        </div>

        {/* FIXME: Right Sidebar */}
        <div
          style={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Card title="Tips" icon="tips">
            <p style={{ fontSize: 14, color: "#717680", fontWeight: 500 }}>
              <span style={{ fontWeight: 700, color: "#181D27" }}>
                Use clear, standard job titles
              </span>{" "}
              for better searchability (e.g., “Software Engineer” instead of
              “Code Ninja” or “Tech Rockstar”).
              <br />
              <span style={{ fontWeight: 700, color: "#181D27" }}>
                Avoid abbreviations
              </span>{" "}
              or internal role codes that applicants may not understand (e.g.,
              use “QA Engineer” instead of “QE II” or “QA-TL”).
              <br />
              <span style={{ fontWeight: 700, color: "#181D27" }}>
                Keep it concise
              </span>{" "}
              – job titles should be no more than a few words (2–4 max),
              avoiding fluff or marketing terms.
            </p>
          </Card>
          <div className="layered-card-outer">
            <div className="layered-card-middle">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#181D27",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="la la-cog"
                    style={{ color: "#FFFFFF", fontSize: 20 }}
                  ></i>
                </div>
                <span
                  style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                >
                  Settings
                </span>
              </div>
              <div className="layered-card-content">
                <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                  <i
                    className="la la-id-badge"
                    style={{ color: "#414651", fontSize: 20 }}
                  ></i>
                  <span>Screening Setting</span>
                </div>
                <CustomDropdown
                  onSelectSetting={(setting) => {
                    setScreeningSetting(setting);
                  }}
                  screeningSetting={screeningSetting}
                  settingList={screeningSettingList}
                />
                <span>
                  This settings allows Jia to automatically endorse candidates
                  who meet the chosen criteria.
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", flexDirection: "row", gap: 8 }}
                  >
                    <i
                      className="la la-video"
                      style={{ color: "#414651", fontSize: 20 }}
                    ></i>
                    <span>Require Video Interview</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={requireVideo}
                        onChange={() => setRequireVideo(!requireVideo)}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span>{requireVideo ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="layered-card-outer">
            <div className="layered-card-middle">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#181D27",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="la la-ellipsis-h"
                    style={{ color: "#FFFFFF", fontSize: 20 }}
                  ></i>
                </div>
                <span
                  style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                >
                  Additional Information
                </span>
              </div>
              <div className="layered-card-content">
                <span
                  style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                >
                  Work Setting
                </span>
                <span>Employment Type</span>
                <CustomDropdown
                  onSelectSetting={(employmentType) => {
                    setEmploymentType(employmentType);
                  }}
                  screeningSetting={employmentType}
                  settingList={employmentTypeOptions}
                  placeholder="Select Employment Type"
                />

                <span>Work Setup Arrangement</span>
                <CustomDropdown
                  onSelectSetting={(setting) => {
                    setWorkSetup(setting);
                  }}
                  screeningSetting={workSetup}
                  settingList={workSetupOptions}
                  placeholder="Select Work Setup"
                />

                <span>Work Setup Remarks</span>
                <input
                  className="form-control"
                  placeholder="Additional remarks about work setup (optional)"
                  value={workSetupRemarks}
                  onChange={(e) => {
                    setWorkSetupRemarks(e.target.value || "");
                  }}
                ></input>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                  >
                    Salary
                  </span>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 8,
                      minWidth: "130px",
                    }}
                  >
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={salaryNegotiable}
                        onChange={() => setSalaryNegotiable(!salaryNegotiable)}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span>{salaryNegotiable ? "Negotiable" : "Fixed"}</span>
                  </div>
                </div>

                <span>Minimum Salary</span>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      fontSize: "16px",
                      pointerEvents: "none",
                    }}
                  >
                    P
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    style={{ paddingLeft: "28px" }}
                    placeholder="0"
                    min={0}
                    value={minimumSalary}
                    onChange={(e) => {
                      setMinimumSalary(e.target.value || "");
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "30px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      fontSize: "16px",
                      pointerEvents: "none",
                    }}
                  >
                    PHP
                  </span>
                </div>

                <span>Maximum Salary</span>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      fontSize: "16px",
                      pointerEvents: "none",
                    }}
                  >
                    P
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    style={{ paddingLeft: "28px" }}
                    placeholder="0"
                    min={0}
                    value={maximumSalary}
                    onChange={(e) => {
                      setMaximumSalary(e.target.value || "");
                    }}
                  ></input>
                  <span
                    style={{
                      position: "absolute",
                      right: "30px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                      fontSize: "16px",
                      pointerEvents: "none",
                    }}
                  >
                    PHP
                  </span>
                </div>

                <span
                  style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                >
                  Location
                </span>

                <span>Country</span>
                <CustomDropdown
                  onSelectSetting={(setting) => {
                    setCountry(setting);
                  }}
                  screeningSetting={country}
                  settingList={[]}
                  placeholder="Select Country"
                />

                <span>State / Province</span>
                <CustomDropdown
                  onSelectSetting={(province) => {
                    setProvince(province);
                    const provinceObj = provinceList.find(
                      (p) => p.name === province
                    );
                    const cities = philippineCitiesAndProvinces.cities.filter(
                      (city) => city.province === provinceObj.key
                    );
                    setCityList(cities);
                    setCity(cities[0].name);
                  }}
                  screeningSetting={province}
                  settingList={provinceList}
                  placeholder="Select State / Province"
                />

                <span>City</span>
                <CustomDropdown
                  onSelectSetting={(city) => {
                    setCity(city);
                  }}
                  screeningSetting={city}
                  settingList={cityList}
                  placeholder="Select City"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSaveModal && (
        <CareerActionModal
          action={showSaveModal}
          onAction={(action) => saveCareer(action)}
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
