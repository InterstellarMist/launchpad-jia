import { useEffect, useState, useImperativeHandle, Ref } from "react";
import philippineCitiesAndProvinces from "../../../../../public/philippines-locations.json";
import { Card } from "../FormComponents/Card";
import { TextInput } from "../FormComponents/TextInput";
import { DropdownInput } from "../FormComponents/DropdownInput";
import { CurrencyInput } from "../FormComponents/CurrencyInput";
import RichTextEditor from "../../CareerComponents/RichTextEditor";
import { Label } from "../FormComponents/Label";
import { UseFormSetValue, useForm, Control, Controller } from "react-hook-form";
import { useAppContext } from "@/lib/context/AppContext";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CareerDetailsFormData,
  careerDetailsSchema,
} from "@/lib/types/careerFormTypes";
import axios from "axios";
import { errorToast, successToast } from "@/lib/Utils";

const workSetupOptions = [
  { name: "Fully Remote" },
  { name: "Onsite" },
  { name: "Hybrid" },
];

const employmentTypeOptions = [{ name: "Full-Time" }, { name: "Part-Time" }];

const tips = [
  {
    statement: "Use clear, standard job titles",
    description:
      "for better searchability (e.g., “Software Engineer” instead of “Code Ninja” or “Tech Rockstar”).",
  },
  {
    statement: "Avoid abbreviations",
    description:
      "or internal role codes that applicants may not understand (e.g., use “QA Engineer” instead of “QE II” or “QA-TL”).",
  },
  {
    statement: "Keep it concise",
    description:
      "job titles should be no more than a few words (2–4 max), avoiding fluff or marketing terms.",
  },
];

export const TipsCard = () => {
  return (
    <Card title="Tips" icon="tips" gap={0}>
      {tips.map((tip, index) => (
        <p
          key={index}
          style={{
            fontSize: 14,
            color: "#717680",
            fontWeight: 500,
            marginBottom: `${index === tips.length - 1 ? 0 : 14}px`,
          }}
        >
          <span style={{ fontWeight: 700, color: "#181D27" }}>
            {tip.statement}
          </span>{" "}
          {tip.description}
        </p>
      ))}
    </Card>
  );
};

const CareerInformationCard = ({
  control,
  setValue,
}: {
  control: Control<CareerDetailsFormData>;
  setValue: UseFormSetValue<CareerDetailsFormData>;
}) => {
  const [cityList, setCityList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);

  useEffect(() => {
    const parseProvinces = () => {
      setProvinceList(philippineCitiesAndProvinces.provinces);
      const defaultProvince = philippineCitiesAndProvinces.provinces[0];
      const cities = philippineCitiesAndProvinces.cities.filter(
        (city) => city.province === defaultProvince.key
      );
      setCityList(cities);
    };
    parseProvinces();
  }, []);

  return (
    <Card title="1. Career Information">
      <div>
        <Label text="Basic Information" />
        <TextInput
          label="Job Title"
          placeholder="Enter job title"
          control={control}
          name="jobTitle"
        />
      </div>
      <div>
        <Label text="Work Setting" />
        <div style={{ display: "flex", gap: 16 }}>
          <DropdownInput
            label="Employment Type"
            options={employmentTypeOptions}
            placeholder="Choose employment type"
            control={control}
            name="employmentType"
          />
          <DropdownInput
            label="Arrangement"
            options={workSetupOptions}
            placeholder="Choose work arrangement"
            control={control}
            name="workSetup"
          />
        </div>
      </div>
      <div>
        <Label text="Location" />
        <div style={{ display: "flex", gap: 16 }}>
          <DropdownInput
            label="Country"
            options={[]}
            placeholder="Choose country"
            control={control}
            name="country"
          />
          <DropdownInput
            label="State / Province"
            control={control}
            name="province"
            onChange={(province) => {
              setValue("province", province);
              const provinceObj = provinceList.find((p) => p.name === province);
              const cities = philippineCitiesAndProvinces.cities.filter(
                (city) => city.province === provinceObj.key
              );
              setCityList(cities);
              setValue("city", cities[0].name);
            }}
            options={provinceList}
            placeholder="Choose state / province"
          />
          <DropdownInput
            label="City"
            options={cityList}
            placeholder="Choose city"
            control={control}
            name="city"
          />
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Label text="Salary" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifySelf: "end",
              gap: 8,
              minWidth: "120px",
            }}
          >
            <label className="switch">
              <Controller
                control={control}
                name="salaryNegotiable"
                render={({ field: { onChange, value } }) => (
                  <input type="checkbox" onChange={onChange} checked={value} />
                )}
              />
              <span className="slider round"></span>
            </label>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#414651" }}>
              Negotiable
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <CurrencyInput
            label="Minimum Salary"
            placeholder="0"
            control={control}
            name="minimumSalary"
          />
          <CurrencyInput
            label="Maximum Salary"
            placeholder="0"
            control={control}
            name="maximumSalary"
          />
        </div>
      </div>
    </Card>
  );
};

