'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AiOutlineMenu, AiOutlineClose, AiOutlineDown } from "react-icons/ai";
import { signOut, useSession } from 'next-auth/react';
import { MdDashboard, MdCourse, MdPerson, MdSettings } from 'react-icons/md';
import { IoMdLogOut } from 'react-icons/io';

const Navbarr = () => {
    const { data: session, status } = useSession();
    const [navIsVisible, setNavIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(status === 'loading');
    const [dropdownVisible, setDropdownVisible] = useState({
        courses: false,
        admin: false,
    });
    const emailPrefix = session?.user?.email.split('@')[0] || '';

    // Refs for dropdowns
    const dropdownRefs = {
        courses: useRef(null),
        admin: useRef(null),
    };

    useEffect(() => {
        if (status !== 'loading') {
            setIsLoading(false);
        }
    }, [status]);

    useEffect(() => {
        // Handle clicks outside of dropdowns
        const handleClickOutside = (event) => {
            for (const [menu, ref] of Object.entries(dropdownRefs)) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setDropdownVisible((prevState) => ({
                        ...prevState,
                        [menu]: false,
                    }));
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navVisibilityHandler = () => {
        setNavIsVisible((curState) => !curState);
    };

    const toggleDropdown = (menu) => {
        setDropdownVisible((prevState) => ({
            ...prevState,
            [menu]: !prevState[menu],
        }));
    };

    return (
        <header className='container mx-auto px-5 flex justify-between items-center py-4 z-50'>
            <div className="flex-shrink-0">
                <Link href='/' className='text-primary text-xl sm:text-2xl md:text-3xl font-bold hover:bg-gray-950 p-2 rounded-md hover:text-white transition-all duration-300 whitespace-nowrap'>
                    Student Management
                </Link>
            </div>
            <div className="lg:hidden z-50">
                {navIsVisible ? (
                    <AiOutlineClose className="w-6 h-6 cursor-pointer" onClick={navVisibilityHandler} />
                ) : (
                    <AiOutlineMenu className="w-6 h-6 cursor-pointer" onClick={navVisibilityHandler} />
                )}
            </div>

            <nav className={`${navIsVisible ? 'right-0' : '-right-full'} transition-all duration-300 fixed top-0 bottom-0 bg-primary lg:bg-transparent w-full lg:static flex flex-col lg:flex-row justify-center lg:justify-end items-center`}>
                <ul className='gap-y-5 items-center flex gap-x-5 flex-col lg:flex-row font-semibold'>
                    {isLoading ? (
                        <li className='text-orange-300 text-lg sm:text-xl font-bold'>Loading...</li>
                    ) : (
                        <>
                            <li>
                                <Link href='/dashboard' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300 flex items-center'>
                                    <MdDashboard className="mr-2" />
                                    <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Dashboard</span>
                                </Link>
                            </li>
                            {session?.user && (
                                <>
                                    <li className='text-orange-300 text-lg sm:text-xl font-bold'>
                                        Welcome, {emailPrefix}
                                    </li>
                                    {session.user.email.includes('@teacher.com') && (
                                        <li className='relative' ref={dropdownRefs.courses}>
                                            <span onClick={() => toggleDropdown('courses')} className='flex items-center cursor-pointer hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                                <MdCourse className="mr-2" />
                                                <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Courses</span>
                                                <AiOutlineDown className='ml-2' />
                                            </span>
                                            {dropdownVisible.courses && (
                                                <ul className='absolute left-0 mt-2 bg-white shadow-lg rounded-md z-50'>
                                                    <li>
                                                        <Link href='/teachercourses' className='block px-4 py-2 text-gray-700 hover:bg-orange-700 hover:text-white rounded-md'>
                                                            My Courses
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href='/markattendance' className='block px-4 py-2 text-gray-700 hover:bg-orange-700 hover:text-white rounded-md'>
                                                            Mark Attendance
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )}
                                        </li>
                                    )}
                                    {session.user.email.includes('@student.com') && (
                                        <li className='relative' ref={dropdownRefs.courses}>
                                            <span onClick={() => toggleDropdown('courses')} className='flex items-center cursor-pointer hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                                <MdCourse className="mr-2" />
                                                <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Courses</span>
                                                <AiOutlineDown className='ml-2' />
                                            </span>
                                            {dropdownVisible.courses && (
                                                <ul className='absolute left-0 mt-2 bg-white shadow-lg rounded-md z-50'>
                                                    <li>
                                                        <Link href='/mycourses' className='block px-4 py-2 text-gray-700 hover:bg-orange-700 hover:text-white rounded-md'>
                                                            My Courses
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href='/myattendance' className='block px-4 py-2 text-gray-700 hover:bg-orange-700 hover:text-white rounded-md'>
                                                            My Attendance
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )}
                                        </li>
                                    )}
                                    {!session.user.email.includes('@student.com') && !session.user.email.includes('@teacher.com') && (
                                        <li className='relative' ref={dropdownRefs.admin}>
                                            <span onClick={() => toggleDropdown('admin')} className='flex items-center cursor-pointer hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                                <MdSettings className="mr-2" />
                                                <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Admin</span>
                                                <AiOutlineDown className='ml-2' />
                                            </span>
                                            {dropdownVisible.admin && (
                                                <ul className='absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50'>
                                                    <li>
                                                        <Link href='/createcourse' className='block px-4 py-2 text-gray-700 hover:bg-orange-700 hover:text-white rounded-md'>
                                                            Create Course
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href='/addstudent' className='block px-4 py-2 text-gray-700 hover:bg-orange-700 hover:text-white rounded-md'>
                                                            Manage Students
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href='/addteacher' className='block px-4 py-2 text-gray-700 hover:bg-orange-700 hover:text-white rounded-md'>
                                                            Manage Teachers
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href='/weeklytimetable' className='block px-4 py-2 text-gray-700 hover:bg-orange-700 hover:text-white rounded-md'>
                                                            Create TimeTable
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href='/adminrequests' className='block px-4 py-2 text-gray-700 hover:bg-orange-700 hover:text-white rounded-md'>
                                                            Admin Requests
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )}
                                        </li>
                                    )}
                                </>
                            )}
                            {session?.user ? (
                                <li>
                                    <button
                                        onClick={() => signOut()}
                                        className='flex items-center text-orange-300 text-lg sm:text-xl font-bold hover:text-white w-full text-left hover:bg-orange-700 p-2 rounded-md transition-all duration-300'
                                    >
                                        <IoMdLogOut className="mr-2" />
                                        Logout
                                    </button>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <Link href='/login' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Login</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href='/signup' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Register</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbarr;
