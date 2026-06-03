import { CheckCircle2, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import type { Question } from "@/data/instrict";

type Props = {
  question: Question & { type?: "objective" | "theory" | "fill-in-the-gap"; answer?: string };
  index: number;
  selectedAnswer: string | null;
  onSelectAnswer: (val: string) => void;
  showResult?: boolean;
};

export function QuestionCard({ 
  question, 
  index, 
  selectedAnswer, 
  onSelectAnswer, 
  showResult = false 
}: Props) {
  const type = question.type || "objective";
  const isCorrect = selectedAnswer === question.answer;

  return (
    <article className="group rounded-2xl border border-border bg-card p-6 shadow-sm">
      <header className="mb-4 flex items-start gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background font-semibold text-primary">
          {String(index + 1).padStart(2, "0")}
        </div>
        {/* Added prose-sm and aggressive margin reset for the prompt */}
        <div className="text-sm font-medium leading-relaxed pt-1 prose prose-sm dark:prose-invert max-w-none [&_p]:m-0">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {question.prompt}
          </ReactMarkdown>
        </div>
      </header>

      {type === "objective" && (
        <div className="ml-0 sm:ml-12 space-y-2">
          {question.options?.map((opt, i) => {
            let colorClass = "border-border hover:border-primary/50 bg-card";
            
            if (showResult) {
              if (opt === question.answer) {
                colorClass = "border-green-500 bg-green-500/10 text-green-700 font-semibold";
              } else if (selectedAnswer === opt && !isCorrect) {
                colorClass = "border-red-500 bg-red-500/10 text-red-700";
              }
            } else if (selectedAnswer === opt) {
              colorClass = "border-primary bg-primary/10";
            }

            return (
              <button
                key={`${question.id}-${i}`}
                type="button"
                disabled={showResult}
                onClick={() => onSelectAnswer(opt)}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${colorClass}`}
              >
                {/* Simplified structure to ensure text remains inline and clean */}
                <span className="prose prose-sm dark:prose-invert max-w-none [&_*]:!m-0 [&_*]:!p-0">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {opt}
                  </ReactMarkdown>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {showResult && (
        <div className="ml-0 sm:ml-12 mt-6 p-4 rounded-xl bg-muted/50 border border-border space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
            {isCorrect ? (
              <><CheckCircle2 className="h-4 w-4 text-green-500" /> Correct</>
            ) : (
              <><XCircle className="h-4 w-4 text-red-500" /> Incorrect</>
            )}
          </div>
          {/* Consistent prose-sm styling for the solution */}
          <div className="text-sm text-foreground/80 prose prose-sm dark:prose-invert max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {question.solution || "No explanation provided."}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </article>
  );
}