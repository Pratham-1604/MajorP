import React, { useState } from 'react';
import './InputForm.css';

function InputForm() {
  const [formData, setFormData] = useState({
    name: '',
    semester: '',
    subjects: Array(5).fill({ name: '', grade: '' }),
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name.startsWith('subject')) {
      const newSubjects = [...formData.subjects];
      newSubjects[index] = {
        ...newSubjects[index],
        [name]: value,
      };
      setFormData({ ...formData, subjects: newSubjects });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>Grades Submission Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Semester:</label>
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            />
          </div>

          <h3>Subject Details:</h3>
          {formData.subjects.map((subject, index) => (
            <div className="input-group" key={index}>
              <label>Subject {index + 1} Name:</label>
              <input
                type="text"
                name={`subject${index + 1}Name`}
                value={subject.name}
                onChange={(e) => handleChange(e, index)}
                required
              />
              <label>Grade:</label>
              <input
                type="text"
                name={`subject${index + 1}Grade`}
                value={subject.grade}
                onChange={(e) => handleChange(e, index)}
                required
              />
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default InputForm;
