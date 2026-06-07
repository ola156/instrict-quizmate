import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, GraduationCap, BookOpen, Target, ArrowLeft, Search, Check, ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FACULTIES, DEFAULT_FACULTY_ID, type Question } from "@/data/instrict";
import { fetchQuestionsByCourse, fetchAvailableSets } from "@/lib/db-queries";
import { StudyMode } from "@/components/instrict/StudyMode";
import { QuizMode } from "@/components/instrict/QuizMode";
import { AskInstrictPanel } from "@/components/instrict/AskInstrictPanel";
import { WhatsAppCTA } from "@/components/instrict/WhatsAppCTA";
import { cn } from "@/lib/utils";
import { set } from "date-fns";

export const Route = createFileRoute("/")({
  component: Index,
});

type ViewMode = "dashboard" | "study_page" | "quiz_page";

function Index() {
  const [facultyId, setFacultyId] = useState<string>(DEFAULT_FACULTY_ID);
  const faculty = useMemo(() => FACULTIES.find((f) => f.id === facultyId)!, [facultyId]);
  
  // Flattened courses for searchable selection
  const allFacultyCourses = useMemo(() => faculty.courses, [faculty]);

  const [courseCode, setCourseCode] = useState<string>("");
  const [setNumber, setSetNumber] = useState<number | "">("");
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeQ, setActiveQ] = useState<Question | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  
  const [courseQuestions, setCourseQuestions] = useState<Question[]>([]);
  const [availableSets, setAvailableSets] = useState<number[]>([]);

  const course = useMemo(() => allFacultyCourses.find((c) => c.code === courseCode), [allFacultyCourses, courseCode]);

  useEffect(() => {
    async function loadData() {
      if (!courseCode) return;
      const [questions, sets] = await Promise.all([
        fetchQuestionsByCourse(courseCode),
        fetchAvailableSets(courseCode)
      ]);
      setCourseQuestions(questions);
      setAvailableSets(sets);
      setSetNumber("");
      setViewMode("dashboard");
    }
    loadData();
  }, [courseCode]);

  const filteredQuestions = useMemo(() => {
    if (setNumber === "") return [];
    return courseQuestions.filter((q) => Number(q.set_number) === Number(setNumber));
  }, [courseQuestions, setNumber]);

  const resetSelection = () => { setSetNumber(""); setViewMode("dashboard"); };
  const onFacultyChange = (id: string) => { setFacultyId(id); setCourseCode(""); resetSelection(); };

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
          <StudyMode questions={filteredQuestions} onAskAI={(q) => { setActiveQ(q); setPanelOpen(true); }} />
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
          <QuizMode course={course} department={{ name: "Department" } as any} facultyName={faculty.name} faculty={faculty} year={setNumber as number} questions={filteredQuestions} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Logo" width={36} height={36} className="h-9 w-9" />
            <p className="text-sm font-semibold tracking-tight">Instrict.</p>
          </div>
          <Select value={facultyId} onValueChange={onFacultyChange}>
            <SelectTrigger className="w-[180px] border-border bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>{FACULTIES.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </header>

      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary mb-4"><GraduationCap className="h-3.5 w-3.5" /> {faculty.name}</div>
          <h1 className="max-w-2xl text-2xl font-semibold leading-[1.2] tracking-tight sm:text-4xl">Study Smarter, Not Harder. {faculty.name === 'Faculty of Science' ? 'Driven by The Evolution.' : ' Sponsored by Instrict'}</h1>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <p className="text-sm text-muted-foreground">
              Search for a course to start practicing past questions.
            </p>
            <Popover open={openSearch} onOpenChange={setOpenSearch}>
              <PopoverTrigger asChild>
                <button className="flex h-12 w-full sm:w-[400px] items-center justify-between rounded-xl border border-border bg-background px-4 text-sm hover:border-primary/50 transition-all">
                  <span className={cn("flex items-center gap-2", !courseCode && "text-muted-foreground")}>
                    <Search className="h-4 w-4 " />
                    {course ? `${course.code} · ${course.title}` : "Search course code..."}
                  </span>
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search course code..." />
                  <CommandList>
                    <CommandEmpty>No course found.</CommandEmpty>
                    <CommandGroup>
                      {allFacultyCourses.map((c) => (
                        <CommandItem key={c.code} onSelect={() => { setCourseCode(c.code); setOpenSearch(false); }}>
                          <Check className={cn("mr-2 h-4 w-4", courseCode === c.code ? "opacity-100" : "opacity-0")} />
                          {c.code} · {c.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {availableSets.length > 0 && (
              <Select value={String(setNumber)} onValueChange={(v) => setSetNumber(Number(v))}>
                <SelectTrigger className="h-12 w-full sm:w-[160px] border-primary/40 bg-card font-medium">
                  <SelectValue placeholder="Set" />
                </SelectTrigger>
                <SelectContent>{availableSets.map((s) => <SelectItem key={s} value={String(s)}>Set {s}</SelectItem>)}</SelectContent>
              </Select>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {course && setNumber !== "" ? (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-semibold tracking-tight">{course.code} — {course.title} (Set {Number(setNumber)})</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setViewMode("study_page")} className="inline-flex items-center gap-2 rounded-lg bg-background border px-4 py-2 text-xs font-semibold hover:border-primary/50"><BookOpen className="h-3.5 w-3.5 text-primary" /> Study Mode</button>
              <button onClick={() => setViewMode("quiz_page")} className="inline-flex items-center gap-2 rounded-lg bg-background border px-4 py-2 text-xs font-semibold hover:border-primary/50"><Target className="h-3.5 w-3.5 text-primary" /> Quiz Mode</button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-16 text-center text-sm text-muted-foreground">Pick a course from the search bar above to begin your session.</div>
        )}
      </main>
  <div className="mx-auto max-w-6xl px-4  sm:px-6">
    <WhatsAppCTA departmentName={faculty.name} url={faculty.whatsappUrl} />
    </div>  
      <footer className="py-8 text-center text-xs text-muted-foreground">Built for students · © Instrict</footer>
    </div>
  );
}