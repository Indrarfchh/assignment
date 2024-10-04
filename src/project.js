import React, { useState } from "react";
import { TiPencil } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaLessThan } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function Project() {
  const initialData = {
    ProjectName: "",
    Projectcode: "",
    ProjectManagerId: "",
    ProjectManagerName: "",
    ProjectDescription: "",
    Billability:"",
    Client: "",
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const nameRegex = /^[a-zA-Z][a-zA-Z\s]*$/ // Only letters and spaces
  const codeRegex = /^(?!0)[a-zA-Z][a-zA-Z0-9\-\/]*$/;// Letters, numbers, and - /

  // const navigate = useNavigate();

  // const handleButtonClick = () => {
  //   navigate('/App');
  // };
  const handleClosePopup = () => {
    setShowPopup(false);
    setEditIndex(null);
    setFormData({ ...initialData });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    let formErrors = {};
    
    // Validate Project Name
    if (!formData.ProjectName) {
      formErrors.ProjectName = "Project Name is required";
    } else if (formData.ProjectName.length < 1) {
      formErrors.ProjectName = "Min 1 Characters";
    } else if (formData.ProjectName.length > 20) {
      formErrors.ProjectName = "Max 20 Characters";
    } else if (!codeRegex.test(formData.ProjectName)) {
      formErrors.ProjectName = "start with a letter and can only include letters and spaces";
    }

    // Validate Project Code
    if (!formData.Projectcode) {
      formErrors.Projectcode = "Project Code is required";
    } else if (formData.Projectcode.length < 1) {
      formErrors.Projectcode = "Min 1 Characters";
    } else if (formData.Projectcode.length > 20) {
      formErrors.Projectcode = "Max 20 Characters";
    } else if (!codeRegex.test(formData.Projectcode)) {
      formErrors.Projectcode = "Enter (letters, numbers, - or /) and it cannot start with 0";
    }

    // Validate Project Manager Id
    if (!formData.ProjectManagerId) {
      formErrors.ProjectManagerId = "Project Manager ID is required";
    } else if (formData.ProjectManagerId.length < 1) {
      formErrors.ProjectManagerId = "Min 1 Characters";
    } else if (formData.ProjectManagerId.length > 20) {
      formErrors.ProjectManagerId = "Max 20 Characters";
    } else if (!codeRegex.test(formData.ProjectManagerId)) {
      formErrors.ProjectManagerId = "Enter  (letters, numbers, - or /) and it cannot start with 0";
    }

    // Validate Project Manager Name
    if (!formData.ProjectManagerName) {
      formErrors.ProjectManagerName = "Project Manager Name is required";
    } else if (formData.ProjectManagerName.length < 1) {
      formErrors.ProjectManagerName = "Min 1 Characters";
    } else if (formData.ProjectManagerName.length > 20) {
      formErrors.ProjectManagerName = "Max 20 Characters";
    } else if (!nameRegex.test(formData.ProjectManagerName)) {
      formErrors.ProjectManagerName = "Name can only contain letters and spaces";
    }

    // Validate Client
    if (!formData.Client) {
      formErrors.Client = "Client is required";
    } else if (formData.Client.length < 1) {
      formErrors.Client = "Min 1 Characters";
    } else if (formData.Client.length > 20) {
      formErrors.Client = "Max 20 Characters";
    } else if (!nameRegex.test(formData.Client)) {
      formErrors.Client = "Client can only contain letters and spaces";
    }

    // Validate Project Description
    if (!formData.ProjectDescription) {
      formErrors.ProjectDescription = "Project Description is required";
    } else if (formData.ProjectDescription.length < 1) {
      formErrors.ProjectDescription = "Min 1 Characters";
    } else if (formData.ProjectDescription.length > 500) {
      formErrors.ProjectDescription = "Max 500 Characters";
    } else if (!codeRegex.test(formData.ProjectDescription)) {
      formErrors.ProjectDescription = "Enter valid Project Code (letters, numbers, - or /) and it cannot start with 0";
    }



    if (formData.Billability === "") {
      formErrors.Billability = "Choose any one";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (editIndex !== null) {
      const updatedData = [...tableData];
      updatedData[editIndex] = formData;
      setTableData(updatedData);
    } else {
      setTableData([...tableData, formData]);
    }

    handleClosePopup();
  };

  const handleOpenPopup = (index = null) => {
    if (index !== null) {
      setFormData({ ...tableData[index] });
      setEditIndex(index);
    } else {
      setFormData({ ...initialData });
      setEditIndex(null);
    }
    setShowPopup(true);
  };

  const handleAddRow = () => {
    handleOpenPopup();
  };

  const handleDelete = (index) => {
    const updatedData = tableData.filter((_, i) => i !== index);
    setTableData(updatedData);
  };

  return (

      


    <div>
      <div className="mr-10 ml-6">
        <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
          <FaLessThan className="text-orange-500 mr-2" />
          <button>
            <span className="text font-semibold text-orange-500">Previous Page</span>
          </button>
        </div>
        <div className='border border-black p-2 rounded mb-4 flex items-center'>
        <AiOutlineHome /><span className='pl-1'>Home</span>
      </div>
      </div>
      
      <div className="pt-5 mt-5 ml-3 md:ml-20 lg:ml-40 mx-auto mr-3 md:mr-20 lg:mr-40">
        <div className="overflow-x-auto">
          <div className="flex justify-end mb-2">
            
            <button
              className="p-2 cursor-pointer border border-black  text-black rounded-md"
              onClick={handleAddRow}
            >
              Add New project
            </button>
            <button
              className=" ml-2 p-2 cursor-pointer border border-black  text-black  rounded-md"
            >
              Export to Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[440px]">
              <thead>
                <tr>
                  <th className="py-2 px-1 border-b-black border-2 border-solid border-black text-center">Project Name</th>
                  <th className="py-2 px-1 border-b-black border-2 border-solid border-black text-center">Project Code</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Project Manager Id</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Project Manager Name</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Project Description</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Billability</th>


                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center" style={{ width: '80px' }}>Client</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Actions</th>
                  <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Project View</th>
                </tr>
              </thead>
              <tbody className="border border-black border-collapse overflow-y-auto max-h-60">
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-y-auto">{row.ProjectName}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-y-auto">{row.Projectcode}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-y-auto">{row.ProjectManagerId}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-y-auto">{row.ProjectManagerName}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-y-auto">{row.ProjectDescription}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-y-auto">{row.Billability}</td>

                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-y-auto">{row.Client}</td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-y-auto">
                      <div className="flex flex-row">
                        <TiPencil className="mr-2 cursor-pointer text-black-500 text-xs sm:text-sm" onClick={() => handleOpenPopup(index)} />
                        <RiDeleteBin6Line className="cursor-pointer text-black-500 text-xs sm:text-sm" onClick={() => handleDelete(index)} />
                      </div>
                    </td>
                    <td className="py-2 px-2 border-b border-gray-900 border-r text-center">
                      <button className="inline-block cursor-pointer mr-2 py-1 px-4 bg-green-600 text-white rounded-md" 
                      // onClick={handleButtonClick}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-200 p-2 sm:p-4 rounded-lg shadow-lg w-[95%] max-w-[350px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 bg-orange-500 p-2 rounded-t-md">
                <h2 className="text-lg text-white font-semibold">
                  {editIndex !== null ? "Edit Project Details" : "Add New Project"}
                </h2>
                <MdCancelPresentation className="text-xl cursor-pointer text-white" onClick={handleClosePopup} />
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1">Project Name:</label>
                    <input
                      type="text"
                      name="ProjectName"
                      value={formData.ProjectName}
                      onChange={(e) => setFormData({ ...formData, ProjectName: e.target.value })}
                      className="p-1 border border-gray-300 rounded-lg"
                    />
                    {errors.ProjectName && <p className="text-red-500">{errors.ProjectName}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1">Project Code:</label>
                    <input
                      type="text"
                      name="Projectcode"
                      value={formData.Projectcode}
                      onChange={(e) => setFormData({ ...formData, Projectcode: e.target.value })}
                      className="p-1 border border-gray-300 rounded-lg"
                    />
                    {errors.Projectcode && <p className="text-red-500">{errors.Projectcode}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1">Project Manager Id:</label>
                    <input
                      type="text"
                      name="ProjectManagerId"
                      value={formData.ProjectManagerId}
                      onChange={(e) => setFormData({ ...formData, ProjectManagerId: e.target.value })}
                      className="p-1 border border-gray-300 rounded-lg"
                    />
                    {errors.ProjectManagerId && <p className="text-red-500">{errors.ProjectManagerId}</p>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1">Project Manager Name:</label>
                    <input
                      type="text"
                      name="ProjectManagerName"
                      value={formData.ProjectManagerName}
                      onChange={(e) => setFormData({ ...formData, ProjectManagerName: e.target.value })}
                      className="p-1 border border-gray-300 rounded-lg"
                    />
                    {errors.ProjectManagerName && <p className="text-red-500">{errors.ProjectManagerName}</p>}
                  </div>


                  <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Billability:</label>
                      <select
                        className="p-1 border border-gray-300 rounded-lg"
                        name="Billability"
                        value={formData.Billability}
                        
                        onChange={(e) => setFormData({ ...formData, Billability: e.target.value })}
                        >
                        <option value="" disabled hidden>Select any one</option> 
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {errors.Billability && <p className="text-red-500">{errors.Billability}</p>}
                    </div>
                     






                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1">Client:</label>
                    <input
                      type="text"
                      name="Client"
                      value={formData.Client}
                      onChange={(e) => setFormData({ ...formData, Client: e.target.value })}
                      className="p-1 border border-gray-300 rounded-lg"
                    />
                    {errors.Client && <p className="text-red-500">{errors.Client}</p>}
                  </div>

                  <div className="flex flex-col md:col-span-3">
                    <label className="text-gray-700 mb-1">Project Description:</label>
                    <textarea
                      name="ProjectDescription"
                      value={formData.ProjectDescription}
                      onChange={(e) => setFormData({ ...formData, ProjectDescription: e.target.value })}
                      className="p-1 border border-gray-300 rounded-lg overflow-auto resize-none"
                    />
                    {errors.ProjectDescription && <p className="text-red-500">{errors.ProjectDescription}</p>}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button type="submit" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-3 mb-2">
                    Save
                  </button>
                  <button type="button" onClick={handleClosePopup} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mb-2">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Project;
