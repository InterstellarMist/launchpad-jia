export const CurrencyInput = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
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
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#6c757d",
            fontSize: "16px",
            pointerEvents: "none",
          }}
        >
          ₱
        </span>
        <input
          type="number"
          className="form-control"
          style={{ paddingLeft: "28px" }}
          placeholder={placeholder}
          min={0}
          value={value}
          onChange={(e) => {
            onChange(e.target.value || "");
          }}
        />
        <span
          style={{
            position: "absolute",
            right: "30px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#6c757d",
            fontSize: "16px",
            pointerEvents: "none",
          }}
        >
          PHP
        </span>
      </div>
    </div>
  );
};
