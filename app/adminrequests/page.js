/*'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; 

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const { data: session, status } = useSession(); 

    useEffect(() => {
        const fetchCurrentRole = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/signup/fetchRole?email=${session.user.email}`);
                const data = await res.json();
                setCurrentRole(data.role); // Assuming data contains a field 'role'
            } catch (error) {
                console.error('Failed to fetch role', error);
                setError('Failed to fetch role.');
            }
        };
        if (status === 'loading') return;   
        if (session?.user) {
            fetchCurrentRole();
        }
    }, [session, status ]);

    const fetchCurrentRole = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/signup/fetchRole?email=${session.user.email}`);
            const data = await res.json();
            setCurrentRole(data.role); // Assuming data contains a field 'role'
        } catch (error) {
            console.error('Failed to fetch role', error);
            setError('Failed to fetch role.');
        }
    };

    useEffect(() => {
        if (currentRole === 'SuperAdmin') {
            fetchRequests();
        }
    }, [currentRole]);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/adminrequest`);
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
            setError('Failed to fetch requests.');
        }
    };

    const handleApprove = async (email) => {
        try {
            await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            setRequests((prevRequests) => prevRequests.filter(request => request.email !== email));
        } catch (error) {
            console.error('Failed to approve admin', error);
            alert('Failed to approve admin.');
        }
    };

    const handleDelete = async (email) => {
        try {
            await fetch(`http://localhost:3000/api/adminrequest/deletereq?email=${email}`, {
                method: 'DELETE',
            });
            setRequests((prevRequests) => prevRequests.filter(request => request.email !== email));
        } catch (error) {
            console.error('Failed to delete request', error);
            alert('Failed to delete request.');
        }
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return <div>You need to be authenticated to view this page.</div>;
    }

    if (currentRole !== 'SuperAdmin') {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Requests</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="bg-white shadow-md rounded-lg p-6">
                <ul className="space-y-4">
                    {requests.map((request) => (
                        <li key={request.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow">
                            <span className="text-gray-700">{request.email}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleApprove(request.email)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleDelete(request.email)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminRequests;
*/
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; 

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // New state for loading buttons
    const [currentRole, setCurrentRole] = useState('');
    const { data: session, status } = useSession(); 

    useEffect(() => {
        const fetchCurrentRole = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/signup/fetchRole?email=${session.user.email}`);
                const data = await res.json();
                setCurrentRole(data.role); 
            } catch (error) {
                console.error('Failed to fetch role', error);
                setError('Failed to fetch role.');
            }
        };
        if (status === 'loading') return;   
        if (session?.user) {
            fetchCurrentRole();
        }
    }, [session, status ]);

    useEffect(() => {
        if (currentRole === 'Super Admin') {
            fetchRequests();
            fetchAdmins();
        }
    }, [currentRole]);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/adminrequest`);
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
            setError('Failed to fetch requests.');
        }
    };

    const fetchAdmins = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/signup`);
            const data = await res.json();
            setAdmins(data);
        } catch (error) {
            console.error('Failed to fetch admins', error);
            setError('Failed to fetch admins.');
        }
    };

    const handleApprove = async (email) => {
        try {
            setLoading(true);
            await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            setRequests((prevRequests) => prevRequests.filter(request => request.email !== email));
            fetchAdmins();
        } catch (error) {
            console.error('Failed to approve admin', error);
            alert('Failed to approve admin.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = async (email) => {
        try {
            setLoading(true);
            await fetch(`http://localhost:3000/api/adminrequest/deletereq?email=${email}`, {
                method: 'DELETE',
            });
            setRequests((prevRequests) => prevRequests.filter(request => request.email !== email));
        } catch (error) {
            console.error('Failed to delete request', error);
            alert('Failed to delete request.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (email, newRole) => {
        try {
            setLoading(true);
            await fetch(`http://localhost:3000/api/signup?email=${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole, email })
            });
            fetchAdmins();
        } catch (error) {
            console.error('Failed to change role', error);
            alert('Failed to change role.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAdmin = async (email) => {
        try {
            setLoading(true);
            await fetch(`http://localhost:3000/api/signup?email=${email}`, {
                method: 'DELETE',
            });
            setAdmins((prevAdmins) => prevAdmins.filter(admin => admin.email !== email));
        } catch (error) {
            console.error('Failed to delete admin', error);
            alert('Failed to delete admin.');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return <div>You need to be authenticated to view this page.</div>;
    }

    if (currentRole !== 'Super Admin') {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Requests</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            {/* Pending Requests Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
                <ul className="space-y-4">
                    {requests.map((request) => (
                        <li key={request.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow">
                            <span className="text-gray-700">{request.email}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleApprove(request.email)}
                                    className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleDeleteRequest(request.email)}
                                    className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Existing Admins Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Existing Admins</h2>
                <ul className="space-y-4">
                    {admins.map((admin) => (
                        <li key={admin.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow">
                            <span className="text-gray-700">{admin.email} - {admin.Role}</span>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleRoleChange(admin.email, admin.Role === 'Admin' ? 'Super Admin' : 'Admin')}
                                    className={`px-4 py-2 rounded ${admin.Role === 'Admin' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-yellow-500 text-white hover:bg-yellow-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {admin.Role === 'Admin' ? 'Promote to Super Admin' : 'Demote to Admin'}
                                </button>
                                <button
                                    onClick={() => handleDeleteAdmin(admin.email)}
                                    className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminRequests;
