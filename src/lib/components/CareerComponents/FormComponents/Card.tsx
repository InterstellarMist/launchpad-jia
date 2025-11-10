import { assetConstants } from "@/lib/utils/constantsV2";

export const Card = ({
  title,
  children,
  icon,
  gap = 24,
  count,
  isOptional = false,
  button,
}: {
  title: string;
  children: React.ReactNode;
  icon?: string;
  gap?: number;
  count?: number;
  isOptional?: boolean;
  button?: React.ReactNode;
}) => {
  return (
    <div className="layered-card-middle">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          margin: "4px 12px 0px 12px",
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
          {count !== undefined && (
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
              {count}
            </div>
          )}
        </div>
        {button && <div>{button}</div>}
      </div>
      <div className="layered-card-content" style={{ gap: gap }}>
        {children}
      </div>
    </div>
  );
};
