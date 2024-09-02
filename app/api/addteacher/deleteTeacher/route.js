import db from '@/lib/db';
import Teacher from '@/models/teachermodel';
export async function DELETE(request) {
    await db.connect();
    try {
        const { searchParams } = new URL(request.url);
        const TeacherID = searchParams.get('ID');
        await Teacher.deleteOne({TeacherID: TeacherID});
        console.log("Teacher deleted successfully");
        return new Response(JSON.stringify({ message: 'Teacher deleted successfully' }), { status: 201 });
    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}