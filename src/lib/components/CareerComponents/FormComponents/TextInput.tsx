export const TextInput = ({
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
      <input
        value={value}
        className="form-control"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value || "")}
        style={{
          fontSize: 16,
          color: "#181D27",
          fontWeight: 500,
          borderRadius: "8px",
        }}
      />
    </div>
  );
};
