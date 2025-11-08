import { assetConstants } from "@/lib/utils/constantsV2";

export const Card = ({
  title,
  children,
  icon,
  gap = 24,
}: {
  title: string;
  children: React.ReactNode;
  icon?: string;
  gap?: number;
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
      <div className="layered-card-content" style={{ gap: gap }}>
        {children}
      </div>
    </div>
  );
};
