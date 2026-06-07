import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  RotateCw,
  Trophy,
  Play,
  Timer,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import type { Course,  Faculty, Question } from "@/data/instrict";
import { WhatsAppCTA } from "./WhatsAppCTA";

type Props = {
  course: Course;
  faculty: Faculty;
  facultyName: string;
  year: number | "all";
  questions: Question[];
};

const PRESETS = [10, 20, 30];

export function QuizMode({
  course,
  faculty,
  facultyName,
  year,
  questions,
}: Props) {
  const quizQuestions = useMemo(
    () =>
      questions.filter(
        (q) => q.options && q.options.length > 0 && typeof q.answer === "string"
      ),
    [questions]
  );

  const theoryCount = questions.length - quizQuestions.length;

  type Phase = "setup" | "running" | "done";
  const [phase, setPhase] = useState<Phase>("setup");
  const [durationMin, setDurationMin] = useState<number>(20);
  const [customMin, setCustomMin] = useState<string>("");

  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<(string | null)[]>([]);
  const [time, setTime] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);

  // Markdown utility for math support
  const Markdown = ({ content }: { content: string }) => (
    <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:m-0">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );

  useEffect(() => {
    setPhase("setup");
    setIdx(0);
    setPicks([]);
    setIsReviewing(false);
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
          {year !== "all" ? ` (${year})` : ""} yet. Try switching to Study Mode
          to read the theory materials.
        </p>
      </div>
    );
  }

  // --- PHASE 1: CONFIGURATION SETUP LAYER ---
  if (phase === "setup") {
    return (
      <div className="rounded-2xl border border-border bg-[var(--gradient-card)] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
          <Timer className="h-3.5 w-3.5" /> CBT Quiz Setup Engine
        </div>
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">
            Configure Your Examination
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Simulate realistic timed testing environments. Answers will be sealed
            until you submit.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Meta label="Faculty" value={facultyName} />
          <Meta label="Department" value={'Instrict'} />
          <Meta label="Course Code" value={course.code} sub={course.title} />
          <Meta label="Class Level" value={`${course.level}L`} />
          <Meta
            label="Current set"
            value={year === "all" ? "All Archives" : `Set ${year} `}
          />
          <Meta
            label="OBJ Pools"
            value={`${quizQuestions.length} Questions`}
            accent
          />
        </div>

        {theoryCount > 0 && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-amber-500/90">
            <strong>Notice:</strong> We omitted {theoryCount} essay/theory
            question profiles from this session. You can review written questions
            inside Study Mode.
          </div>
        )}

        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Select Test Duration Limit
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setDurationMin(m);
                  setCustomMin("");
                }}
                className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
                  durationMin === m && !customMin
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {m} Minutes
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
                className="w-16 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground font-medium"
              />
              <span className="text-xs text-muted-foreground font-medium">
                mins
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => {
            setIdx(0);
            setPicks(quizQuestions.map(() => null));
            setTime(Math.max(1, durationMin) * 60);
            setPhase("running");
            setIsReviewing(false);
          }}
          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[var(--instrict-glow)] sm:w-auto font-semibold"
        >
          <Play className="h-4 w-4 mr-1.5" /> Initialize Exam · {durationMin} Mins
        </Button>
      </div>
    );
  }

  // --- PHASE 2: SCOREBOARD POST-EXAM SUMMARY & REVIEW ENGINE ---
  if (phase === "done") {
    const score = picks.reduce<number>(
      (acc, p, i) =>
        acc + (p !== null && p === quizQuestions[i].answer ? 1 : 0),
      0
    );
    const pct = Math.round((score / quizQuestions.length) * 100);

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-[var(--gradient-card)] p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[var(--instrict-glow)]">
            <Trophy className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              Performance Scorecard
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {course.code} — {course.title}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
            <Stat
              label="Total Score"
              value={`${score} / ${quizQuestions.length}`}
            />
            <Stat label="Accuracy Rate" value={`${pct}%`} accent />
            <Stat
              label="Time Taken"
              value={`${Math.max(
                0,
                durationMin - Math.ceil(time / 60)
              )} mins`}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button
              variant={isReviewing ? "secondary" : "default"}
              onClick={() => {
                setIdx(0);
                setIsReviewing(true);
              }}
              className="text-xs font-semibold"
            >
              Review Corrections
            </Button>
            <Button
              variant="outline"
              onClick={() => setPhase("setup")}
              className="text-xs font-semibold"
            >
              <RotateCw className="h-3.5 w-3.5 mr-1.5" /> Re-take New Quiz
            </Button>
          </div>

          <div className="mt-6 text-left max-w-2xl mx-auto border-t border-border/60 pt-6">
            <WhatsAppCTA
              departmentName={faculty.name}
              url={faculty.whatsappUrl}
            />
          </div>
        </div>

        {isReviewing && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
              Correction Breakdown Grid
            </h4>
            {quizQuestions.map((question, qIdx) => {
              const studentPick = picks[qIdx];
              const isCorrect = studentPick === question.answer;

              return (
                <div
                  key={question.id}
                  className={`rounded-xl border p-5 bg-card space-y-3 ${
                    isCorrect ? "border-emerald-500/30" : "border-destructive/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                          isCorrect
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {qIdx + 1}
                      </span>
                      <div className="text-sm font-medium text-foreground leading-relaxed pt-0.5">
                        <Markdown content={question.prompt} />
                      </div>
                    </div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                        <XCircle className="h-3 w-3" /> Failed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8 text-xs">
                    <div className="p-2 rounded-lg bg-background border border-border">
                      <span className="text-muted-foreground block font-medium">
                        Your Selection:
                      </span>
                      <div
                        className={
                          studentPick !== null
                            ? "font-semibold"
                            : "font-semibold text-muted-foreground italic"
                        }
                      >
                        {studentPick !== null ? (
                          <Markdown content={studentPick} />
                        ) : (
                          "No choice logged"
                        )}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                      <span className="text-emerald-500 block font-medium">
                        Official Solution Key:
                      </span>
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                        <Markdown content={question.answer!} />
                      </div>
                    </div>
                  </div>

                  <div className="pl-8 pt-1 text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground font-semibold block mb-0.5">
                      Solution Logic:
                    </strong>
                    <Markdown
                      content={question.solution || "No explanation provided."}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- PHASE 3: ACTIVE LIVE CBT RUNTIME ENGINE ---
  const currentQuestion = quizQuestions[idx];
  const activeSelection = picks[idx];

  const makeChoice = (opt: string) => {
    const freshPicks = [...picks];
    freshPicks[idx] = opt;
    setPicks(freshPicks);
  };

  const unansweredCount = picks.filter((p) => p === null).length;

  return (
    <div className="rounded-2xl border border-border bg-[var(--gradient-card)] p-5 sm:p-8 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Question <strong className="text-foreground font-bold">{idx + 1}</strong> of {quizQuestions.length}
          </span>
          <span
            className={`flex items-center gap-1.5 font-mono font-bold px-2.5 py-1 rounded-md border ${
              time <= 60
                ? "text-destructive border-destructive/20 bg-destructive/5 animate-pulse"
                : "text-primary border-primary/10 bg-primary/5"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            {String(Math.floor(time / 60)).padStart(2, "0")}:
            {String(time % 60).padStart(2, "0")}
          </span>
        </div>
        <Progress
          value={((idx + 1) / quizQuestions.length) * 100}
          className="h-1.5 bg-border/40"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 border-y border-border/60 py-3">
        {quizQuestions.map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => setIdx(dotIdx)}
            className={`h-7 w-7 rounded-md text-xs font-mono font-bold flex items-center justify-center border transition-all ${
              dotIdx === idx
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : picks[dotIdx] !== null
                ? "border-primary/40 bg-primary/5 text-primary"
                : "border-border bg-background/40 text-muted-foreground hover:border-neutral-400"
            }`}
          >
            {dotIdx + 1}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="text-base font-semibold leading-relaxed text-foreground sm:text-lg">
          <Markdown content={currentQuestion.prompt} />
        </div>

        <div className="space-y-2.5">
          {currentQuestion.options!.map((opt, i) => {
            const isSelected = activeSelection === opt;
            return (
              <button
                key={i}
                type="button"
                onClick={() => makeChoice(opt)}
                className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition-all group ${
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-sm"
                    : "border-border bg-background/40 text-muted-foreground hover:border-primary/30 hover:bg-background/80 hover:text-foreground"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-mono font-bold transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border group-hover:border-primary/40 text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-medium pt-0.5">
                  <Markdown content={opt} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <Button
          variant="secondary"
          size="sm"
          disabled={idx === 0}
          onClick={() => setIdx((prev) => prev - 1)}
          className="text-xs font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Previous
        </Button>

        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="text-xs font-semibold bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Submit Exam
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border border-border bg-[var(--gradient-card)] shadow-xl rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold tracking-tight">
                  Finish Examination?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-muted-foreground">
                  {unansweredCount > 0 ? (
                    <span>
                      You still have{" "}
                      <strong className="text-destructive font-semibold">
                        {unansweredCount} unanswered
                      </strong>{" "}
                      questions left. Are you sure you want to grade your paper
                      now?
                    </span>
                  ) : (
                    "All choices have been locked. Are you ready to submit your exam to the portal for final scoring?"
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
                <AlertDialogCancel className="text-xs border-border bg-background/50">
                  Review Work
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => setPhase("done")}
                  className="text-xs font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  Grade Submissions
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {idx < quizQuestions.length - 1 ? (
            <Button
              size="sm"
              onClick={() => setIdx((prev) => prev + 1)}
              className="text-xs font-semibold bg-primary text-primary-foreground"
            >
              Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10"
                >
                  Finish & Grade
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border border-border shadow-xl rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold tracking-tight">
                    Confirm Submission
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-muted-foreground">
                    You have reached the end of the question pool. Click submit to
                    calculate your final grade or cancel to check over your
                    responses.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
                  <AlertDialogCancel className="text-xs border-border bg-background/50">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => setPhase("done")}
                    className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Submit Now
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3 flex flex-col justify-center min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-0.5 truncate text-xs font-semibold ${
          accent ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground leading-tight">
          {sub}
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-3 sm:p-4 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 text-base sm:text-xl font-bold tracking-tight ${
          accent ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}