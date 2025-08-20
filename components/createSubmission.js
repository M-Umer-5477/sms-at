'use client'
import { useState } from 'react';

const CreateSubmission = ({CourseID , TeacherID}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Assignment');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(''); // Clear previous errors
    
    const submissionData = {
      title,
      description,
      type,
      dueDate
    };

    try {
      const res = await fetch('http://localhost:3000/api/submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({submissionData , CourseID,TeacherID})
      });

      if (res.ok) {
        // Success handling
        alert('Submission created successfully!');
        setTitle('');
        setDescription('');
        setType('Assignment');
        setDueDate('');
      } else {
        const data = await res.json();
        setError(data.message || 'Error creating submission');
      }
    } catch (error) {
      setError('Error creating submission');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Create Submission</h2>
      
      {error && (
        <div className="text-red-500 mb-2">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="Assignment">Assignment</option>
          <option value="Quiz">Quiz</option>
          <option value="Presentation">Presentation</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
        disabled={loading} // Disable while loading
      >
        {loading ? 'Creating...' : 'Create Submission'}
      </button>
    </form>
  );
};

export default CreateSubmission;
