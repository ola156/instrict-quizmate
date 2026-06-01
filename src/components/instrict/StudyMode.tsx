import { useState } from "react";
import type { Course, Department, Question } from "@/data/instrict";
import { QuestionCard } from "./QuestionCard";
import { AskInstrictPanel } from "./AskInstrictPanel";

type Props = {
  course: Course;
  department: Department;
  activeQ: Question | null;
  panelOpen: boolean;
  onAskAI: (q: Question) => void;
  onPanelChange: (v: boolean) => void;
};

export function StudyMode({ course, department, activeQ, panelOpen, onAskAI, onPanelChange }: Props) {
  return (
    <div className="space-y-4">
      {course.questions.map((q, i) => (
        <QuestionCard key={q.id} question={q} index={i} department={department} onAskAI={onAskAI} />
      ))}
    </div>
  );
}