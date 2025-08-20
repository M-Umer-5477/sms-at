import db from '@/lib/db';
import { NextResponse } from 'next/server';
import Enrollment from '@/models/enrollmentmodel';
import Student from '@/models/studentmodel';
import Course from '@/models/coursemodel';
import bcrypt from 'bcrypt';


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    await db.connect();

    try {
        const student = await Student.findOne({ email });

        if (!student) {
            return new Response(JSON.stringify({ error: 'Student not found' }), { status: 404 });
        }

        const StudentID = student.StudentID;
        const courseEnrolled = await Enrollment.find({ StudentID });
        const courseIds = courseEnrolled.map((enrollment) => enrollment.CourseID);

        const coursesEnrolled = await Course.find({ CourseID: { $in: courseIds } });
        console.log(coursesEnrolled);

        const responseData = {
            student,
            coursesEnrolled
        };
        console.log(responseData);

        return new Response(JSON.stringify(responseData), { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    } finally {
        await db.disconnect();
    }
}


export async function PUT(request) {
    try {
        await db.connect();
        const { email, FirstName, LastName, PersonalEmail, ContactInfo, Address, Password } = await request.json();

        // Validate the input
        if (!email) {
            return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
        }

        // Prepare update fields
        const updateFields = {};

        if (FirstName) updateFields.FirstName = FirstName;
        if (LastName) updateFields.LastName = LastName;
        if (PersonalEmail) updateFields.PersonalEmail = PersonalEmail;
        if (ContactInfo) updateFields.ContactInfo = ContactInfo;
        if (Address) updateFields.Address = Address;

        if (Password) {
            if (!Password) {
                return NextResponse.json({ message: 'Password is required.' }, { status: 400 });
            }
            // Handle password update
            if (Password) {
                const hashedPassword = await bcrypt.hash(Password, 10);
                updateFields.password = hashedPassword;
            }
        }

        // Update user profile
        await Student.updateOne(
            { email },
            { $set: updateFields }
        );

        return NextResponse.json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: 'An error occurred while updating the profile.' }, { status: 500 });
    }
}