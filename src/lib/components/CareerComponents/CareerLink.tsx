"use client";

import { useEffect, useState } from "react";
import { candidateActionToast } from "../../Utils";
import { Card } from "./FormComponents/Card";
import { assetConstants } from "@/lib/utils/constantsV2";

export default function CareerLink(props: { career: any }) {
  const { career } = props;
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    let careerRedirection = "applicant";
    if (career.orgID === "682d3fc222462d03263b0881") {
      careerRedirection = "whitecloak";
    }
    setShareLink(
      `https://www.hellojia.ai/${careerRedirection}/job-openings/${career._id}`
    );
  }, [career]);

  if (!shareLink) return null;

  return (
    <Card title="Career Link" collapsible={false}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            gap: 10,
          }}
        >
          <input
            type="text"
            className="form-control"
            value={shareLink}
            readOnly={true}
            style={{
              backgroundColor: "#FFFFFF",
              fontWeight: 500,
              fontSize: 16,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              navigator.clipboard.writeText(shareLink);
              candidateActionToast(
                "Career Link Copied to Clipboard",
                1300,
                <i className="la la-link mr-1 text-info"></i>
              );
            }}
          >
            <img src={assetConstants.copy} alt="copy" />
          </div>
        </div>
      </div>
    </Card>
  );
}
