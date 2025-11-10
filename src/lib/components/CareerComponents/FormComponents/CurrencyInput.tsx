import { Control, Controller } from "react-hook-form";
import { assetConstants } from "@/lib/utils/constantsV2";

export const CurrencyInput = ({
  label,
  control,
  name,
  placeholder,
}: {
  label: string;
  control: Control<any>;
  name: string;
  placeholder: string;
}) => {
  return (
    <div style={{ flex: 1 }}>
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
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                  fontSize: "16px",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              >
                ₱
              </span>
              <input
                type="number"
                className="input-focus-ring form-control"
                style={{
                  paddingLeft: "28px",
                  paddingRight: error ? "72px" : "50px",
                  fontSize: 16,
                  color: "#181D27",
                  fontWeight: 500,
                  borderRadius: "8px",
                  border: error ? "1px solid #FDA29B" : "1px solid #E9EAEB",
                  width: "100%",
                  outline: "none",
                }}
                placeholder={placeholder}
                min={0}
                value={value === 0 ? "" : value}
                onChange={(e) => {
                  onChange(e.target.value || "");
                }}
              />
              {error && (
                <img
                  src={assetConstants.alertCircle}
                  alt="alert"
                  style={{
                    position: "absolute",
                    right: "52px",
                    width: 16,
                    height: 16,
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />
              )}
              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#181D27",
                  fontSize: "16px",
                  fontWeight: 500,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              >
                PHP
              </span>
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
