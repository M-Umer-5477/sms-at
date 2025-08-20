import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Assignment', 'Quiz', 'Presentation'], required: true },
  dueDate: { type: Date, required: true },
  TeacherID: { type: String, required: true },
  CourseID: { type: String, ref: 'Course', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
