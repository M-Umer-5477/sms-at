
'use client';
import Image from 'next/image';
import React, { useState } from 'react';

const ProfileCard = ({ user , isStudent}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        ID: user.StudentID || user.TeacherID,
        FirstName: user.FirstName,
        LastName: user.LastName,
        PersonalEmail: user.PersonalEmail,
        ContactInfo: user.ContactInfo,
        Address: user.Address,
        Department: user.Department,
        Password: '',
        ConfirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            // Determine which fields have changed
            const updatedFields = {};
    
            if (formData.FirstName !== user.FirstName) updatedFields.FirstName = formData.FirstName;
            if (formData.LastName !== user.LastName) updatedFields.LastName = formData.LastName;
            if (formData.PersonalEmail !== user.PersonalEmail) updatedFields.PersonalEmail = formData.PersonalEmail;
            if (formData.ContactInfo !== user.ContactInfo) updatedFields.ContactInfo = formData.ContactInfo;
            if (formData.Address !== user.Address) updatedFields.Address = formData.Address;
            
            // Only include password fields if they are not empty
            if (formData.Password && formData.Password === formData.ConfirmPassword) {
                updatedFields.Password = formData.Password;
            } else if (formData.Password || formData.ConfirmPassword) {
                alert('Passwords do not match.');
                return;
            }
    
            if (Object.keys(updatedFields).length === 0) {
                alert('No changes made.');
                return;
            }
    
            const apiUrl = isStudent 
                ? `http://localhost:3000/api/studentdata?email=${user.email}` 
                : `http://localhost:3000/api/teacherdata?email=${user.email}`;
    
            const response = await fetch(apiUrl, {
                method: 'PUT', // Use 'PUT' for updating existing profiles
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email, // Use user email from session
                    ...updatedFields,
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('Failed to update profile.');
        } finally {
            setIsModalOpen(false);
        }
    };
    
    

    return (
        <div className="relative bg-white shadow-lg rounded-lg p-4 max-w-xs mx-auto">
            
            <div className="flex items-center space-x-4">
                <Image
                    src={user.profilePicture || ''}
                    alt="Profile Picture"
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                />
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{`${user.FirstName} ${user.LastName}`}</h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            </div>

            
            <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
            >
                Edit Profile
            </button>

            
            {isModalOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 relative">
                        <h3 className="text-xl font-semibold mb-4">Update Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                              <label className="text-gray-700">ID</label>
                                <input
                                    type="text"
                                    name="ID"
                                    value={formData.ID}
                                    setEditable={false}
                                    disabled
                                    className="mt-1 w-full px-3 py-2 border rounded-md text-gray-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="FirstName"
                                    value={formData.FirstName}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="LastName"
                                    value={formData.LastName}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700">Personal Email</label>
                                <input
                                    type="email"
                                    name="PersonalEmail"
                                    value={formData.PersonalEmail}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                           {isStudent && (
                            <>
                            <div className="flex flex-col">
                              <label className="text-gray-700">Contact Info</label>
                                <input
                                    type="text"
                                    name="ContactInfo"
                                    value={formData.ContactInfo}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="Address"
                                    value={formData.Address}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            </> ) }
                            {!isStudent && (
                            <>
                            <div className="flex flex-col">
                              <label className="text-gray-700">Department</label>
                                <input
                                    type="text"
                                    name="ContactInfo"
                                    value={formData.Department}
                                    setEditable={false}
                                    disabled
                                    className="mt-1 w-full px-3 py-2 border rounded-md text-gray-500"
                                />
                            </div>
                            
                            </> ) }

                            <div className="flex flex-col">
                                <label className="text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    name="Password"
                                    value={formData.Password}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    name="ConfirmPassword"
                                    value={formData.ConfirmPassword}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
