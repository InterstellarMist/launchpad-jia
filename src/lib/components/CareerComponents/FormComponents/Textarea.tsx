export const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  height = 180,
}: {
  label?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  height?: number;
}) => {
  return (
    <div style={{ flex: 1 }}>
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
      <textarea
        value={value}
        className="form-control"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value || "")}
        style={{
          height: `${height}px`,
          maxHeight: `${height}px`,
          fontSize: 16,
          color: "#181D27",
          fontWeight: 500,
          borderRadius: "8px",
          resize: "none",
          overflowY: "auto",
        }}
      />
    </div>
  );
};
