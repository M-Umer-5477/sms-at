import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Submission from '@/models/submissionmodel';
export async function GET(request) {
await db.connect();
try {
    const { searchParams } = new URL(request.url);
    const courseID = searchParams.get('courseID');
    console.log('id coming',courseID)
    if (!courseID) {
        return NextResponse.json({ success: false, message: 'Course ID is required' }, { status: 400 });
    }
    const submissions=await Submission.find({CourseID: courseID})
    console.log("subs found successfully",submissions);
    return NextResponse.json({ success: true, data: submissions }, { status: 200 });
} catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
}}