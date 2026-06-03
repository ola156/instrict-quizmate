import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, GraduationCap, BookOpen, Target, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FACULTIES, DEFAULT_FACULTY_ID, type Question } from "@/data/instrict";
import { fetchQuestionsByCourse, fetchAvailableSets } from "@/lib/db-queries";
import { StudyMode } from "@/components/instrict/StudyMode";
import { QuizMode } from "@/components/instrict/QuizMode";
import { AskInstrictPanel } from "@/components/instrict/AskInstrictPanel";
import { WhatsAppCTA } from "@/components/instrict/WhatsAppCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Instrict — Past Questions & AI-Powered Quiz Bank" },
      { name: "description", content: "Practice past questions, take timed quizzes, and ask the Instrict AI tutor — no signup required." },
    ],
  }),
  component: Index,
});

type ViewMode = "dashboard" | "study_page" | "quiz_page";

function Index() {
  const [facultyId, setFacultyId] = useState<string>(DEFAULT_FACULTY_ID);
  const faculty = useMemo(() => FACULTIES.find((f) => f.id === facultyId)!, [facultyId]);

  const [deptId, setDeptId] = useState<string>(faculty.departments[0].id);
  const department = useMemo(() => faculty.departments.find((d) => d.id === deptId) ?? faculty.departments[0], [faculty, deptId]);

  const [level, setLevel] = useState<number>(department.courses[0]?.level ?? 100);
  const coursesForLevel = useMemo(() => department.courses.filter((c) => c.level === level), [department, level]);
  
  const [courseCode, setCourseCode] = useState<string>(department.courses[0]?.code ?? "");
  const course = useMemo(() => department.courses.find((c) => c.code === courseCode) ?? department.courses[0], [department, courseCode]);

  const [setNumber, setSetNumber] = useState<number | "">("");
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeQ, setActiveQ] = useState<Question | null>(null);
  
  // Data states
  const [courseQuestions, setCourseQuestions] = useState<Question[]>([]);
  const [availableSets, setAvailableSets] = useState<number[]>([]);

  // Fetch data from Supabase when course changes
  useEffect(() => {
    async function loadData() {
      if (!courseCode) return;
      const [questions, sets] = await Promise.all([
        fetchQuestionsByCourse(courseCode),
        fetchAvailableSets(courseCode)
      ]);
      setCourseQuestions(questions);
      setAvailableSets(sets);
      setSetNumber(""); // Reset set selection when course changes
      setViewMode("dashboard");
    }
    loadData();
  }, [courseCode]);

    console.log("Questions for Set", courseQuestions);

  const filteredQuestions = useMemo(() => {
    if (setNumber === "") return [];
    return courseQuestions.filter((q) => Number(q.set_number) === Number(setNumber));
  }, [courseQuestions, setNumber]);

  console.log("Filtered Questions for Set", setNumber, filteredQuestions);

  const resetSelection = () => { setSetNumber(""); setViewMode("dashboard"); };
  const onFacultyChange = (id: string) => { const f = FACULTIES.find((x) => x.id === id)!; setFacultyId(id); setDeptId(f.departments[0].id); setLevel(f.departments[0].courses[0]?.level ?? 100); setCourseCode(f.departments[0].courses[0]?.code ?? ""); resetSelection(); };
  const onDeptChange = (id: string) => { const d = faculty.departments.find((x) => x.id === id)!; setDeptId(id); setLevel(d.courses[0]?.level ?? 100); setCourseCode(d.courses[0]?.code ?? ""); resetSelection(); };
  const onLevelChange = (lvl: number) => { setLevel(lvl); const first = department.courses.find((c) => c.level === lvl); if (first) setCourseCode(first.code); resetSelection(); };

  const onAskAI = (q: Question) => { setActiveQ(q); setPanelOpen(true); };
  const levels = [100, 200, 300, 400] as const;

  if (viewMode === "study_page" && course) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <button type="button" onClick={() => setViewMode("dashboard")} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> <span>Back to archive hub</span>
          </button>
          <div className="border-b border-border pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Study Mode Workspace</span>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mt-0.5">{course.code} — {course.title} (Set {setNumber})</h1>
          </div>
          <StudyMode questions={filteredQuestions} onAskAI={onAskAI} />
        </div>
        <AskInstrictPanel open={panelOpen} onOpenChange={setPanelOpen} question={activeQ} />
      </div>
    );
  }

  if (viewMode === "quiz_page" && course) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <button type="button" onClick={() => setViewMode("dashboard")} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> <span>Quit and leave quiz</span>
          </button>
          <QuizMode course={course} department={department} facultyName={faculty.name} faculty={faculty} year={setNumber as number} questions={filteredQuestions} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl">
            <img 
  src="/logo.svg" 
  alt="Company Logo" 
  width={40} 
  height={40} 
  className="h-full w-full object-contain p-1.5"
