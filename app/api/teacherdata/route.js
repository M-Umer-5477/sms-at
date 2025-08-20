import db from '@/lib/db';
import Assignment from '@/models/assignmentmodel';
import Teacher from '@/models/teachermodel';
import Course from '@/models/coursemodel';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    await db.connect();

    try {
        const teacher = await Teacher.findOne({ email });

        if (!teacher) {
            return new Response(JSON.stringify({ error: 'Teacher not found' }), { status: 404 });
        }

        const TeacherID = teacher.TeacherID;
        const courseAssigned = await Assignment.find({ TeacherID });
        const courseIds = courseAssigned.map((assignment) => assignment.CourseID);

        const coursesAssigned = await Course.find({ CourseID: { $in: courseIds } });

        const responseData = {
            teacher,
            coursesAssigned
        };

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
        const { email, FirstName, LastName, PersonalEmail, Password } = await request.json();

        // Validate the input
        if (!email) {
            return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
        }

        // Prepare update fields
        const updateFields = {};

        if (FirstName) updateFields.FirstName = FirstName;
        if (LastName) updateFields.LastName = LastName;
        if (PersonalEmail) updateFields.PersonalEmail = PersonalEmail;

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
        await Teacher.updateOne(
            { email },
            { $set: updateFields }
        );

        return NextResponse.json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: 'An error occurred while updating the profile.' }, { status: 500 });
    }
}
