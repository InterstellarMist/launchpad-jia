// TODO (Job Portal) - Check API

"use client";

import Loader from "@/lib/components/commonV2/Loader";
import styles from "@/lib/styles/screens/uploadCV.module.scss";
import { useAppContext } from "@/lib/context/ContextV2";
import { assetConstants, pathConstants } from "@/lib/utils/constantsV2";
import { checkFile } from "@/lib/utils/helpersV2";
import { CORE_API_URL } from "@/lib/Utils";
import axios from "axios";
import Markdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/lib/components/CareerComponents/FormComponents/Card";
import { TextInput } from "@/lib/components/CareerComponents/FormComponents/TextInput";
import { Textarea } from "@/lib/components/CareerComponents/FormComponents/Textarea";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import type { PreScreeningQuestion } from "@/lib/components/CareerComponents/FormComponents/PreScreeningQuestionsCard";
import { CurrencyInput } from "@/lib/components/CareerComponents/FormComponents/CurrencyInput";
import { DropdownInput } from "@/lib/components/CareerComponents/FormComponents/DropdownInput";

function PreScreeningForm({
  questions,
  onSubmit,
  submitting,
}: {
  questions: PreScreeningQuestion[];
  onSubmit: (data: Record<string, any>) => void;
  submitting: boolean;
}) {
  // Create dynamic Zod schema based on questions
  const createValidationSchema = (questions: PreScreeningQuestion[]) => {
    const schemaObject: Record<string, z.ZodTypeAny> = {};

    questions.forEach((question) => {
      if (question.type === "Range") {
        // Range questions have nested structure with min and max subfields
        schemaObject[question.id] = z
          .object({
            min: z.preprocess(
              (val) => {
                if (val === "" || val === null || val === undefined)
                  return undefined;
                const num =
                  typeof val === "string" ? parseFloat(val) : Number(val);
                return isNaN(num) ? undefined : num;
              },
              z
                .number()
                .min(
                  question.min || 0,
                  `Minimum value must be at least ${question.min || 0}`
                )
                .optional()
            ),
            max: z.preprocess(
              (val) => {
                if (val === "" || val === null || val === undefined)
                  return undefined;
                const num =
                  typeof val === "string" ? parseFloat(val) : Number(val);
                return isNaN(num) ? undefined : num;
              },
              z
                .number()
                .max(
                  question.max || 1000000,
                  `Maximum value must be at most ${question.max || 1000000}`
                )
                .optional()
            ),
          })
          .refine(
            (data) => {
              if (
                data.min !== undefined &&
                data.max !== undefined &&
                data.min !== null &&
                data.max !== null
              ) {
                return data.max >= data.min;
              }
              return true;
            },
            {
              message:
                "Maximum value must be greater than or equal to minimum value",
              path: ["max"],
            }
          )
          .optional();
      } else if (question.type === "Checkboxes") {
        schemaObject[question.id] = z.array(z.string()).optional();
      } else if (question.type === "Dropdown") {
        schemaObject[question.id] = z.string().optional();
      } else {
        // Short answer and Long answer
        schemaObject[question.id] = z.string().optional();
      }
    });

    return z.object(schemaObject);
  };

  const validationSchema = createValidationSchema(questions);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: questions.reduce((acc, question) => {
      if (question.type === "Checkboxes") {
        acc[question.id] = [];
      } else if (question.type === "Range") {
        // Range questions have nested structure with min and max
        acc[question.id] = {
          min: question.min || 0,
          max: question.max || 0,
        };
      } else {
        acc[question.id] = "";
      }
      return acc;
    }, {} as Record<string, any>),
  });

  const renderQuestionInput = (question: PreScreeningQuestion) => {
    switch (question.type) {
      case "Short answer":
        return (
          <TextInput
            control={control}
            name={question.id}
            placeholder="Enter your answer"
          />
        );

      case "Long answer":
        return (
          <Controller
            control={control}
            name={question.id}
            render={({ field: { onChange, value } }) => (
              <Textarea
                value={(value as string) || ""}
                onChange={onChange}
                placeholder="Enter your answer"
                height={120}
              />
            )}
          />
        );

      case "Dropdown":
        return (
          <div style={{ width: 320 }}>
            <DropdownInput
              options={
                question.options?.map((opt) => ({ name: opt.name })) || []
              }
              placeholder="Select an option"
              control={control}
              name={question.id}
            />
          </div>
        );

      case "Checkboxes":
        return (
          <Controller
            control={control}
            name={question.id}
            render={({ field: { onChange, value } }) => {
              const currentValue = (value as string[]) || [];
              return (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {question.options?.map((option) => (
                    <label
                      key={option.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={currentValue.includes(option.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onChange([...currentValue, option.id]);
                          } else {
                            onChange(
                              currentValue.filter(
                                (id: string) => id !== option.id
                              )
                            );
                          }
                        }}
                        style={{
                          width: 18,
                          height: 18,
                          cursor: "pointer",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 16,
                          color: "#181D27",
                          fontWeight: 500,
                        }}
                      >
                        {option.name}
                      </span>
                    </label>
                  ))}
                </div>
              );
            }}
          />
        );

      case "Range":
        return (
          <div style={{ display: "flex", gap: 16 }}>
            <CurrencyInput
              label="Minimum"
              placeholder="0"
              control={control}
              name={`${question.id}.min`}
            />
            <CurrencyInput
              label="Maximum"
              placeholder="0"
              control={control}
              name={`${question.id}.max`}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#181D27",
            marginBottom: 4,
          }}
        >
          Quick Pre-screening
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "#717680",
            fontWeight: 500,
            marginBottom: 0,
          }}
        >
          Just a few short questions to help your recruiters assess you faster.
          Takes less than a minute.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {questions.map((question) => (
            <div className="layered-card-outer" key={question.id}>
              <Card title={question.question}>
                {renderQuestionInput(question)}
              </Card>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 32,
          }}
        >
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "12px 24px",
              backgroundColor: submitting ? "#E9EAEB" : "#181D27",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "60px",
              fontSize: 14,
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {submitting ? "Submitting..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function () {
  const fileInputRef = useRef(null);
  const { user, setModalType } = useAppContext();
  const [buildingCV, setBuildingCV] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [digitalCV, setDigitalCV] = useState(null);
  const [editingCV, setEditingCV] = useState(null);
  const [file, setFile] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [screeningResult, setScreeningResult] = useState(null);
  const [userCV, setUserCV] = useState(null);
  const cvSections = [
    "Introduction",
    "Current Position",
    "Contact Info",
    "Skills",
    "Experience",
    "Education",
    "Projects",
    "Certifications",
    "Awards",
  ];
  const step = ["Submit CV", "Pre-Screening Questions", "Review Next Steps"];
  const stepStatus = ["Completed", "Pending", "In Progress"];

  // Pre-screening questions answers
  const [donePreScreening, setDonePreScreening] = useState(false);
  const [submittingPreScreening, setSubmittingPreScreening] = useState(false);

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files);
  }

  function handleEditCV(section) {
    setEditingCV(section);

    if (section != null) {
      setTimeout(() => {
        const sectionDetails = document.getElementById(section);

        if (sectionDetails) {
          sectionDetails.focus();
        }
      }, 100);
    }
  }

  function handleFile(files) {
    const file = checkFile(files);

    if (file) {
      setFile(file);
      handleFileSubmit(file);
    }
  }

  function handleFileChange(e) {
    const files = e.target.files;

    if (files.length > 0) {
      handleFile(files);
    }
  }

  function handleModal() {
    setModalType("jobDescription");
  }

  function handleRedirection(type) {
    if (type == "dashboard") {
      window.location.href = pathConstants.dashboard;
    }

    if (type == "interview") {
      sessionStorage.setItem("interviewRedirection", pathConstants.dashboard);
      window.location.href = `/interview/${interview.interviewID}`;
    }
  }

  function handleRemoveFile(e) {
    e.stopPropagation();
    e.target.value = "";

    setFile(null);
    setHasChanges(false);
    setUserCV(null);

    const storedCV = localStorage.getItem("userCV");

    if (storedCV != "null") {
      setDigitalCV(storedCV);
    } else {
      setDigitalCV(null);
    }
  }

  function handleReviewCV() {
    const parsedUserCV = JSON.parse(digitalCV);
    const formattedCV = {};

    cvSections.forEach((section, index) => {
      formattedCV[section] = parsedUserCV.digitalCV[index].content.trim() || "";
    });

    setFile(parsedUserCV.fileInfo);
    setUserCV(formattedCV);
  }

  function handleUploadCV() {
    fileInputRef.current.click();
  }

  function processState(index, isAdvance = false) {
    const currentStepIndex = step.indexOf(currentStep);

    if (currentStepIndex == index) {
      if (index == stepStatus.length - 1) {
        return stepStatus[0];
      }

      return isAdvance || userCV || buildingCV ? stepStatus[2] : stepStatus[1];
    }

    if (currentStepIndex > index) {
      return stepStatus[0];
    }

    return stepStatus[1];
  }

  useEffect(() => {
    const storedSelectedCareer = sessionStorage.getItem("selectedCareer");
    const storedCV = localStorage.getItem("userCV");

    if (storedCV && storedCV != "null") {
      setDigitalCV(storedCV);
    }

    if (storedSelectedCareer) {
      const parseStoredSelectedCareer = JSON.parse(storedSelectedCareer);
      fetchInterview(parseStoredSelectedCareer.id);
    } else {
      alert("No application is currently being managed.");
      window.location.href = pathConstants.dashboard;
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("hasChanges", JSON.stringify(hasChanges));
  }, [hasChanges]);

  function fetchInterview(interviewID) {
    axios({
      method: "POST",
      url: "/api/job-portal/fetch-interviews",
      data: { email: user.email, interviewID },
    })
      .then((res) => {
        const result = res.data;

        if (result.error) {
          alert(result.error);
          window.location.href = pathConstants.dashboard;
        } else {
          if (result[0].cvStatus) {
            alert("This application has already been processed.");
            window.location.href = pathConstants.dashboard;
          } else {
            setCurrentStep(step[0]);
            setInterview(result[0]);
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        alert("Error fetching existing applied jobs.");
        window.location.href = pathConstants.dashboard;
        console.log(err);
      });
  }

  function handleCVScreen() {
    if (editingCV != null) {
      alert("Please save the changes first.");
      return false;
    }

    const allEmpty = Object.values(userCV).every(
      (value: any) => value.trim() == ""
    );

    if (allEmpty) {
      alert("No details to be save.");
      return false;
    }

    let parsedDigitalCV = {
      errorRemarks: null,
      digitalCV: null,
    };

    if (digitalCV) {
      parsedDigitalCV = JSON.parse(digitalCV);

      if (parsedDigitalCV.errorRemarks) {
        alert(
          "Please fix the errors in the CV first.\n\n" +
            parsedDigitalCV.errorRemarks
        );
        return false;
      }
    }

    if (hasChanges) {
      const formattedUserCV = cvSections.map((section) => ({
        name: section,
        content: userCV[section]?.trim() || "",
      }));

      parsedDigitalCV.digitalCV = formattedUserCV;

      const data = {
        name: user.name,
        cvData: parsedDigitalCV,
        email: user.email,
        fileInfo: null,
      };

      if (file) {
        data.fileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
        };
      }

      axios({
        method: "POST",
        url: `/api/whitecloak/save-cv`,
        data,
      })
        .then(() => {
          localStorage.setItem(
            "userCV",
            JSON.stringify({ ...data, ...data.cvData })
          );
        })
        .catch((err) => {
          alert("Error saving CV. Please try again.");
          setCurrentStep(step[0]);
          console.log(err);
        });
    }

    setHasChanges(true);

    axios({
      url: "/api/whitecloak/screen-cv",
      method: "POST",
      data: {
        interviewID: interview.interviewID,
        userEmail: user.email,
      },
    })
      .then((res) => {
        const result = res.data;

        if (result.error) {
          alert(result.message);
          setCurrentStep(step[0]);
        } else {
          setCurrentStep(step[2]);
          setScreeningResult(result);
        }
      })
      .catch((err) => {
        alert("Error screening CV. Please try again.");
        setCurrentStep(step[0]);
        console.log(err);
      })
      .finally(() => {
        setHasChanges(false);
      });
  }

  function handlePreScreening() {
    // Check if there are pre-screening questions
    const questions = interview?.preScreeningQuestions || [];
    if (questions.length === 0) {
      // No questions, proceed directly to CV screening
      handleCVScreen();
      setDonePreScreening(true);
    } else {
      setCurrentStep(step[1]);
    }
  }

  function handlePreScreeningSubmit(data: Record<string, any>) {
    console.log("Pre-screening answers", data);
    setSubmittingPreScreening(true);

    // Save answers to interview
    axios({
      method: "POST",
      url: "/api/update-interview",
      data: {
        data: {
          preScreeningAnswers: data,
        },
        uid: interview._id,
      },
    })
      .then(() => {
        setDonePreScreening(true);
        handleCVScreen();
      })
      .catch((err) => {
        alert("Error saving pre-screening answers. Please try again.");
        console.log(err);
      })
      .finally(() => {
        setSubmittingPreScreening(false);
      });
  }

  function handleFileSubmit(file) {
    setBuildingCV(true);
    setHasChanges(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fName", file.name);
    formData.append("userEmail", user.email);

    axios({
      method: "POST",
      url: `${CORE_API_URL}/upload-cv`,
      data: formData,
    })
      .then((res) => {
        axios({
          method: "POST",
          url: `/api/whitecloak/digitalize-cv`,
          data: { chunks: res.data.cvChunks },
        })
          .then((res) => {
            const result = res.data.result;
            const parsedUserCV = JSON.parse(result);
            const formattedCV = {};

            cvSections.forEach((section, index) => {
              formattedCV[section] =
                parsedUserCV.digitalCV[index].content.trim();
            });

            setDigitalCV(result);
            setUserCV(formattedCV);
          })
          .catch((err) => {
            alert("Error building CV. Please try again.");
            console.log(err);
          })
          .finally(() => {
            setBuildingCV(false);
          });
      })
      .catch((err) => {
        alert("Error building CV. Please try again.");
        setBuildingCV(false);
        console.log(err);
      });
  }

  console.log("donePreScreening", donePreScreening);
  return (
    <>
      {loading && <Loader loaderData={""} loaderType={""} />}

      {interview && (
        <div className={styles.uploadCVContainer}>
          <div className={styles.uploadCVHeader}>
            {interview.organization && interview.organization.image && (
              <img alt="" src={interview.organization.image} />
            )}
            <div className={styles.textContainer}>
              <span className={styles.tag}>You're applying for</span>
              <span className={styles.title}>{interview.jobTitle}</span>
              {interview.organization && interview.organization.name && (
                <span className={styles.name}>
                  {interview.organization.name}
                </span>
              )}
              <span className={styles.description} onClick={handleModal}>
                View job description
              </span>
            </div>
          </div>

          <div className={styles.stepContainer}>
            <div className={styles.step}>
              {step.map((_, index) => (
                <div className={styles.stepBar} key={index}>
                  <img
                    alt=""
                    src={
                      assetConstants[
                        processState(index, true)
                          .toLowerCase()
                          .replace(" ", "_")
                      ]
                    }
                  />
                  {index < step.length - 1 && (
                    <hr
                      className={
                        styles[
                          processState(index).toLowerCase().replace(" ", "_")
                        ]
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            <div className={styles.step}>
              {step.map((item, index) => (
                <span
                  className={`${styles.stepDetails} ${
                    styles[
                      processState(index, true).toLowerCase().replace(" ", "_")
                    ]
                  }`}
                  key={index}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {currentStep == step[0] && (
            <>
              {!buildingCV && !userCV && !file && (
                <div className={styles.cvManageContainer}>
                  <div
                    className={styles.cvContainer}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <img alt="" src={assetConstants.uploadV2} />
                    <button onClick={handleUploadCV}>Upload CV</button>
                    <span>
                      Choose or drag and drop a file here. Our AI tools will
                      automatically pre-fill your CV and also check how well it
                      matches the role.
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />

                  <div className={styles.cvContainer}>
                    <img alt="" src={assetConstants.review} />
                    <button
                      className={`${digitalCV ? "" : "disabled"}`}
                      disabled={!digitalCV}
                      onClick={handleReviewCV}
                    >
                      Review Current CV
                    </button>
                    <span>
                      Already uploaded a CV? Take a moment to review your
                      details before we proceed.
                    </span>
                  </div>
                </div>
              )}

              {buildingCV && file && (
                <div className={styles.cvDetailsContainer}>
                  <div className={styles.gradient}>
                    <div className={styles.cvDetailsCard}>
                      <span className={styles.sectionTitle}>
                        <img alt="" src={assetConstants.account} />
                        Submit CV
                      </span>
                      <div className={styles.detailsContainer}>
                        <span className={styles.fileTitle}>
                          <img alt="" src={assetConstants.completed} />
                          {file.name}
                        </span>
                        <div className={styles.loadingContainer}>
                          <img alt="" src={assetConstants.loading} />
                          <div className={styles.textContainer}>
                            <span className={styles.title}>
                              Extracting information from your CV...
                            </span>
                            <span className={styles.description}>
                              Jia is building your profile...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!buildingCV && userCV && (
                <div className={styles.cvDetailsContainer}>
                  <div className={styles.gradient}>
                    <div className={styles.cvDetailsCard}>
                      <span className={styles.sectionTitle}>
                        <img alt="" src={assetConstants.account} />
                        Submit CV
                        <div className={styles.editIcon}>
                          <img
                            alt=""
                            src={
                              file ? assetConstants.xV2 : assetConstants.save
                            }
                            onClick={file ? handleRemoveFile : handleUploadCV}
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                      </span>

                      <div className={styles.detailsContainer}>
                        {file ? (
                          <span className={styles.fileTitle}>
                            <img alt="" src={assetConstants.completed} />
                            {file.name}
                          </span>
                        ) : (
                          <span className={styles.fileTitle}>
                            <img alt="" src={assetConstants.fileV2} />
                            You can also upload your CV and let our AI
                            automatically fill in your profile information.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {cvSections.map((section, index) => (
                    <div key={index} className={styles.gradient}>
                      <div className={styles.cvDetailsCard}>
                        <span className={styles.sectionTitle}>
                          {section}

                          <div className={styles.editIcon}>
                            <img
                              alt=""
                              src={
                                editingCV == section
                                  ? assetConstants.save
                                  : assetConstants.edit
                              }
                              onClick={() =>
                                handleEditCV(
                                  editingCV == section ? null : section
                                )
                              }
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          </div>
                        </span>

                        <div className={styles.detailsContainer}>
                          {editingCV == section ? (
                            <textarea
                              id={section}
                              placeholder="Upload your CV to auto-fill this section."
                              value={
                                userCV && userCV[section] ? userCV[section] : ""
                              }
                              onBlur={(e) => {
                                e.target.placeholder =
                                  "Upload your CV to auto-fill this section.";
                              }}
                              onChange={(e) => {
                                setUserCV({
                                  ...userCV,
                                  [section]: e.target.value,
                                });
                                setHasChanges(true);
                              }}
                              onFocus={(e) => {
                                e.target.placeholder = "";
                              }}
                            />
                          ) : (
                            <span
                              className={`${styles.sectionDetails} ${
                                userCV &&
                                userCV[section] &&
                                userCV[section].trim()
                                  ? styles.withDetails
                                  : ""
                              }`}
                            >
                              <Markdown>
                                {userCV &&
                                userCV[section] &&
                                userCV[section].trim()
                                  ? userCV[section].trim()
                                  : "Upload your CV to auto-fill this section."}
                              </Markdown>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={handlePreScreening}>Submit CV</button>
                </div>
              )}
            </>
          )}

          {/* Pre-screening questions */}
          {currentStep == step[1] &&
            interview?.preScreeningQuestions &&
            !donePreScreening && (
              <PreScreeningForm
                questions={interview.preScreeningQuestions}
                onSubmit={handlePreScreeningSubmit}
                submitting={submittingPreScreening}
              />
            )}

          {currentStep == step[1] && donePreScreening && (
            <div className={styles.cvScreeningContainer}>
              <img alt="" src={assetConstants.loading} />
              <span className={styles.title}>Sit tight!</span>
              <span className={styles.description}>
                Our smart reviewer is checking your qualifications.
              </span>
              <span className={styles.description}>
                We'll let you know what's next in just a moment.
              </span>
            </div>
          )}

          {currentStep == step[2] && screeningResult && (
            <div className={styles.cvResultContainer}>
              {screeningResult.applicationStatus == "Dropped" ? (
                <>
                  <img alt="" src={assetConstants.userRejected} />
                  <span className={styles.title}>
                    This role may not be the best match.
                  </span>
                  <span className={styles.description}>
                    Based on your CV, it looks like this position might not be
                    the right fit at the moment.
                  </span>
                  <br />
                  <span className={styles.description}>
                    Review your screening results and see recommended next
                    steps.
                  </span>
                  <div className={styles.buttonContainer}>
                    <button onClick={() => handleRedirection("dashboard")}>
                      View Dashboard
                    </button>
                  </div>
                </>
              ) : screeningResult.status == "For AI Interview" ? (
                <>
                  <img alt="" src={assetConstants.checkV3} />
                  <span className={styles.title}>
                    Hooray! You’re a strong fit for this role.
                  </span>
                  <span className={styles.description}>
                    Jia thinks you might be a great match.
                  </span>
                  <br />
                  <span className={`${styles.description} ${styles.bold}`}>
                    Ready to take the next step?
                  </span>
                  <span className={styles.description}>
                    You may start your AI interview now.
                  </span>
                  <div className={styles.buttonContainer}>
                    <button onClick={() => handleRedirection("interview")}>
                      Start AI Interview
                    </button>
                    <button
                      className="secondaryBtn"
                      onClick={() => handleRedirection("dashboard")}
                    >
                      View Dashboard
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img alt="" src={assetConstants.userCheck} />
                  <span className={styles.title}>
                    Your CV is now being reviewed by the hiring team.
                  </span>
                  <span className={styles.description}>
                    We’ll be in touch soon with updates about your application.
                  </span>
                  <div className={styles.buttonContainer}>
                    <button onClick={() => handleRedirection("dashboard")}>
                      View Dashboard
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
