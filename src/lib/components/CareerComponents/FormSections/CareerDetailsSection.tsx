import { useEffect, useState } from "react";
import philippineCitiesAndProvinces from "../../../../../public/philippines-locations.json";
import InterviewQuestionGeneratorV2 from "../InterviewQuestionGeneratorV2";
import CustomDropdown from "../CustomDropdown";
import { Card } from "../FormComponents/Card";
import { TextInput } from "../FormComponents/TextInput";
import { DropdownInput } from "../FormComponents/DropdownInput";
import { CurrencyInput } from "../FormComponents/CurrencyInput";
import RichTextEditor from "../../CareerComponents/RichTextEditor";

interface CareerInformationCardProps {
  props: {
    jobTitle: string;
    setJobTitle: (value: string) => void;
    employmentType: string;
    setEmploymentType: (value: string) => void;
    workSetup: string;
    setWorkSetup: (value: string) => void;
    country: string;
    setCountry: (value: string) => void;
    province: string;
    setProvince: (value: string) => void;
    city: string;
    setCity: (value: string) => void;
    minimumSalary: string;
    setMinimumSalary: (value: string) => void;
    maximumSalary: string;
    setMaximumSalary: (value: string) => void;
    provinceList: { name: string; key: string }[];
    cityList: { name: string; key: string }[];
    setCityList: (value: { name: string; key: string }[]) => void;
    salaryNegotiable: boolean;
    setSalaryNegotiable: (value: boolean) => void;
  };
}

interface JobDescriptionCardProps {
  text: string;
  setText: (text: string) => void;
}

// Setting List icons
const screeningSettingList = [
  {
    name: "Good Fit and above",
    icon: "la la-check",
  },
  {
    name: "Only Strong Fit",
    icon: "la la-check-double",
  },
  {
    name: "No Automatic Promotion",
    icon: "la la-times",
  },
];

const workSetupOptions = [
  {
    name: "Fully Remote",
  },
  {
    name: "Onsite",
  },
  {
    name: "Hybrid",
  },
];

const employmentTypeOptions = [
  {
    name: "Full-Time",
  },
  {
    name: "Part-Time",
  },
];

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

