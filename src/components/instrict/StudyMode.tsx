import type { Question } from "@/data/instrict";
import { QuestionCard } from "./QuestionCard";

type Props = {
  questions: Question[];
  onAskAI: (q: Question) => void;
};

export function StudyMode({ questions, onAskAI }: Props) {
  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <QuestionCard key={q.id} question={q} index={i} onAskAI={onAskAI} />
      ))}
    </div>
  );
}