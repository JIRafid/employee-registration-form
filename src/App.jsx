import { useEffect, useState } from "react";
import "./App.css";
import Form from "./Components/Form";

function App() {
  const strotedTodos = JSON.parse(localStorage.getItem("formObj"));
  const [error, setError] = useState({});
  const [formObj, setFormObj] = useState(strotedTodos ||{
    fName: "",
    lName: "",
    email: "",
    number: "+880",
    dob: "",
    department: "",
    address: "",
    img: "",
    resume: "",
  });

    useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(formObj))
    
  }, [formObj])

  const inputOnChange = (property, value) => {
    setFormObj((prevObj) => ({
      ...prevObj,
      [property]: value,
    }));
  };

  const formSubmit = (e) => {
    e.preventDefault();
    console.log(formObj);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="h-25 bg-blue-800 text-white text-center rounded-t-lg flex items-center justify-center">
        <div>
          <h1 className="text-3xl font-bold p-3">Employee Registration</h1>
          <p className="text-sm ">Please Fill in All Required Information</p>
        </div>
      </div>
      <form onSubmit={formSubmit} className="p-6 bg-white rounded-b-lg">
        <h2 className="text-blue-800 text-lg font-semibold mb-4">
          Basic Information
        </h2>
        <hr />
        <div className="grid grid-cols-2 gap-4 mt-5">
          <div>
            <label className="block text-sm font-medium ">
              First Name <span className="text-red-700"> *</span>
            </label>
            <input
              onChange={(e) => inputOnChange("fName", e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
              type="text"
              value={formObj.fName}
              pattern="^[a-zA-Z]+(?:[ -'][a-zA-Z]+)*$"
              required

            />
            <label className="block text-sm font-medium  mt-2">
              Email Address <span className="text-red-700"> *</span>
            </label>
            <input
              onChange={(e) => inputOnChange("email", e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
              type="email"
              value={formObj.email}
              required
            />
            <label className="block text-sm font-medium  mt-2">
              Date of Birth <span className="text-red-700"> *</span>
            </label>
            <input
              onChange={(e) => {
                const currentDate = new Date();
                const dob = new Date(e.target.value);
                const age = currentDate.getFullYear() - dob.getFullYear();
                console.log(age)
                if (age < 18) {
                  console.log("Underage");
                  return false;
                } else {
                  inputOnChange("dob", e.target.value);
                }
              }}
              className="mt-1 block w-full border rounded-md p-2"
              type="date"
              value={formObj.dob}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium ">
              Last Name <span className="text-red-700"> *</span>
            </label>
            <input
              onChange={(e) => inputOnChange("lName", e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
              type="text"
              value={formObj.lName}
              pattern="^[a-zA-Z]+(?:[ -'][a-zA-Z]+)*$"
              required
            />
            <label className="block text-sm font-medium  mt-2">
              Phone Number <span className="text-red-700"> *</span>
            </label>
            <input
              onChange={(e) => inputOnChange("number", e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
              type="tel"
              pattern="^\+?(88)?0(19|14|17|13|18|16|15)\d{8}$"
              value={formObj.number}
              required
            />
            <label className="block text-sm font-medium  mt-2">
              Department <span className="text-red-700"> *</span>
            </label>
            <select
              onChange={(e) => inputOnChange("department", e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
              value={formObj.department}
              required
            >
              <option value="">Select Department </option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Communication">Communication</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium ">
            Address <span className="text-red-700"> *</span>
          </label>
          <textarea
            onChange={(e) => inputOnChange("address", e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
            rows="3"
            value={formObj.address}
            pattern="^[a-zA-Z0-9\s,\-.]*$"
            required
          ></textarea>
        </div>
        <div className="p-6 bg-white rounded-b-lg">
          <div className="mt-4">
            <h2 className="text-blue-800 text-lg font-semibold mb-2">
              Profile Image
            </h2>
            <hr />
            <div className="border-2 border-dashed border-gray-300 rounded-md p-12 text-center mt-5">
              <input
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    if (e.target.files[0].size > 2 * 1000 * 1024) {
                      console.log("File with maximum size of 1MB is allowed");
                      return false;
                    } else {
                      inputOnChange("img", e.target.value);
                    }
                  }
                }}
                className="mt-1 block w-full text-sm text-gray-600"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                value={formObj.img}
                // required
              />
              <p className="mt-1 text-xs text-gray-500">
                <span className="text-4xl">📷</span> <br /> Drag & drop profile
                image here <br /> or
                <span className="font-bold">browse files</span> <br />
                JPG, PNG or GIF (max. 2MB)
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-blue-800 text-lg font-semibold mb-2">Resume</h2>
            <hr />
            <div className="border-2 border-dashed border-gray-300 rounded-md p-12 mt-5 text-center">
              <input
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    if (e.target.files[0].size > 5 * 1000 * 1024) {
                      console.log("File with maximum size of 1MB is allowed");
                      return false;
                    } else {
                      inputOnChange("resume", e.target.value);
                    }
                  }
                }}
                className="mt-1 block w-full text-sm text-gray-600"
                type="file"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                value={formObj.resume}
                // required
              />
              <p className="mt-1 text-xs text-gray-500">
                PDF, DOC or DOCX (max. 5MB)
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button className="px-6 py-2 border rounded bg-gray-200">
            Reset Form
          </button>
          <button className="px-6 py-2 border rounded bg-blue-800 text-white">
            Save Button
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
