import { assetConstants } from "@/lib/utils/constantsV2";

export const Label = ({
  text,
  subtitle,
  isOptional = false,
  icon,
}: {
  text: string;
  subtitle?: string;
  isOptional?: boolean;
  icon?: string;
}) => {
  return (
    <div style={{ marginBottom: 8 }}>
      <p
        style={{
          fontSize: 16,
          color: "#181D27",
          fontWeight: 700,
          marginBottom: 0,
        }}
      >
        {icon && (
          <img
            src={assetConstants[icon]}
            alt="icon"
            height={20}
            width={20}
            style={{ marginRight: 8 }}
          />
        )}
        {text}
        {isOptional && (
          <span style={{ color: "#717680", fontSize: 16, fontWeight: 500 }}>
            {" "}
            (optional)
          </span>
        )}
      </p>
      {subtitle && (
        <p
          style={{
            fontSize: 16,
            color: "#414651",
            fontWeight: 500,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
