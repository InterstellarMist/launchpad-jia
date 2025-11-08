import CustomDropdown from "../CustomDropdown";

export const DropdownInput = ({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  options: { name: string; icon?: string }[];
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
      <CustomDropdown
        onSelectSetting={onChange}
        screeningSetting={value}
        settingList={options}
        placeholder={placeholder}
      />
    </div>
  );
};
