import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, GraduationCap, BookOpen, Target } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FACULTIES, DEFAULT_FACULTY_ID, type Question } from "@/data/instrict";
import { StudyMode } from "@/components/instrict/StudyMode";
import { QuizMode } from "@/components/instrict/QuizMode";
import { AskInstrictPanel } from "@/components/instrict/AskInstrictPanel";
import { WhatsAppCTA } from "@/components/instrict/WhatsAppCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Instrict — Past Questions & AI-Powered Quiz Bank" },
      { name: "description", content: "Practice past questions, take timed quizzes, and ask the Instrict AI tutor — no signup required." },
      { property: "og:title", content: "Instrict — Past Questions & AI-Powered Quiz Bank" },
      { property: "og:description", content: "Practice past questions, take timed quizzes, and ask the Instrict AI tutor — no signup required." },
    ],
  }),
  component: Index,
});

function Index() {
  const [facultyId, setFacultyId] = useState<string>(DEFAULT_FACULTY_ID);
  const faculty = useMemo(() => FACULTIES.find((f) => f.id === facultyId)!, [facultyId]);

  const [deptId, setDeptId] = useState<string>(faculty.departments[0].id);
  const department = useMemo(
    () => faculty.departments.find((d) => d.id === deptId) ?? faculty.departments[0],
    [faculty, deptId],
  );

  const [level, setLevel] = useState<number>(department.courses[0]?.level ?? 100);
  const coursesForLevel = useMemo(
    () => department.courses.filter((c) => c.level === level),
    [department, level],
  );
  const [courseCode, setCourseCode] = useState<string>(department.courses[0]?.code ?? "");
  const course = useMemo(
    () => department.courses.find((c) => c.code === courseCode) ?? department.courses[0],
    [department, courseCode],
  );

  // Year filter (derived from the currently selected course's questions)
  const availableYears = useMemo(() => {
    const ys = Array.from(new Set((course?.questions ?? []).map((q) => q.year))).sort(
      (a, b) => b - a,
    );
    return ys;
  }, [course]);
  const [year, setYear] = useState<number | "all">("all");

  const filteredQuestions = useMemo(() => {
    if (!course) return [];
    return year === "all" ? course.questions : course.questions.filter((q) => q.year === year);
  }, [course, year]);

  // Keep selections coherent when faculty/department changes
  const onFacultyChange = (id: string) => {
    const f = FACULTIES.find((x) => x.id === id)!;
    setFacultyId(id);
    setDeptId(f.departments[0].id);
    setLevel(f.departments[0].courses[0]?.level ?? 100);
    setCourseCode(f.departments[0].courses[0]?.code ?? "");
    setYear("all");
  };
  const onDeptChange = (id: string) => {
    const d = faculty.departments.find((x) => x.id === id)!;
    setDeptId(id);
    setLevel(d.courses[0]?.level ?? 100);
    setCourseCode(d.courses[0]?.code ?? "");
    setYear("all");
  };
  const onLevelChange = (lvl: number) => {
    setLevel(lvl);
    const first = department.courses.find((c) => c.level === lvl);
    if (first) setCourseCode(first.code);
    setYear("all");
  };

  const [panelOpen, setPanelOpen] = useState(false);
  const [activeQ, setActiveQ] = useState<Question | null>(null);
  const onAskAI = (q: Question) => {
    setActiveQ(q);
    setPanelOpen(true);
  };

  const levels = [100, 200, 300, 400] as const;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-[var(--instrict-glow)]">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Instrict</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Past Question Bank</p>
            </div>
          </div>

          <Select value={facultyId} onValueChange={onFacultyChange}>
            <SelectTrigger className="w-[200px] border-border bg-card sm:w-[260px]">
              <SelectValue placeholder="Select Faculty" />
            </SelectTrigger>
            <SelectContent>
              {FACULTIES.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
            <GraduationCap className="h-3.5 w-3.5" />
            {faculty.name}
          </div>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
            Master past questions with a tutor that{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              actually explains
            </span>
            .
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {faculty.tagline}. Study at your pace or take a timed quiz — no signup, no friction.
          </p>
        </div>
      </section>

      {/* Department / Level selectors */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Departments
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {faculty.departments.map((d) => (
              <button
                key={d.id}
                onClick={() => onDeptChange(d.id)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  d.id === department.id
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          <p className="mt-5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Course Level
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div className="flex gap-1.5 rounded-lg border border-border bg-background/40 p-1">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onLevelChange(lvl)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    lvl === level
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lvl}L
                </button>
              ))}
            </div>

            {coursesForLevel.length > 0 ? (
              <Select
                value={course?.code ?? ""}
                onValueChange={(v) => {
                  setCourseCode(v);
                  setYear("all");
                }}
              >
                <SelectTrigger className="w-[260px] border-border bg-card">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {coursesForLevel.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} · {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs text-muted-foreground">
                No courses at {level}L for {department.name} yet.
              </span>
            )}

            {availableYears.length > 0 && (
              <Select
                value={String(year)}
                onValueChange={(v) => setYear(v === "all" ? "all" : Number(v))}
              >
                <SelectTrigger className="w-[160px] border-border bg-card">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {availableYears.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {course ? (
          <>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {department.name} · {course.level}L{year !== "all" ? ` · ${year}` : ""}
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                  {course.code} — {course.title}
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {filteredQuestions.length} past question{filteredQuestions.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mb-6">
              <WhatsAppCTA departmentName={department.name} url={department.whatsappUrl} />
            </div>

            <Tabs defaultValue="study" className="w-full">
              <TabsList className="bg-card">
                <TabsTrigger value="study" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                  Study Mode
                </TabsTrigger>
                <TabsTrigger value="quiz" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Target className="mr-1.5 h-3.5 w-3.5" />
                  Quiz Mode
                </TabsTrigger>
              </TabsList>

              <TabsContent value="study" className="mt-6">
                <StudyMode questions={filteredQuestions} onAskAI={onAskAI} />
              </TabsContent>

              <TabsContent value="quiz" className="mt-6">
                <QuizMode
                  course={course}
                  department={department}
                  facultyName={faculty.name}
                  year={year}
                  questions={filteredQuestions}
                />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">
            Pick a course to begin.
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Built for students · No accounts · No friction · © Instrict
      </footer>

      <AskInstrictPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        question={activeQ}
      />
    </div>
  );
}
