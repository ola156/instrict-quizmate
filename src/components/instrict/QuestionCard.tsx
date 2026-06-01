import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import type { Question, Department } from "@/data/instrict";
import { WhatsAppCTA } from "./WhatsAppCTA";

type Props = {
  question: Question;
  index: number;
  department: Department;
  onAskAI: (q: Question) => void;
};

export function QuestionCard({ question, index, department, onAskAI }: Props) {
  const [show, setShow] = useState(false);

  return (
    <article className="group rounded-2xl border border-border bg-[var(--gradient-card)] p-6 transition-colors hover:border-primary/30">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/50 text-xs font-semibold text-primary">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Past Question · {question.year}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground sm:text-[15px]">
              {question.prompt}
            </p>
          </div>
        </div>
      </header>

      {question.options && (
        <ul className="mb-4 ml-11 space-y-1.5 text-sm text-muted-foreground">
          {question.options.map((opt, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-xs font-mono text-primary/70">{String.fromCharCode(65 + i)}.</span>
              <span>{opt}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="ml-11 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShow((s) => !s)}
          className="border-border bg-background/40 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
        >
          {show ? <ChevronUp /> : <ChevronDown />}
          {show ? "Hide Solution" : "Show Solution"}
        </Button>
        <Button
          size="sm"
          onClick={() => onAskAI(question)}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[var(--instrict-glow)] hover:opacity-95"
        >
          <Sparkles />
          Ask Instrict AI
        </Button>
      </div>

      {show && (
        <div className="ml-11 mt-4 animate-fade-in">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-primary">Detailed Solution</p>
            {question.options && typeof question.answerIndex === "number" && (
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">Correct answer: </span>
                <span className="font-semibold text-accent">
                  {String.fromCharCode(65 + question.answerIndex)}. {question.options[question.answerIndex]}
                </span>
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{question.solution}</p>
            {question.formula && (
              <div className="mt-3 rounded-lg border border-border bg-background/60 px-3 py-2 font-mono text-xs text-accent">
                {question.formula}
              </div>
            )}
          </div>
          <WhatsAppCTA departmentName={department.name} url={department.whatsappUrl} />
        </div>
      )}
    </article>
  );
}