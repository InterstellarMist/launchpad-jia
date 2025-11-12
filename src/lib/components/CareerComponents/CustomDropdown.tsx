"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Update menu position when dropdown opens
  useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setMenuPosition({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
          });
        }
      };

      updatePosition();

      // Update position on scroll or resize
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [dropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div
      ref={dropdownRef}
      className="dropdown"
      style={{
        width: width ? `${width}px` : "100%",
        position: "relative",
      }}
    >
      <button
        ref={buttonRef}
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
      {dropdownOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            className={`dropdown-menu mt-1 org-dropdown-anim show`}
            style={{
              display: "block",
              position: "fixed",
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              width: "auto",
              minWidth: `${menuPosition.width}px`,
              zIndex: 9999,
              backgroundColor: "#fff",
              border: "1px solid #E9EAEB",
              borderRadius: "8px",
              boxShadow:
                "0px 4px 6px -2px #0A0D1208, 0px 12px 16px -4px #0A0D1214",
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
                    width: "100%",
                    borderRadius: value === option.name ? 0 : 10,
                    overflow: "hidden",
                    paddingBottom: 10,
                    paddingTop: 10,
                    color: "#181D27",
                    fontWeight: value === option.name ? 700 : 500,
                    background:
                      value === option.name ? "#F8F9FC" : "transparent",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    whiteSpace: "wrap",
                    textTransform: "capitalize",
                    border: "none",
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
                    {option.icon?.includes("la") && (
                      <i className={option.icon}></i>
                    )}{" "}
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
          </div>,
          document.body
        )}
    </div>
  );
}
