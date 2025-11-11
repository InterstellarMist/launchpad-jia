import { useState } from "react";
import { assetConstants } from "@/lib/utils/constantsV2";

export const Badge = ({ text }: { text: string }) => {
  return (
    <div
      style={{
        borderRadius: "20px",
        border: "1px solid #D5D9EB",
        backgroundColor: "#F8F9FC",
        color: "#363F72",
        fontSize: "12px",
        fontWeight: 700,
        width: 22,
        height: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {text}
    </div>
  );
};

export const Card = ({
  title,
  children,
  icon,
  gap = 24,
  count,
  isOptional = false,
  button,
  collapsible = false,
  defaultCollapsed = false,
}: {
  title: string;
  children: React.ReactNode;
  icon?: string;
  gap?: number;
  count?: number;
  isOptional?: boolean;
  button?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="layered-card-middle">
      <div
        onClick={toggleCollapse}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          margin: "4px 12px 0px 12px",
          cursor: collapsible ? "pointer" : "default",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
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
          {collapsible && (
            <img
              src={assetConstants.chevron}
              alt="chevron"
              height={20}
              width={20}
              style={{
                transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.2s ease",
              }}
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
            {isOptional && (
              <span style={{ color: "#717680", fontSize: 16, fontWeight: 500 }}>
                {" "}
                (optional)
              </span>
            )}
          </h1>
          {count !== undefined && <Badge text={count.toString()} />}
        </div>
        {button && <div>{button}</div>}
      </div>
      <div
        style={{
          overflow: "hidden",
          maxHeight: collapsible && isCollapsed ? 0 : "10000px",
          opacity: collapsible && isCollapsed ? 0 : 1,
          transition: collapsible
            ? "max-height 0.3s ease, opacity 0.3s ease"
            : "none",
        }}
      >
        <div
          className="layered-card-content"
          style={{ gap: gap, width: "inherit" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
