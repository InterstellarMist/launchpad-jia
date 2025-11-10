"use client";
import { useState } from "react";

export default function CustomDropdown(props) {
  const {
    onSelect,
    value,
    options,
    placeholder,
    width,
    size = "sm",
    hasError,
  } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="dropdown" style={{ width: width ? `${width}px` : "100%" }}>
      <button
        disabled={options?.length === 0}
        className="dropdown-btn fade-in-bottom"
        style={{
          width: "100%",
          border: hasError ? "1px solid #FDA29B" : "1px solid #E9EAEB",
        }}
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
      >
        <span
          style={{
            fontSize: size === "sm" ? 16 : 14,
            fontWeight: 500,
            color: `${
              value ? (size === "sm" ? "#181D27" : "#414651") : "#717680"
            }`,
            textTransform: value ? "capitalize" : "none",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {options
            .find((option) => option.name === value)
            ?.icon?.includes("la") && (
            <i
              className={options.find((option) => option.name === value)?.icon}
            ></i>
          )}{" "}
          {options
            .find((option) => option.name === value)
            ?.icon?.includes("svg") && (
            <img
              src={options.find((option) => option.name === value)?.icon}
              alt={options.find((option) => option.name === value)?.name}
            />
          )}{" "}
          {value?.replace("_", " ") || placeholder}
        </span>
        <i className="la la-angle-down ml-10"></i>
      </button>
      <div
        className={`dropdown-menu w-100 mt-1 org-dropdown-anim${
          dropdownOpen ? " show" : ""
        }`}
        style={{
          padding: "10px",
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        {options.map((option, index) => (
          <div style={{ borderBottom: "1px solid #ddd" }} key={index}>
            <button
              type="button"
              className="dropdown-item d-flex align-items-center"
              style={{
                minWidth: 220,
                borderRadius: value === option.name ? 0 : 10,
                overflow: "hidden",
                paddingBottom: 10,
                paddingTop: 10,
                color: "#181D27",
                fontWeight: value === option.name ? 700 : 500,
                background: value === option.name ? "#F8F9FC" : "transparent",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                whiteSpace: "wrap",
                textTransform: "capitalize",
              }}
              onClick={() => {
                onSelect(option.name);
                setDropdownOpen(false);
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {option.icon?.includes("la") && <i className={option.icon}></i>}{" "}
                {option.icon?.includes("svg") && (
                  <img src={option.icon} alt={option.name} />
                )}{" "}
                {option.name?.replace("_", " ")}
              </div>
              {option.name === value && (
                <i
                  className="la la-check"
                  style={{
                    fontSize: "20px",
                    background:
                      "linear-gradient(180deg, #9FCAED 0%, #CEB6DA 33%, #EBACC9 66%, #FCCEC0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                ></i>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
