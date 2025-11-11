"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import InterviewQuestionGeneratorV2 from "./InterviewQuestionGeneratorV2";
import { useAppContext } from "../../context/AppContext";
import DirectInterviewLinkV2 from "./DirectInterviewLinkV2";
import CareerFormV2 from "./FormComponents/CareerFormV2";
import CareerLink from "./CareerLink";
import {
  CareerDetailsSummaryCard,
  CvReviewSummaryCard,
  AiInterviewSummaryCard,
  PipelineStagesSummaryCard,
} from "./FormSections/SummaryCards";
import { transformFormDataToCachedData } from "@/lib/utils/transformCareerData";
import { Card } from "./FormComponents/Card";
import { assetConstants } from "@/lib/utils/constantsV2";

export default function JobDescriptionV2({
  formData,
  setFormData,
  editModal,
  isEditing,
  setIsEditing,
  handleCancelEdit,
}: {
  formData: any;
  setFormData: (formData: any) => void;
  editModal: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleCancelEdit: () => void;
}) {
  const { user } = useAppContext();
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (editModal) {
      setShowEditModal(true);
    }
  }, [editModal]);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  async function updateCareer() {
    const userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };
    const input = {
      _id: formData._id,
      jobTitle: formData.jobTitle,
      updatedAt: Date.now(),
      questions: formData.questions,
      status: formData.status,
      screeningSetting: formData.screeningSetting,
      requireVideo: formData.requireVideo,
      description: formData.description,
      lastEditedBy: userInfoSlice,
      createdBy: userInfoSlice,
    };

    Swal.fire({
      title: "Updating career...",
      text: "Please wait while we update the career...",
      allowOutsideClick: false,
    });

    try {
      const response = await axios.post("/api/update-career", input);

      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Career updated successfully",
          icon: "success",
          allowOutsideClick: false,
        }).then(() => {
          setIsEditing(false);
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update career",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  }

  async function deleteCareer() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting career...",
          text: "Please wait while we delete the career...",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          const response = await axios.post("/api/delete-career", {
            id: formData._id,
          });

          if (response.data.success) {
            Swal.fire({
              title: "Deleted!",
              text: "The career has been deleted.",
              icon: "success",
              allowOutsideClick: false,
            }).then(() => {
              window.location.href = "/recruiter-dashboard/careers";
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: response.data.error || "Failed to delete the career",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error deleting career:", error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the career",
            icon: "error",
          });
        }
      }
    });
  }

  // Transform formData to CachedFormData format
  const cachedData = transformFormDataToCachedData(formData);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 16,
      }}
    >
      <div className="thread-set">
        <div className="left-thread">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              width: "100%",
            }}
          >
            <CareerDetailsSummaryCard
              data={cachedData.careerDetails}
              showEditButton={false}
            />
            <CvReviewSummaryCard
              data={cachedData.cvReview}
              showEditButton={false}
            />
            <AiInterviewSummaryCard
              data={cachedData.aiInterview}
              showEditButton={false}
            />
            <PipelineStagesSummaryCard
              data={cachedData.pipelineStages}
              showEditButton={false}
            />
            {isEditing && (
              <div className="layered-card-outer">
                <div className="layered-card-middle">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      width: "100%",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 8,
                        background: "#181D27",
                        borderRadius: "60px",
                      }}
                    >
                      <i
                        className="la la-comment-alt"
                        style={{ fontSize: 20, color: "#FFFFFF" }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 16,
                        color: "#181D27",
                        fontWeight: 700,
                      }}
                    >
                      Interview Questions
                    </span>
                  </div>
                  <div className="layered-card-content">
                    <InterviewQuestionGeneratorV2
                      questions={formData.questions}
                      setQuestions={(questions) =>
                        setFormData({ ...formData, questions: questions })
                      }
                      jobTitle={formData.jobTitle}
                      description={formData.description}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="right-thread">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CareerLink career={formData} />
            <DirectInterviewLinkV2
              formData={formData}
              setFormData={setFormData}
            />
            {isEditing && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  alignItems: "center",
                  marginBottom: "16px",
                  width: "100%",
                }}
              >
                <button
                  className="button-primary"
                  style={{ width: "50%" }}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  className="button-primary"
                  style={{ width: "50%" }}
                  onClick={updateCareer}
                >
                  Save Changes
                </button>
              </div>
            )}
            <Card title="Advanced Settings" icon="settings" collapsible={false}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <button
                  onClick={() => {
                    deleteCareer();
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    backgroundColor: "#FFFFFF",
                    color: "#B32318",
                    borderRadius: "60px",
                    padding: "5px 10px",
                    border: "1px solid #B32318",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  <i
                    className="la la-trash"
                    style={{ color: "#B32318", fontSize: 16 }}
                  ></i>
                  <span>Delete this career</span>
                </button>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#717680",
                    textAlign: "center",
                  }}
                >
                  Be careful, this action cannot be undone.
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {showEditModal && (
        <div
          className="modal show fade-in-bottom"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.45)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1050,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100vw",
            }}
          >
            <div
              className="modal-content"
              style={{
                overflowY: "scroll",
                height: "100vh",
                width: "90vw",
                background: "#fff",
                border: `1.5px solid #E9EAEB`,
                borderRadius: 14,
                boxShadow: "0 8px 32px rgba(30,32,60,0.18)",
                padding: "24px",
              }}
            >
              <CareerFormV2 formType="edit" careerID={formData._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
