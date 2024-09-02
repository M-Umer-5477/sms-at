import db from '@/lib/db';
import Enrollment from '@/models/enrollmentmodel';
import Student from '@/models/studentmodel';

export async function POST(req) {
    await db.connect();

    try {
        const { EnrollmentID, StudentID, CourseID, EnrollmentDate } = await req.json();
        const student = await Student.findOne({ StudentID });
        if (!student) {
            console.log("student not found");
            return new Response(JSON.stringify({ error: 'student not found' }), { status: 404 });
        }
        // Check if the student is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({ StudentID, CourseID });
        if (existingEnrollment) {
            return new Response(JSON.stringify({ success: false, error: 'Student is already enrolled in this course' }), { status: 400 });
        }

        const newEnrollment = new Enrollment({
            EnrollmentID,
            StudentID,
            CourseID,
            EnrollmentDate
        });

        await newEnrollment.save();
        student.Courses.push(CourseID);
        await student.save();
        return new Response(JSON.stringify({ success: true, data: newEnrollment }), { status: 201 });
    } catch (error) {
        console.error('Error creating enrollment:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
    } finally {
        await db.disconnect();
    }
}
export async function GET(req) {
    await db.connect();
    const { searchParams } = new URL(req.url);
const courseId = parseInt(searchParams.get('courseId')); // Corrected variable name

console.log(courseId); 
   

    try {
        const enrolledStudents = await Enrollment.find({ CourseID: courseId });
   const studentIds = enrolledStudents.map(enrollment => enrollment.StudentID);
        const students = await Student.find({ StudentID: { $in: studentIds } });
console.log('sendind enrolled ' ,students);
        return new Response(JSON.stringify(students), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}
 export async function DELETE(request) {
    await db.connect();
    try {
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');
        const courseId = searchParams.get('courseId');

        if (!studentId || !courseId) {
            return NextResponse.json({ error: 'StudentID and CourseID are required' }, { status: 400 });
        }
        const result = await Enrollment.deleteOne({
            StudentID: studentId,
            CourseID: courseId
        });


        return NextResponse.json({ message: 'Enrollment deleted successfully' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to delete enrollment' }, { status: 500 });
    }
 
}
