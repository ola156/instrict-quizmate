import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Sparkles } from "lucide-react";
import type { Question } from "@/data/instrict";
import { WhatsAppCTA } from "./WhatsAppCTA";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  question: Question | null;
  departmentName: string;
  whatsappUrl: string;
};

const buildStream = (q: Question | null) => {
  if (!q) return [];
  return [
    `Let's break this down together.`,
    `\n\n**The question is asking:** ${q.prompt}`,
    `\n\n**Step 1 — Identify what's given.** Pull out the known quantities and what's being asked. Don't skip this; it anchors everything.`,
    `\n\n**Step 2 — Pick the right relationship.** ${q.formula ? `The governing formula here is:\n\n\`${q.formula}\`` : `There's no single formula — we reason from the underlying principle.`}`,
    `\n\n**Step 3 — Plug in and simplify.** Substitute carefully, keep units, and reduce the expression step by step.`,
    `\n\n**Step 4 — Sanity check.** Does the answer have the right magnitude and units? If not, retrace step 3.`,
    `\n\n**In plain English:** ${q.solution}`,
    `\n\n✨ You've got this — try the next one to lock it in.`,
  ];
};

export function AskInstrictPanel({ open, onOpenChange, question, departmentName, whatsappUrl }: Props) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open || !question) return;
    setText("");
    setDone(false);
    const chunks = buildStream(question);
    let i = 0;
    let acc = "";
    const id = setInterval(() => {
      if (i >= chunks.length) {
        clearInterval(id);
        setDone(true);
        return;
      }
      acc += chunks[i];
      setText(acc);
      i++;
    }, 320);
    return () => clearInterval(id);
  }, [open, question]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-l border-border bg-card sm:max-w-lg">
        <SheetHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-[var(--instrict-glow)]">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <SheetTitle className="text-base">Instrict AI Tutor</SheetTitle>
              <SheetDescription className="text-xs">Live explanation — student-friendly</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {question && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Question</p>
              <p className="mt-1 text-sm text-foreground">{question.prompt}</p>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {!done && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  )}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <p className="text-xs font-medium text-primary">
                  {done ? "Response complete" : "Streaming response…"}
                </p>
              </div>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
                  if (part.startsWith("**") && part.endsWith("**"))
                    return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                  if (part.startsWith("`") && part.endsWith("`"))
                    return <code key={i} className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-xs text-accent">{part.slice(1, -1)}</code>;
                  return <span key={i}>{part}</span>;
                })}
                {!done && <span className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-primary align-middle" />}
              </div>
            </div>

            <WhatsAppCTA departmentName={departmentName} url={whatsappUrl} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}