import { useEffect, useState } from "react";

const initialData = {
  fName: "",
  lName: "",
  email: "",
  number: "+880",
  dob: "",
  department: "",
  address: "",
  img: "",
  resume: "",
};

function App() {
  const storedFormObj = JSON.parse(localStorage.getItem("formObj"));
  const [formData, setFormData] = useState(storedFormObj || initialData);
  const [errors, setErrors] = useState({});

  const validators = {
    fName: (value) =>
      !value
        ? "First name is required"
        : !/^[a-zA-Z]+(?:[ -'][a-zA-Z]+)*$/.test(value)
        ? "Invalid first name"
        : "",
    lName: (value) =>
      !value
        ? "Last name is required"
        : !/^[a-zA-Z]+(?:[ -'][a-zA-Z]+)*$/.test(value)
        ? "Invalid last name"
        : "",
    email: (value) =>
      !value
        ? "Email is required"
        : !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value)
        ? "Invalid email address"
        : "",
    number: (value) =>
      !value
        ? "Phone number is required"
        : !/^\+?(88)?0(19|14|17|13|18|16|15)\d{8}$/.test(value)
        ? "Invalid phone number"
        : "",
    dob: (value) => {
      if (!value) return "Date of birth is required";
      const currentDate = new Date();
      const dob = new Date(value);
      const age = currentDate.getFullYear() - dob.getFullYear();
      return age < 18 ? "Underage" : "";
    },
    department: (value) => (!value ? "Department is required" : ""),
    address: (value) =>
      !value
        ? "Address is required"
        : value.length > 100
        ? "Address is too long"
        : !/^[a-zA-Z0-9\s,\-.]*$/.test(value)
        ? "Invalid Address"
        : "",
    img: (value) => (!value ? "Profile image is required" : ""),
    resume: (value) => (!value ? "Resume is required" : ""),
  };

  useEffect(() => {
    localStorage.setItem("formObj", JSON.stringify(formData));
  }, [formData]);

  const inputOnChange = (property, value) => {
    setFormData((prev) => ({
      ...prev,
      [property]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [property]: "",
    }));
  };

  const handleBlur = (property) => {
    const error = validators[property](formData[property]);
    setErrors((prev) => ({
      ...prev,
      [property]: error,
    }));
  };

  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  const allowedResumeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validateAndReadFile = (property, file) => {
    if (
      (property === "img" && !allowedImageTypes.includes(file.type)) ||
      (property === "resume" && !allowedResumeTypes.includes(file.type))
    ) {
      setErrors((prev) => ({
        ...prev,
        [property]:
          property === "img"
            ? "Invalid image type. Allowed: jpg, png, gif."
            : "Invalid resume type. Allowed: pdf, doc, docx.",
      }));
      inputOnChange(property, "");
      return;
    }

    if (
      (property === "img" && file.size > 2 * 1024 * 1024) ||
      (property === "resume" && file.size > 5 * 1024 * 1024)
    ) {
      setErrors((prev) => ({
        ...prev,
        [property]:
          property === "img"
            ? "Profile image must be less than 2MB"
            : "Resume must be less than 5MB",
      }));
      inputOnChange(property, "");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      inputOnChange(property, base64String);
    };
    reader.onerror = () => {
      inputOnChange(property, "");
    };
  };

  const handleFileChange = (property, event) => {
    const file = event.target.files[0];
    if (!file) {
      inputOnChange(property, "");
      return;
    }
    validateAndReadFile(property, file);
  };

  const handleFileDrop = (property, event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) {
      inputOnChange(property, "");
      return;
    }
    validateAndReadFile(property, file);
  };

  const removeFiles = (property) => {
    setFormData((prev) => ({
      ...prev,
      [property]: "",
    }));
    setErrors((prev) => ({
      ...prev,
      [property]: validators[property](""),
    }));
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validators[key](formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log(formData);
      alert("Form submitted successfully!");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="h-25 bg-blue-800 text-white text-center rounded-t-lg flex items-center justify-center">
        <div>
          <h1 className="text-3xl font-bold p-3">Employee Registration</h1>
          <p className="text-sm ">Please Fill in All Required Information</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-b-lg">
        <h2 className="text-blue-800 text-lg font-semibold mb-4">
          Basic Information
        </h2>
        <hr />
        <div className="grid grid-cols-2 gap-4 mt-5">
          <div>
            <label className="block text-sm font-medium">
              First Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              onChange={(e) => inputOnChange("fName", e.target.value)}
              onBlur={() => handleBlur("fName")}
              type="text"
              value={formData.fName}
              className={`mt-1 block w-full border rounded-md p-2 ${
                errors.fName ? "border-red-500" : ""
              }`}
              placeholder="Enter first name"
            />
            {errors.fName && (
              <span className="text-red-500 text-sm">{errors.fName}</span>
            )}
            <label className="block text-sm font-medium mt-4">
              Email Address <span style={{ color: "red" }}>*</span>
            </label>
            <input
              onChange={(e) => inputOnChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              type="email"
              value={formData.email}
              className={`mt-1 block w-full border rounded-md p-2 ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="Enter email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
            <label className="block text-sm font-medium mt-4">
              Date of Birth <span style={{ color: "red" }}>*</span>
            </label>
            <input
              onChange={(e) => inputOnChange("dob", e.target.value)}
              onBlur={() => handleBlur("dob")}
              type="date"
              value={formData.dob}
              className={`mt-1 block w-full border rounded-md p-2 ${
                errors.dob ? "border-red-500" : ""
              }`}
            />
            {errors.dob && (
              <span className="text-red-500 text-sm">{errors.dob}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              Last Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              onChange={(e) => inputOnChange("lName", e.target.value)}
              onBlur={() => handleBlur("lName")}
              type="text"
              value={formData.lName}
              className={`mt-1 block w-full border rounded-md p-2 ${
                errors.lName ? "border-red-500" : ""
              }`}
              placeholder="Enter last name"
            />
            {errors.lName && (
              <span className="text-red-500 text-sm">{errors.lName}</span>
            )}
            <label className="block text-sm font-medium mt-4">
              Phone Number <span style={{ color: "red" }}>*</span>
            </label>
            <input
              onChange={(e) => inputOnChange("number", e.target.value)}
              onBlur={() => handleBlur("number")}
              type="tel"
              value={formData.number}
              className={`mt-1 block w-full border rounded-md p-2 ${
                errors.number ? "border-red-500" : ""
              }`}
              placeholder="+8801234567890"
            />
            {errors.number && (
              <span className="text-red-500 text-sm">{errors.number}</span>
            )}
            <label className="block text-sm font-medium mt-4">
              Department <span style={{ color: "red" }}>*</span>
            </label>
            <select
              onChange={(e) => inputOnChange("department", e.target.value)}
              onBlur={() => handleBlur("department")}
              value={formData.department}
              className={`mt-1 block w-full border rounded-md p-2 ${
                errors.department ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Communication">Communication</option>
            </select>
            {errors.department && (
              <span className="text-red-500 text-sm">{errors.department}</span>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium">
            Address <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            onChange={(e) => inputOnChange("address", e.target.value)}
            onBlur={() => handleBlur("address")}
            value={formData.address}
            rows={3}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.address ? "border-red-500" : ""
            }`}
            placeholder="Enter your address"
          />
          {errors.address && (
            <span className="text-red-500 text-sm">{errors.address}</span>
          )}
        </div>

        {/* Profile Image Dropzone */}
        <div className="mt-6">
          <h2 className="text-blue-800 text-lg font-semibold mb-2">
            Profile Image <span style={{ color: "red" }}>*</span>
          </h2>
          <hr />
          <div
            className={`border-2 border-dashed rounded-md p-12 text-center mt-5 ${
              errors.img ? "border-red-500 border" : "border-gray-300"
            }`}
            onDrop={(e) => handleFileDrop("img", e)}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className={`mt-1 block w-full text-sm text-gray-600 ${
                errors.img ? "border border-red-500 rounded" : ""
              }`}
              onChange={(e) => handleFileChange("img", e)}
            />
            {errors.img && (
              <span className="text-red-500 text-sm">{errors.img}</span>
            )}
            {formData.img && (
              <div className="mt-2">
                <img
                  className="h-[200px] w-[200px] border rounded-lg mx-auto"
                  src={formData.img}
                  alt="Preview"
                />
                <button
                  type="button"
                  onClick={() => removeFiles("img")}
                  className="ml-2 text-red-500"
                >
                  ❌
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Resume Dropzone */}
        <div className="mt-6">
          <h2 className="text-blue-800 text-lg font-semibold mb-2">
            Resume <span style={{ color: "red" }}>*</span>
          </h2>
          <hr />
          <div
            className={`border-2 border-dashed rounded-md p-12 text-center mt-5 ${
              errors.resume ? "border-red-500 border" : "border-gray-300"
            }`}
            onDrop={(e) => handleFileDrop("resume", e)}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className={`mt-1 block w-full text-sm text-gray-600 ${
                errors.resume ? "border border-red-500 rounded" : ""
              }`}
              onChange={(e) => handleFileChange("resume", e)}
            />
            {errors.resume && (
              <span className="text-red-500 text-sm">{errors.resume}</span>
            )}
            {formData.resume && (
              <div className="mt-2">
                <iframe
                  className="h-[200px] w-[200px] border rounded-lg mx-auto"
                  src={formData.resume}
                  title="Resume Preview"
                />
                <button
                  type="button"
                  onClick={() => removeFiles("resume")}
                  className="ml-2 text-red-500"
                >
                  ❌
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 border rounded bg-gray-200"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="px-6 py-2 border rounded bg-blue-800 text-white"
          >
            Save Button
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
