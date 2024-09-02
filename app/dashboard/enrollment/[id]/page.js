/*

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const AddEnrollment = ({ params }) => {
    const router = useRouter();
    const { data: session , status } = useSession();

    const [students, setStudents] = useState([]);
    const [course, setCourse] = useState(null);
    const [ID, setID] = useState(null);
    const [enrollment, setEnrollment] = useState({
        EnrollmentID: '',
        StudentID: '',
        CourseID: '',
        EnrollmentDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCourse = useCallback(async (courseId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/createcourse/${courseId}`);
            if (!response.ok) throw new Error('Failed to fetch course');
            const data = await response.json();
            return data.data;
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, []);

    const fetchStudents = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/addstudent');
            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            return data.data;
        } catch (err) {
            setError(err.message);
            return [];
        }
    }, []);

    useEffect(() => {
        const initialize = async () => {
            if (status === 'loading') return;
            if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
                router.push("/login");
                return;
            }

            try {
                const [fetchedCourse, fetchedStudents] = await Promise.all([
                    fetchCourse(params.id),
                    fetchStudents()
                ]);

                if (fetchedCourse) {
                    setCourse(fetchedCourse);
                    setID(fetchedCourse.CourseID);
                    setEnrollment((prev) => ({ ...prev, CourseID: fetchedCourse.CourseID }));
                }
                setStudents(fetchedStudents);
            } catch (err) {
                setError('Failed to load data');
            }
        };

        initialize();
    }, [params.id, fetchCourse, fetchStudents, session, status, router]);
    useEffect(() => {
        fetchEnrolledStudents(ID);
    }, []);
    const fetchEnrolledStudents = async (courseID) => {
        try {
            const res = await fetch(`http://localhost:3000/api/enrollment?courseId=${courseID}`);
            const data = await res.json();
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch enrolled students:', error);
            setError('Failed to fetch enrolled students.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEnrollment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/enrollment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollment),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Enrollment created successfully');// Optional: Redirect to a success page
            } else {
                setError(result.error || 'Failed to create enrollment');
            }
        } catch (err) {
            setError('Failed to create enrollment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-gray-900">Add Enrollment</h1>
                    {course && (
                        <p className="text-center text-lg text-gray-600 mb-6">
                            Course: {course.CourseName} (ID: {course.CourseID})
                        </p>
                    )}
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="EnrollmentID" className="block text-gray-700 text-sm font-bold mb-2">
                                Enrollment ID
                            </label>
                            <input
                                type="text"
                                name="EnrollmentID"
                                placeholder="Enrollment ID"
                                value={enrollment.EnrollmentID}
                                onChange={handleChange}
                                required
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label htmlFor="StudentID" className="block text-gray-700 text-sm font-bold mb-2">
                                Student ID
                            </label>
                            <select
                                name="StudentID"
                                value={enrollment.StudentID}
                                onChange={handleChange}
                                required
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select Student</option>
                                {students.map((student) => (
                                    <option key={student.StudentID} value={student.StudentID}>
                                        {student.FirstName} {student.LastName} ({student.StudentID})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="EnrollmentDate" className="block text-gray-700 text-sm font-bold mb-2">
                                Enrollment Date
                            </label>
                            <input
                                type="date"
                                name="EnrollmentDate"
                                value={enrollment.EnrollmentDate}
                                onChange={handleChange}
                                required
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            disabled={loading}
                        >
                            {loading ? 'Adding Enrollment...' : 'Add Enrollment'}
                        </button>
                        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEnrollment;*/
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const AddEnrollment = ({ params }) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [students, setStudents] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState({
        EnrollmentID: '',
        StudentID: '',
        CourseID: '',
        EnrollmentDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formVisible, setFormVisible] = useState(false); // State to control form visibility

    // Fetch course data
    const fetchCourse = useCallback(async (courseId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/createcourse/${courseId}`);
            if (!response.ok) throw new Error('Failed to fetch course');
            const data = await response.json();
            return data.data;
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, []);

    // Fetch students data
    const fetchStudents = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/addstudent');
            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            return data.data;
        } catch (err) {
            setError(err.message);
            return [];
        }
    }, []);

    // Fetch enrolled students data
    const fetchEnrolledStudents = useCallback(async (courseID) => {
        try {
            const response = await fetch(`http://localhost:3000/api/enrollment?courseId=${courseID}`);
            if (!response.ok) throw new Error('Failed to fetch enrolled students');
            const data = await response.json();
            setEnrolledStudents(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch enrolled students.');
        }
    }, []);

    // Initialize the component
    useEffect(() => {
        const initialize = async () => {
            if (status === 'loading') return;
            if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
                router.push("/login");
                return;
            }

            try {
                const [fetchedCourse, fetchedStudents] = await Promise.all([
                    fetchCourse(params.id),
                    fetchStudents()
                ]);

                if (fetchedCourse) {
                    setCourse(fetchedCourse);
                    setEnrollment(prev => ({ ...prev, CourseID: fetchedCourse.CourseID }));
                    await fetchEnrolledStudents(fetchedCourse.CourseID);
                }
                setStudents(fetchedStudents);
            } catch (err) {
                setError('Failed to load initial data');
            }
        };

        initialize();
    }, [params.id, fetchCourse, fetchStudents, fetchEnrolledStudents, session, status, router]);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEnrollment(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/enrollment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollment),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Enrollment created successfully');
                setEnrollment({ EnrollmentID: '', StudentID: '', CourseID: '', EnrollmentDate: '' });  // Reset the form fields
                await fetchEnrolledStudents(enrollment.CourseID);  // Refresh the enrolled students list
                setFormVisible(false); // Hide the form after successful submission
            } else {
                setError(result.error || 'Failed to create enrollment');
            }
        } catch (err) {
            setError('Failed to create enrollment');
        } finally {
            setLoading(false);
        }
    };

    // Handle deletion of enrollment
    const handleDelete = async (studentId) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:3000/api/enrollment?studentId=${studentId}&courseId=${course.CourseID}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (response.ok) {
                alert('Enrollment deleted successfully');
                setEnrolledStudents(prev => prev.filter(student => student.StudentID !== studentId));
            } else {
                setError(result.error || 'Failed to delete enrollment');
            }
        } catch (err) {
            setError('Failed to delete enrollment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-gray-900">Add Enrollment</h1>
                    {course && (
                        <p className="text-center text-lg text-gray-600 mb-6">
                            Course: {course.CourseName} (ID: {course.CourseID})
                        </p>
                    )}
                    {/* Button to show/hide the form */}
                    <div className="text-center">
                        <button
                            onClick={() => setFormVisible(prev => !prev)}
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {formVisible ? 'Hide Enrollment Form' : 'Add Enrollment'}
                        </button>
                    </div>
                </div>

                {/* Conditional rendering of the form */}
                {formVisible && (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="EnrollmentID" className="block text-gray-700 text-sm font-bold mb-2">
                                    Enrollment ID
                                </label>
                                <input
                                    type="text"
                                    name="EnrollmentID"
                                    placeholder="Enrollment ID"
                                    value={enrollment.EnrollmentID}
                                    onChange={handleChange}
                                    required
                                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label htmlFor="StudentID" className="block text-gray-700 text-sm font-bold mb-2">
                                    Student ID
                                </label>
                                <select
                                    name="StudentID"
                                    value={enrollment.StudentID}
                                    onChange={handleChange}
                                    required
                                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Select Student</option>
                                    {students.map((student) => (
                                        <option key={student.StudentID} value={student.StudentID}>
                                            {student.FirstName} {student.LastName} ({student.StudentID})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="EnrollmentDate" className="block text-gray-700 text-sm font-bold mb-2">
                                    Enrollment Date
                                </label>
                                <input
                                    type="date"
                                    name="EnrollmentDate"
                                    value={enrollment.EnrollmentDate}
                                    onChange={handleChange}
                                    required
                                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                disabled={loading}
                            >
                                {loading ? 'Adding Enrollment...' : 'Add Enrollment'}
                            </button>
                            {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
                        </div>
                    </form>
                )}

                {/* Enrolled Students List */}
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Enrolled Students</h2>
                    {enrolledStudents.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {enrolledStudents.map((student) => (
                                    <tr key={student.StudentID}>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.StudentID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.FirstName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.LastName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.PersonalEmail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.ContactInfo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(student.StudentID)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500">No students enrolled in this course.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddEnrollment;
