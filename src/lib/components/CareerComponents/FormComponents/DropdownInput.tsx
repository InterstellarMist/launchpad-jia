import CustomDropdown from "../CustomDropdown";
import { Control, Controller } from "react-hook-form";

export const DropdownInput = ({
  label,
  control,
  name,
  placeholder,
  options,
  onChange,
}: {
  label?: string;
  control: Control<any>;
  name: string;
  placeholder: string;
  options: { name: string; icon?: string }[];
  onChange?: (value: string) => void;
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
      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange: formOnChange, value },
          fieldState: { error },
        }) => (
          <>
            <CustomDropdown
              hasError={!!error}
              onSelect={(selectedValue) => {
                formOnChange(selectedValue);
                onChange?.(selectedValue);
              }}
              value={value}
              options={options}
              placeholder={placeholder}
            />
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