const JobDescriptionCard = ({
  control,
}: {
  control: Control<CareerDetailsFormData>;
}) => {
  return (
    <Card title="2. Job Description">
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            <RichTextEditor
              setText={onChange}
              text={value}
              hasError={!!error}
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
          </div>
        )}
      />
    </Card>
  );
};

interface CareerDetailsSectionRef {
  onClick: () => void;
}

export const CareerDetailsSection = ({
  ref,
  setHasChanges,
  setHasErrors,
  setIsSavingCareer,
  onDataChange,
  data,
  moveNextStep,
  setCareerID,
}: {
  ref: Ref<CareerDetailsSectionRef>;
  setHasChanges: (hasChanges: boolean) => void;
  setHasErrors: (hasErrors: boolean) => void;
  setIsSavingCareer: (isSavingCareer: boolean) => void;
  onDataChange: (data: any) => void;
  data: CareerDetailsFormData | null;
  moveNextStep: () => void;
  setCareerID: (careerID: string) => void;
}) => {
  const { user, orgID } = useAppContext();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<CareerDetailsFormData>({
    resolver: zodResolver(careerDetailsSchema),
    defaultValues: {
      jobTitle: data?.jobTitle || "",
      description: data?.description || "",
      employmentType: data?.employmentType || "",
      workSetup: data?.workSetup || "",
      country: data?.country || "Philippines",
      province: data?.province || "",
      city: data?.city || "",
      minimumSalary: data?.minimumSalary || 0,
      maximumSalary: data?.maximumSalary || 0,
      salaryNegotiable: data?.salaryNegotiable || true,
    },
  });

  useEffect(() => {
    setHasChanges(isDirty);
    setHasErrors(Object.keys(errors).length > 0);
  }, [isDirty, errors]);

  const onSubmit = async (data: CareerDetailsFormData) => {
    console.log("Form submitted successfully:", data);

    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };

    const careerData = {
      ...data,
      orgID,
      lastEditedBy: userInfoSlice,
      createdBy: userInfoSlice,
      status: "inactive",
    };

    try {
      setIsSavingCareer(true);
      const response = await axios.post("/api/add-career", careerData);
      if (response.status === 200) {
        successToast("Career added successfully", 1300);
        onDataChange(data);
        moveNextStep();
        setCareerID(response.data.career._id);
      }
    } catch (error) {
      console.error(error);
      errorToast("Failed to add career", 1300);
    } finally {
      setIsSavingCareer(false);
    }
  };

  const onError = (errors: any) => {
    console.log("Validation errors preventing submission:", errors);
  };

  useImperativeHandle(
    ref,
    () => ({
      onClick: () => {
        handleSubmit(onSubmit, onError)();
      },
    }),
    [handleSubmit, onSubmit, onError]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <CareerInformationCard control={control} setValue={setValue} />
          <JobDescriptionCard control={control} />
        </div>

        <div
          style={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <TipsCard />
        </div>
      </div>
    </form>
  );
};
