import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Submission from '@/models/submissionmodel';

export async function POST(req) {
    await db.connect();
    
    try {
        const body =await req.json();
          const { submissionData :
             { title, description, type, dueDate}
             ,TeacherID, CourseID } = body;
      console.log('data coming',body);
      // Check if required fields are provided
      if (!title || !description || !type || !dueDate || !TeacherID || !CourseID) {
        return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
      }
  
      const newSubmission = await Submission.create({
        title,
        description,
        type,
        dueDate,
        TeacherID,
        CourseID,
      });
  
      return NextResponse.json({ success: true, data: newSubmission }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
  }
  
export async function GET() {
  await db.connect();

  try {
    const submissions = await Submission.find({}).populate('TeacherID CourseID');
    return NextResponse.json({ success: true, data: submissions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
