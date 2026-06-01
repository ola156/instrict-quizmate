import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, RotateCw, Trophy, Play, Timer } from "lucide-react";
import type { Course, Department, Question } from "@/data/instrict";
import { WhatsAppCTA } from "./WhatsAppCTA";

type Props = {
  course: Course;
  department: Department;
  facultyName: string;
  year: number | "all";
  questions: Question[];
};

const PRESETS = [10, 20, 30];

export function QuizMode({ course, department, facultyName, year, questions }: Props) {
  const quizQuestions = useMemo(
    () => questions.filter((q) => q.options && typeof q.answerIndex === "number"),
    [questions],
  );

  type Phase = "setup" | "running" | "done";
  const [phase, setPhase] = useState<Phase>("setup");
  const [durationMin, setDurationMin] = useState<number>(20);
  const [customMin, setCustomMin] = useState<string>("");

  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>([]);
  const [time, setTime] = useState(0);

  // Reset back to setup whenever the quiz inputs change
  useEffect(() => {
    setPhase("setup");
    setIdx(0);
    setPicks([]);
  }, [course.code, year, quizQuestions.length]);

  useEffect(() => {
    if (phase !== "running") return;
    if (time <= 0) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, phase]);

  if (quizQuestions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No multiple-choice questions configured for {course.code}
          {year !== "all" ? ` (${year})` : ""} yet. Try Study Mode instead.
        </p>
      </div>
    );
  }

  if (phase === "setup") {
    return (
      <div className="rounded-2xl border border-border bg-[var(--gradient-card)] p-6 sm:p-8">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-primary">
          <Timer className="h-3.5 w-3.5" /> Quiz Setup
        </div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">Configure your session</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your selection, pick a duration, then start when you're ready.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Meta label="Faculty" value={facultyName} />
          <Meta label="Department" value={department.name} />
          <Meta label="Course" value={`${course.code}`} sub={course.title} />
          <Meta label="Level" value={`${course.level}L`} />
          <Meta label="Year" value={year === "all" ? "All years" : String(year)} />
          <Meta label="Questions" value={String(quizQuestions.length)} accent />
        </div>

        <div className="mt-7">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Quiz Duration
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setDurationMin(m);
                  setCustomMin("");
                }}
                className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                  durationMin === m && !customMin
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {m} mins
              </button>
            ))}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-1.5">
              <input
                type="number"
                min={1}
                max={180}
                placeholder="Custom"
                value={customMin}
                onChange={(e) => {
                  setCustomMin(e.target.value);
                  const n = parseInt(e.target.value, 10);
                  if (!Number.isNaN(n) && n > 0) setDurationMin(n);
                }}
                className="w-20 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
              <span className="text-xs text-muted-foreground">mins</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => {
            setIdx(0);
            setPicks(quizQuestions.map(() => null));
            setTime(Math.max(1, durationMin) * 60);
            setPhase("running");
          }}
          className="mt-7 w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[var(--instrict-glow)] sm:w-auto"
        >
          <Play /> Start Quiz · {durationMin} min
        </Button>
      </div>
    );
  }

  if (phase === "done") {
    const score = picks.reduce<number>(
      (acc, p, i) => acc + (p !== null && p === quizQuestions[i].answerIndex ? 1 : 0),
      0,
    );
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="rounded-2xl border border-border bg-[var(--gradient-card)] p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[var(--instrict-glow)]">
          <Trophy className="h-6 w-6 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">Quiz Complete</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {course.code} · {course.title}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="Score" value={`${score}/${quizQuestions.length}`} />
          <Stat label="Accuracy" value={`${pct}%`} accent />
          <Stat label="Questions" value={String(quizQuestions.length)} />
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={() => setPhase("setup")}>
            <RotateCw /> New Quiz
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
    } else {
      setPhase("done");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-[var(--gradient-card)] p-6 sm:p-8">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question {idx + 1} of {quizQuestions.length}
        </span>
        <span
          className={`flex items-center gap-1.5 font-mono ${time <= 30 ? "text-destructive" : "text-primary"}`}
        >
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

      <div className="mt-6 flex justify-end">
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

function Meta({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-1 truncate text-sm font-semibold ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{sub}</p>}
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