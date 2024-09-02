import db from '@/lib/db';
import Student from '@/models/studentmodel';
export async function DELETE(request) {
    await db.connect();
    try {
        const { searchParams } = new URL(request.url);
        const StudentID = searchParams.get('ID');
        await Student.deleteOne({StudentID: StudentID});
        console.log("Student deleted successfully");
        return new Response(JSON.stringify({ message: 'Student deleted successfully' }), { status: 201 });
    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}