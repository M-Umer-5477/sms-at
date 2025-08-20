import { useEffect, useState } from 'react';

const TeacherSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(data);
    };

    fetchSubmissions();
  }, []);

  const handleMarkSubmission = (submissionId) => {
    // Redirect to the marking page or open a modal to mark the submission
    // You can pass submissionId to the marking logic
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Created Submissions</h2>
      <ul className="space-y-4">
        {submissions.map((submission) => (
          <li key={submission._id} className="border p-4 rounded">
            <h3 className="font-semibold text-lg">{submission.title}</h3>
            <p>{submission.description}</p>
            <p>
              Type: <strong>{submission.type}</strong>
            </p>
            <p>
              Due Date: <strong>{new Date(submission.dueDate).toLocaleDateString()}</strong>
            </p>
            <button
              className="bg-green-500 text-white p-2 rounded mt-2"
              onClick={() => handleMarkSubmission(submission._id)}
            >
              Mark Submission
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherSubmissions;
