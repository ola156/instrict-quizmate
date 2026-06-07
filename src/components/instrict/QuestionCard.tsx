import { CheckCircle2, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import type { Question } from "@/data/instrict";
import { cn } from "@/lib/utils";

type Props = {
  question: Question & { type?: "objective" | "theory" | "fill-in-the-gap"; answer?: string };
  index: number;
  selectedAnswer: string | null;
  onSelectAnswer: (val: string) => void;
  showResult?: boolean;
  onPromptChange?: (val: string) => void;
  onOptionChange?: (optIdx: number, val: string) => void;
  onSolutionChange?: (val: string) => void;
  onAnswerChange?: (val: string) => void;
};

// Reusable Markdown wrapper to ensure consistent style and readability
const MarkdownRenderer = ({ content }: { content: string }) => (
  <div className="prose prose-sm dark:prose-invert max-w-none w-full break-words overflow-x-auto [&_p]:m-0 [&_p]:leading-relaxed [&_code]:bg-transparent [&_code]:p-0 [&_code]:before:content-none [&_code]:after:content-none">
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {content}
    </ReactMarkdown>
  </div>
);

export function QuestionCard({ 
  question, 
  index, 
  selectedAnswer, 
  onSelectAnswer, 
  showResult = false,
  onPromptChange,
  onOptionChange,
  onSolutionChange,
  onAnswerChange
}: Props) {
  const type = question.type || "objective";
  const isCorrect = selectedAnswer === question.answer;
  const isAdmin = !!onPromptChange;

  return (
    <article className="group rounded-xl border border-border bg-card p-4 shadow-sm min-w-0 w-full overflow-hidden">
      <header className="mb-6 flex items-start gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background font-semibold text-primary">
          {String(index + 1).padStart(2, "0")}
        </div>
        
        <div className="flex-1 min-w-0 overflow-hidden">
          {isAdmin ? (
            <textarea 
              value={question.prompt} 
              onChange={(e) => onPromptChange!(e.target.value)}
              className="w-full p-3 border rounded-lg bg-background text-sm"
              rows={3}
            />
          ) : (
            <MarkdownRenderer  content={question.prompt}/>
          )}
        </div>
      </header>

      {type === "objective" && (
        <div className="ml-0 sm:ml-12 space-y-3 min-w-0 w-full overflow-hidden">
          {question.options?.map((opt, i) => {
            const isSelected = isAdmin ? question.answer === opt : selectedAnswer === opt;
            const isCorrectAnswer = opt === question.answer;
            let colorClass = "border-border hover:border-primary/50 bg-card";
            
            if (showResult && !isAdmin) {
              if (isCorrectAnswer) colorClass = "border-green-500 bg-green-500/10 text-green-700 font-semibold";
              else if (isSelected && !isCorrect) colorClass = "border-red-500 bg-red-500/10 text-red-700";
            } else if (isSelected) {
              colorClass = isAdmin ? "border-green-500 bg-green-500/10" : "border-primary bg-primary/10";
            }

            return (
              <div key={i} className="flex gap-2 items-center min-w-0 w-full overflow-hidden">
                {isAdmin ? (
                  <input 
                    value={opt} 
                    onChange={(e) => onOptionChange!(i, e.target.value)} 
                    className="flex-1 p-3 rounded-lg border border-border text-sm min-w-0"
                  />
                ) : (
                  <button
                    type="button"
                    disabled={showResult}
                    onClick={() => onSelectAnswer(opt)}
                    className={cn("w-full text-left min-h-12 h-auto py-3 px-2 rounded-xl border text-xs transition-all overflow-hidden flex items-center", colorClass)}
                  >
                    <MarkdownRenderer content={opt} />
                  </button>
                )}
                {isAdmin && (
                  <button onClick={() => onAnswerChange!(opt)} className={isCorrectAnswer ? "text-green-600" : "text-gray-300"}>
                    <CheckCircle2 className="h-6 w-6" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(showResult || isAdmin) && (
        <div className="ml-0 sm:ml-12 mt-6 p-5 rounded-2xl bg-muted/30 border border-border/50 min-w-0 overflow-hidden">
          {!isAdmin && (
           <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest mb-3">
  {type === "objective" ? (
    isCorrect ? (
      <>
        <CheckCircle2 className="h-4 w-4 text-green-500" /> Correct
      </>
    ) : (
      <>
        <XCircle className="h-4 w-4 text-red-500" /> Incorrect
      </>
    )
  ) : (
    "Answer"
  )}
</div>
          )}
          
          {isAdmin ? (
            <textarea 
              value={question.solution || ""} 
              onChange={(e) => onSolutionChange!(e.target.value)}
              className="w-full p-3 border rounded-lg text-xs bg-background"
              rows={3}
            />
          ) : (
            <MarkdownRenderer content={question.solution || "No explanation provided."} />
          )}
        </div>
      )}
    </article>
  );
}