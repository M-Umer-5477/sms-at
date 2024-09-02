'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const teacherCoursePage = ({ params }) => {
    const [course, setCourse] = useState({});
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || !session.user?.email.includes('@teacher.com')) {
            router.push('/login');
            return;
          }
        async function fetchCourse() {
            try {
                const res = await fetch(`http://localhost:3000/api/createcourse/${params.id}`, { cache: 'no-store' });
                const courseData = await res.json();
                setCourse(courseData.data);
            } catch (error) {
                console.error("Failed to fetch course:", error);
            }
        }

        fetchCourse();
    }, [params.id, status, session, router]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try {
            await fetch(`http://localhost:3000/api/createcourse/${params.id}`, { method: 'DELETE' });
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };


    return (
        <div className="h-screen min-w-full bg-gray-100 sm:px-8 lg:flex flex-col items-center">
            <div className="bg-white shadow-md rounded p-8 mt-1 min-w-full">
                <div className="relative min-w-full h-64 rounded">
                <Image
      src="/course.jpg"
      alt="Course Banner"
      layout="fill"
      objectFit="cover"
      className="rounded-t-lg"
    />
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <h1 className="text-white text-3xl font-bold text-center">{course.CourseName}</h1>
                    </div>
                </div>
                <div className="p-6 sm:p-8">
                    <div className="text-gray-600 text-sm mb-2">Course ID: <span className="font-semibold">{course.CourseID}</span></div>
                    <div className="text-gray-600 text-sm mb-2">Department: <span className="font-semibold">{course.Department}</span></div>
                    <div className="text-gray-600 text-base mb-4">Course Description: <span className="font-semibold">{course.CourseDescription}</span></div>
                    <div className="text-gray-600 text-sm mb-4">Credits: <span className="font-semibold">{course.Credits}</span></div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                        <Link href={`/dashboard/attendance/${course._id}`}>
                            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded transition duration-300">
                                Mark Attendance
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default teacherCoursePage;