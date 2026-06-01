import type { Course, Department, Question } from "@/data/instrict";
import { QuestionCard } from "./QuestionCard";

type Props = {
  course: Course;
  department: Department;
  onAskAI: (q: Question) => void;
};

export function StudyMode({ course, department, onAskAI }: Props) {
  return (
    <div className="space-y-4">
      {course.questions.map((q, i) => (
        <QuestionCard key={q.id} question={q} index={i} department={department} onAskAI={onAskAI} />
      ))}
    </div>
  );
}