import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Clock, RotateCw, Trophy } from "lucide-react";
import type { Course, Department, Question } from "@/data/instrict";
import { WhatsAppCTA } from "./WhatsAppCTA";

type Props = {
  course: Course;
  department: Department;
  onAskAI: (q: Question) => void;
};

const PER_Q_SECONDS = 45;

export function QuizMode({ course, department, onAskAI }: Props) {
  const quizQuestions = useMemo(
    () => course.questions.filter((q) => q.options && typeof q.answerIndex === "number"),
    [course],
  );

  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() => quizQuestions.map(() => null));
  const [time, setTime] = useState(PER_Q_SECONDS);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setIdx(0);
    setPicks(quizQuestions.map(() => null));
    setTime(PER_Q_SECONDS);
    setDone(false);
  }, [course.code, quizQuestions]);

  useEffect(() => {
    if (done) return;
    if (time <= 0) {
      if (idx < quizQuestions.length - 1) {
        setIdx((i) => i + 1);
        setTime(PER_Q_SECONDS);
      } else {
        setDone(true);
      }
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, done, idx, quizQuestions.length]);

  if (quizQuestions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No multiple-choice questions configured for {course.code} yet. Try Study Mode instead.
        </p>
      </div>
    );
  }

  const score = picks.reduce(
    (acc, p, i) => acc + (p !== null && p === quizQuestions[i].answerIndex ? 1 : 0),
    0,
  );

  if (done) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="rounded-2xl border border-border bg-[var(--gradient-card)] p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[var(--instrict-glow)]">
          <Trophy className="h-6 w-6 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">Quiz Complete</h3>
        <p className="mt-1 text-sm text-muted-foreground">{course.code} · {course.title}</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="Score" value={`${score}/${quizQuestions.length}`} />
          <Stat label="Accuracy" value={`${pct}%`} accent />
          <Stat label="Questions" value={String(quizQuestions.length)} />
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIdx(0);
              setPicks(quizQuestions.map(() => null));
              setTime(PER_Q_SECONDS);
              setDone(false);
            }}
          >
            <RotateCw /> Retake Quiz
          </Button>
        </div>

        <div className="mt-6 text-left">
          <WhatsAppCTA departmentName={department.name} url={department.whatsappUrl} />
        </div>
      </div>
    );
  }

  const q = quizQuestions[idx];
  const picked = picks[idx];

  const choose = (i: number) => {
    const next = [...picks];
    next[idx] = i;
    setPicks(next);
  };

  const advance = () => {
    if (idx < quizQuestions.length - 1) {
      setIdx((i) => i + 1);
      setTime(PER_Q_SECONDS);
    } else {
      setDone(true);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-[var(--gradient-card)] p-6 sm:p-8">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Question {idx + 1} of {quizQuestions.length}</span>
        <span className={`flex items-center gap-1.5 font-mono ${time <= 10 ? "text-destructive" : "text-primary"}`}>
          <Clock className="h-3.5 w-3.5" />
          {String(Math.floor(time / 60)).padStart(2, "0")}:{String(time % 60).padStart(2, "0")}
        </span>
      </div>
      <Progress value={((idx + 1) / quizQuestions.length) * 100} className="mt-2 h-1" />

      <h3 className="mt-6 text-lg font-medium leading-relaxed text-foreground">{q.prompt}</h3>

      <div className="mt-5 space-y-2">
        {q.options!.map((opt, i) => {
          const selected = picked === i;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition-colors ${
                selected
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border bg-background/40 text-muted-foreground hover:border-primary/30 hover:bg-background/60 hover:text-foreground"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                  selected ? "bg-primary text-primary-foreground" : "bg-background/60 text-muted-foreground"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => onAskAI(q)} className="text-muted-foreground hover:text-primary">
          <Sparkles /> Ask Instrict AI
        </Button>
        <Button
          onClick={advance}
          disabled={picked === null}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
        >
          {idx === quizQuestions.length - 1 ? "Submit Quiz" : "Next Question"}
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${accent ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}