/>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Instrict.</p>
            </div>
          </div>
          <Select value={facultyId} onValueChange={onFacultyChange}>
            <SelectTrigger className="w-[200px] border-border bg-card sm:w-[260px]"><SelectValue /></SelectTrigger>
            <SelectContent>{FACULTIES.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary"><GraduationCap className="h-3.5 w-3.5" /> {faculty.name}</div>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">Master past questions with Instrict<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Past Question Bank</span>.</h1>
        </div>
      </section>

      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Departments</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {faculty.departments.map((d) => (
              <button key={d.id} onClick={() => onDeptChange(d.id)} className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${d.id === department.id ? "border-primary/60 bg-primary/15 text-primary" : "border-border bg-background/40 text-muted-foreground hover:border-primary/30"}`}>
                {d.name}
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="flex gap-1.5 rounded-lg border border-border bg-background/40 p-1">
              {levels.map((lvl) => (
                <button key={lvl} onClick={() => onLevelChange(lvl)} className={`rounded-md px-3 py-1 text-xs font-medium ${lvl === level ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{lvl}L</button>
              ))}
            </div>
            <Select value={courseCode} onValueChange={(v) => { setCourseCode(v); }}>
              <SelectTrigger className="w-[260px] border-border bg-card"><SelectValue placeholder="Select course" /></SelectTrigger>
              <SelectContent>{coursesForLevel.map((c) => <SelectItem key={c.code} value={c.code}>{c.code} · {c.title}</SelectItem>)}</SelectContent>
            </Select>
            {availableSets.length > 0 && (
              <Select value={String(setNumber)} onValueChange={(v) => setSetNumber(Number(v))}>
                <SelectTrigger className="w-[160px] border-primary/40 bg-card font-medium"><SelectValue placeholder="Select Set" /></SelectTrigger>
                <SelectContent>{availableSets.map((s) => <SelectItem key={s} value={String(s)}>Set {s}</SelectItem>)}</SelectContent>
              </Select>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {course && setNumber !== "" ? (
          <>
            <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{course.code} — {course.title} (Set {setNumber})</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => setViewMode("study_page")} className="inline-flex items-center gap-2 rounded-lg bg-background border border-border px-4 py-2 text-xs font-semibold hover:border-primary/50"><BookOpen className="h-3.5 w-3.5 text-primary" /> Study Mode</button>
                <button onClick={() => setViewMode("quiz_page")} className="inline-flex items-center gap-2 rounded-lg bg-background border border-border px-4 py-2 text-xs font-semibold hover:border-primary/50"><Target className="h-3.5 w-3.5 text-primary" /> Quiz Mode</button>
              </div>
            </div>
            <WhatsAppCTA departmentName={faculty.name} url={faculty.whatsappUrl} />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">Pick a course and select a specific set number above to begin.</div>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">Built for students · No accounts · No friction · © Instrict</footer>
    </div>
  );
}