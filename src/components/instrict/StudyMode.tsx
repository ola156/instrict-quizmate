import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, RotateCcw } from "lucide-react";
import type { Question } from "@/data/instrict";
import { QuestionCard } from "./QuestionCard";

type Props = {
  questions: Question[];
  onAskAI: (q: Question) => void;
};

export function StudyMode({ questions, onAskAI }: Props) {
  const [idx, setIdx] = useState(0);
  const [userPicks, setUserPicks] = useState<Record<string, string>>({});
  
  // Changed from boolean to a record of IDs to track per-question state
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No past questions available for this selection yet.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[idx];
  const isObj = !!(currentQuestion.options && currentQuestion.options.length > 0);

  const handleSelectAnswer = (val: string) => {
    // Only allow selecting if this question hasn't been revealed yet
    if (revealedIds[currentQuestion.id]) return;
    setUserPicks((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  const handleReveal = () => {
    setRevealedIds((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
  };

  const handleReset = () => {
    setUserPicks({});
    setRevealedIds({});
  };

  return (
    <div className="space-y-6">
      {/* Mode Title Header */}
      <div className="rounded-xl border border-border bg-background/30 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Self-Paced Study Room</h4>
            <p className="text-[11px] text-muted-foreground">
              {revealedIds[currentQuestion.id] ? "Review your answer below." : "Select an option to test your understanding."}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold bg-border/40 px-2.5 py-1 rounded-md text-muted-foreground">
          {isObj ? "Objective" : "Theory"}
        </span>
      </div>

      {/* Progress & Navigation Hub */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground px-1">
          <span>Reviewing Question <strong>{idx + 1}</strong> of {questions.length}</span>
          <span className="font-mono text-[11px]">Progress: {Math.round(((idx + 1) / questions.length) * 100)}%</span>
        </div>
        <Progress value={((idx + 1) / questions.length) * 100} className="h-1.5 bg-border/40" />
      </div>

      {/* Question Card */}
      <div className="key-viewport-frame animate-in fade-in duration-200">
        <QuestionCard 
          key={currentQuestion.id} 
          question={{ ...currentQuestion, type: isObj ? "objective" : "theory" }} 
          index={idx} 
          onAskAI={onAskAI}
          selectedAnswer={userPicks[currentQuestion.id] ?? null}
          onSelectAnswer={handleSelectAnswer}
          // Now only true for the specific current question
          showResult={!!revealedIds[currentQuestion.id]} 
        />
      </div>

      {/* Navigation & Submission Footers */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          disabled={idx === 0}
          onClick={() => setIdx((prev) => prev - 1)}
          className="text-xs font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
        </Button>

        <div className="flex items-center gap-2">
          {!revealedIds[currentQuestion.id] ? (
            <Button
              size="sm"
              onClick={handleReveal}
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Show Answer
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleReset}
              className="text-xs font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset All
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={idx === questions.length - 1}
            onClick={() => setIdx((prev) => prev + 1)}
            className="text-xs font-semibold"
          >
            Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}