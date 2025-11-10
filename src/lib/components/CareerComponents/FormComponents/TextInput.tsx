import { Control, Controller } from "react-hook-form";
import { assetConstants } from "@/lib/utils/constantsV2";

const variantStyles = {
  size: {
    xs: {
      fontSize: 14,
      padding: "4px 8px",
      paddingRightWithIcon: "32px",
    },
    sm: {
      fontSize: 16,
      padding: "10px 12px",
      paddingRightWithIcon: "36px",
    },
  },
};

export const TextInput = ({
  label,
  control,
  name,
  placeholder,
  size = "sm",
  adaptive = true,
}: {
  label?: string;
  control: Control<any>;
  placeholder?: string;
  size?: "xs" | "sm";
  adaptive?: boolean;
  name: string;
}) => {
  return (
    <div>
      {label && (
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
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <input
                value={value}
                placeholder={placeholder}
                className="input-focus-ring"
                onChange={(e) => onChange(e.target.value || "")}
                style={{
                  fontSize: variantStyles.size[size].fontSize,
                  color: "#181D27",
                  fontWeight: 500,
                  borderRadius: "8px",
                  padding: variantStyles.size[size].padding,
                  paddingRight: error
                    ? variantStyles.size[size].paddingRightWithIcon
                    : undefined,
                  height: adaptive ? "fit-content" : "auto",
                  border: error ? "1px solid #FDA29B" : "1px solid #E9EAEB",
                  width: "100%",
                  outline: "none",
                }}
              />
              {error && (
                <img
                  src={assetConstants.alertCircle}
                  alt="alert"
                  style={{
                    position: "absolute",
                    right: "12px",
                    width: 16,
                    height: 16,
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
            {error && (
              <p
                style={{
                  color: "#F04438",
                  fontSize: 14,
                  marginBottom: 0,
                  marginTop: 6,
                  fontWeight: 400,
                }}
              >
                {error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};
