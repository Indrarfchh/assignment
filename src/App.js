import React, { useState } from 'react';
import { TiPencil } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdCancelPresentation } from 'react-icons/md';
import { AiOutlineHome } from "react-icons/ai";

const defaultFields = [
  { name: 'Employee ID', type: 'text', required: true, min: 1, max: 20, pattern: /^[^\s][a-zA-Z0-9]*$/ },
  { name: 'Employee Name', type: 'text', required: true, min: 1, max: 20, pattern: /^[^\s][a-zA-Z\s]*$/ },
  { name: 'Employee Designation', type: 'text', required: true, min: 1, max: 20, pattern: /^[^\s][a-zA-Z0-9\-/\s]*$/ },
  { name: 'Project Code', type: 'text', required: true, min: 1, max: 20, pattern: /^[^\s][a-zA-Z0-9]*$/ },
  { name: 'Start Date', type: 'date', required: true },
  { name: 'End Date', type: 'date', required: true },
  { name: 'Shift Start Time', type: 'time', required: true }, 
  { name: 'Shift End Time', type: 'time', required: true }, 
  { name: 'Description', type: 'textarea', required: true, min: 1, max: 100, pattern: /^[^\s].*$/ },
];

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelloPopupOpen, setIsHelloPopupOpen] = useState(false);
  const [fields, setFields] = useState([]);
  const [rows, setRows] = useState([]);
  const [tempFormData, setTempFormData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [errors, setErrors] = useState({});

  const handleModalToggle = () => setIsOpen(prev => !prev);

  const handleHelloPopupToggle = () => {
    setIsHelloPopupOpen(prev => !prev);
    if (isHelloPopupOpen) {
      setTempFormData(new Array(fields.length).fill(''));
      setEditIndex(null);
      setErrors({});
    }
  };

  const handleFieldChange = (value, index) => {
    const trimmedValue = value.replace(/^\s+/, '');
    
    const newTempFormData = [...tempFormData];
    newTempFormData[index] = trimmedValue;
    setTempFormData(newTempFormData);
  };

  const validateFields = () => {
    const newErrors = {};
    fields.forEach((field, index) => {
      const value = tempFormData[index];
      if (field.required && (!value || value.length < field.min || value.length > field.max)) {
        newErrors[field.name] = `min ${field.min} and max ${field.max} characters.`;
      }
  
      if (field.pattern && !field.pattern.test(value)) {
        newErrors[field.name] = `${field.name} is in an invalid format.`;
      }
      
      if (field.name === 'End Date' && newErrors['Start Date'] === undefined) {
        const startDate = new Date(tempFormData[fields.findIndex(f => f.name === 'Start Date')]);
        const endDate = new Date(value);
        if (startDate >= endDate) {
          newErrors['End Date'] = 'End Date must be after Start Date.';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRowSave = () => {
    if (validateFields()) {
      if (editIndex !== null) {
        setRows(prev => prev.map((row, index) => index === editIndex ? { ...row, ...tempFormData.reduce((acc, val, i) => ({ ...acc, [fields[i].name]: val }), {}) } : row));
      } else {
        const newRow = tempFormData.reduce((acc, val, i) => ({ ...acc, [fields[i].name]: val }), {});
        setRows(prev => [...prev, newRow]);
      }
      setTempFormData(new Array(fields.length).fill(''));
      handleHelloPopupToggle();
    }
  };

  const handleRowDelete = (rowIndex) => {
    setRows(prev => prev.filter((_, index) => index !== rowIndex));
  };

  const handleFieldSelect = (field) => {
    const isSelected = selectedFields.find(f => f.name === field.name);
    const newSelectedFields = isSelected
      ? selectedFields.filter(f => f.name !== field.name)
      : [...selectedFields, field];

    setSelectedFields(newSelectedFields);
  };

  const handleSaveSelectedFields = () => {
    const newFields = defaultFields.filter(field =>
      selectedFields.find(selected => selected.name === field.name)
    );

    setFields(newFields);
    handleModalToggle();
  };

  const handleModalOpen = () => {
    setSelectedFields(fields);
    handleModalToggle();
  };

  const preventInput = (e) => {
    if (e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  return (
    <div className="p-6">
      <div className='border border-black p-2 rounded mb-4 flex items-center'>
        <AiOutlineHome /><span className='pl-1'>Home</span>
      </div>
      <div className="mb-4 flex justify-end">
        <button onClick={handleModalOpen} className="text-black bg-gray-300 font-semibold py-2 px-4 rounded border border-black">
          Add Field
        </button>
        <button className="text-black bg-gray-300 font-semibold py-2 px-4 mx-2 rounded border border-black">
          Export to Excel
        </button>
      </div>
      <div className='my-4 font'>Project Name : HRMS</div>
      <table className="table-auto border-collapse border border-black w-full">
        <thead>
          <tr>
            <th colSpan={fields.length + 1} className="border border-black p-2 text-right">
              <button className="bg-green-600 text-white py-1 px-4 rounded" onClick={handleHelloPopupToggle}>
                Add
              </button>
            </th>
          </tr>
          <tr className="bg-gray-200">
            {fields.map((field, index) => (
              <th key={index} className="border border-black p-2 text-center">
                {field.name}
              </th>
            ))}
            {fields.length > 0 && <th className="border border-black p-2 text-center">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {fields.map((field) => (
                <td key={field.name} className="border border-black p-2 text-center">
                  {row[field.name] || ''}
                </td>
              ))}
              {fields.length > 0 && (
                <td className="border border-black p-2 text-center">
                  <span onClick={() => { 
                      setTempFormData(fields.map(field => row[field.name] || '')); 
                      setEditIndex(rowIndex); 
                      handleHelloPopupToggle(); 
                  }} className="inline-block mr-2 cursor-pointer">
                    <TiPencil />
                  </span>
                  <span onClick={() => handleRowDelete(rowIndex)} className="inline-block mr-2 cursor-pointer">
                    <RiDeleteBin6Line />
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-2">
            <div className='bg-orange-500 flex justify-between px-4 py-2 rounded-lg border border-black mb-4'>
              <h2 className="text-lg font-semibold text-center">Select Fields</h2>
              <button onClick={handleModalToggle} className="text-xl font-bold text-black">
                <MdCancelPresentation />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {defaultFields.map((field, index) => (
                <button 
                  key={index} 
                  onClick={() => handleFieldSelect(field)} 
                  className={`py-2 px-4 rounded ${selectedFields.find(f => f.name === field.name) ? 'bg-orange-500 text-white' : 'bg-gray-300 text-black'}`}
                >
                  {field.name}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handleSaveSelectedFields} className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-md mr-2">
                Save
              </button>
              <button onClick={handleModalToggle} className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-md">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isHelloPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-2">
            <div className='bg-orange-500 flex justify-between px-4 py-2 rounded-lg border border-black mb-4'>
              <h2 className="text-lg font-semibold text-center">{editIndex !== null ? 'Edit' : 'Add Fields'}</h2>
              <button onClick={handleHelloPopupToggle} className="text-xl font-bold text-black">
                <MdCancelPresentation />
              </button>
            </div>
            <form className="grid grid-cols-4 gap-4">
            {fields.map((field, index) => (
              <div key={index} className="col-span-1">
                <label className="block text-black font-medium">{field.name}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={tempFormData[index] || ''}
                    onChange={e => handleFieldChange(e.target.value, index)}
                    className={`mt-1 p-2 block border border-black rounded-md h-32 ${errors[field.name] ? 'border-red-500' : ''}`}
                  />
                ) : field.type === 'date' || field.type === 'time' ? ( 
                  <input
                    type={field.type}
                    value={tempFormData[index] || ''}
                    onKeyDown={preventInput}
                    onChange={e => handleFieldChange(e.target.value, index)}
                    className={`mt-1 p-2 block w-full border border-black rounded-md ${errors[field.name] ? 'border-red-500' : ''}`}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={tempFormData[index] || ''}
                    onChange={e => handleFieldChange(e.target.value, index)}
                    className={`mt-1 p-2 block w-full border border-black rounded-md ${errors[field.name] ? 'border-red-500' : ''}`}
                  />
                )}
                {errors[field.name] && <span className="text-red-500 text-sm">{errors[field.name]}</span>}
              </div>
            ))}
            </form>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={handleRowSave} className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-md">
                Save
              </button>
              <button type="button" onClick={handleHelloPopupToggle} className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-md">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