const CareerInformationCard = ({ props }: CareerInformationCardProps) => {
  const {
    jobTitle,
    setJobTitle,
    employmentType,
    setEmploymentType,
    workSetup,
    setWorkSetup,
    country,
    setCountry,
    province,
    setProvince,
    city,
    setCity,
    minimumSalary,
    setMinimumSalary,
    maximumSalary,
    setMaximumSalary,
    provinceList,
    cityList,
    setCityList,
    salaryNegotiable,
    setSalaryNegotiable,
  } = props;

  return (
    <Card title="1. Career Information">
      <div>
        <p
          style={{
            fontSize: 14,
            color: "#181D27",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Basic Information
        </p>
        <TextInput
          label="Job Title"
          value={jobTitle}
          onChange={setJobTitle}
          placeholder="Enter job title"
        />
      </div>
      <div>
        <p
          style={{
            fontSize: 14,
            color: "#181D27",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Work Setting
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          <DropdownInput
            label="Employment Type"
            value={employmentType}
            onChange={setEmploymentType}
            options={employmentTypeOptions}
            placeholder="Select employment type"
          />
          <DropdownInput
            label="Arrangement"
            value={workSetup}
            onChange={setWorkSetup}
            options={workSetupOptions}
            placeholder="Choose work arrangement"
          />
        </div>
      </div>
      <div>
        <p
          style={{
            fontSize: 14,
            color: "#181D27",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Location
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          <DropdownInput
            label="Country"
            value={country}
            onChange={setCountry}
            options={[]}
            placeholder="Choose country"
          />
          <DropdownInput
            label="State / Province"
            value={province}
            onChange={(province) => {
              setProvince(province);
              const provinceObj = provinceList.find((p) => p.name === province);
              const cities = philippineCitiesAndProvinces.cities.filter(
                (city) => city.province === provinceObj.key
              );
              // TODO: fix type error
              setCityList(cities);
              setCity(cities[0].name);
            }}
            options={provinceList}
            placeholder="Choose state / province"
          />
          <DropdownInput
            label="City"
            value={city}
            onChange={setCity}
            options={cityList}
            placeholder="Choose city"
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
          <p
            style={{
              fontSize: 14,
              color: "#181D27",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Salary
          </p>
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
              <input
                type="checkbox"
                checked={salaryNegotiable}
                onChange={() => setSalaryNegotiable(!salaryNegotiable)}
              />
              <span className="slider round"></span>
            </label>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#414651" }}>
              {salaryNegotiable ? "Negotiable" : "Fixed"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <CurrencyInput
            label="Minimum Salary"
            value={minimumSalary}
            onChange={setMinimumSalary}
            placeholder="Enter minimum salary"
          />
          <CurrencyInput
            label="Maximum Salary"
            value={maximumSalary}
            onChange={setMaximumSalary}
            placeholder="Enter maximum salary"
          />
        </div>
      </div>
    </Card>
  );
};

const JobDescriptionCard = ({ text, setText }: JobDescriptionCardProps) => {
  return (
    <Card title="2. Job Description">
      {/* TODO: Edit Rich Text Editor */}
      <RichTextEditor setText={setText} text={text} />
    </Card>
  );
};

export const CareerDetailsSection = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workSetup, setWorkSetup] = useState("");
  const [salaryNegotiable, setSalaryNegotiable] = useState(true);
  const [minimumSalary, setMinimumSalary] = useState("");
  const [maximumSalary, setMaximumSalary] = useState("");
  const [country, setCountry] = useState("Philippines");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [employmentType, setEmploymentType] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      category: "CV Validation / Experience",
      questionCountToAsk: null,
      questions: [],
    },
    {
      id: 2,
      category: "Technical",
      questionCountToAsk: null,
      questions: [],
    },
    {
      id: 3,
      category: "Behavioral",
      questionCountToAsk: null,
      questions: [],
    },
    {
      id: 4,
      category: "Analytical",
      questionCountToAsk: null,
      questions: [],
    },
    {
      id: 5,
      category: "Others",
      questionCountToAsk: null,
      questions: [],
    },
  ]);
  const [screeningSetting, setScreeningSetting] =
    useState("Good Fit and above");
  const [requireVideo, setRequireVideo] = useState(true);

  useEffect(() => {
    const parseProvinces = () => {
      setProvinceList(philippineCitiesAndProvinces.provinces);
      const defaultProvince = philippineCitiesAndProvinces.provinces[0];
      // if (!career?.province) {
      //   setProvince(defaultProvince.name);
      // }
      const cities = philippineCitiesAndProvinces.cities.filter(
        (city) => city.province === defaultProvince.key
      );
      setCityList(cities);
      // if (!career?.location) {
      //   setCity(cities[0].name);
      // }
    };
    parseProvinces();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <CareerInformationCard
          props={{
            jobTitle,
            setJobTitle,
            employmentType,
            setEmploymentType,
            workSetup,
            setWorkSetup,
            country,
            setCountry,
            province,
            setProvince,
            city,
            setCity,
            minimumSalary,
            setMinimumSalary,
            maximumSalary,
            setMaximumSalary,
            provinceList,
            cityList,
            setCityList,
            salaryNegotiable,
            setSalaryNegotiable,
          }}
        />
        <JobDescriptionCard text={description} setText={setDescription} />
        <InterviewQuestionGeneratorV2
          questions={questions}
          setQuestions={(questions) => setQuestions(questions)}
          jobTitle={jobTitle}
          description={description}
        />
      </div>

      {/* FIXME: Right Sidebar */}
      <div
        style={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <TipsCard />

        <div className="layered-card-outer">
          <div className="layered-card-middle">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: "#181D27",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="la la-cog"
                  style={{ color: "#FFFFFF", fontSize: 20 }}
                ></i>
              </div>
              <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>
                Settings
              </span>
            </div>
            <div className="layered-card-content">
              <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <i
                  className="la la-id-badge"
                  style={{ color: "#414651", fontSize: 20 }}
                ></i>
                <span>Screening Setting</span>
              </div>
              <CustomDropdown
                onSelectSetting={(setting) => {
                  setScreeningSetting(setting);
                }}
                screeningSetting={screeningSetting}
                settingList={screeningSettingList}
              />
              <span>
                This settings allows Jia to automatically endorse candidates who
                meet the chosen criteria.
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                  <i
                    className="la la-video"
                    style={{ color: "#414651", fontSize: 20 }}
                  ></i>
                  <span>Require Video Interview</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={requireVideo}
                      onChange={() => setRequireVideo(!requireVideo)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span>{requireVideo ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
