'use client'
import { useState, useEffect } from 'react';

const StudentSubmissions = ({ courseID }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch submissions for the specific course
    if (!courseID) return;
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/submission/single?courseID=${courseID}`);
        const data = await res.json();
        if (data.success) {
          setSubmissions(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      }
    };

    fetchSubmissions();
  }, [courseID]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log('f',file);
    console.log('dffdf',selectedFile);
    if (file) {
      console.log('Selected file:', file); // Log selected file to ensure it's being detected
      setSelectedFile(file);
    } else {
      console.log('No file selected');
    }
  };

  const handleSubmit = async (submissionID) => {
    if (!selectedFile) {
      alert('Please select a file to submit');
      return;
    }
    console.log('selected file', selectedFile)
    setLoading(true);

    const formData = new FormData();
    formData.append('submissionFile', selectedFile);
    formData.append('submissionID', submissionID); // Pass submission ID to relate file to task

    console.log('Submitting file and submission ID:', selectedFile, submissionID); // Log to check file data being sent

    try {
      const res = await fetch(`http://localhost:3000/api/submission/upload`, {
        method: 'POST',
        body: formData, // Send file and related submission
      });

      if (res.ok) {
        alert('File uploaded successfully!');
        setSelectedFile(null); // Reset after upload
      } else {
        const errorMsg = await res.text();
        console.error('File upload failed:', errorMsg);
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>

      {submissions.length === 0 && <p>No submissions available for this course.</p>}

      {submissions.map((submission) => (
        <div key={submission._id} className="p-4 border border-gray-300 rounded mb-4">
          <h3 className="text-lg font-bold">{submission.title}</h3>
          <p>{submission.description}</p>
          <p className="text-sm text-gray-500">Type: {submission.type}</p>
          <p className="text-sm text-gray-500">Due Date: {new Date(submission.dueDate).toLocaleDateString()}</p>

          <input type="file" onChange={(e)=>setSelectedFile(e.target.files?.[0])} className="mt-2" />
          <button
            onClick={() => handleSubmit(submission._id)}
            className="w-full bg-blue-500 text-white p-2 rounded mt-2"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Submit Task'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudentSubmissions;

