import { MessageCircle } from "lucide-react";

type Props = {
  departmentName: string;
  url: string;
  variant?: "default" | "compact";
};

export function WhatsAppCTA({ departmentName, url, variant = "default" }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group mt-4 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/10 ${
        variant === "compact" ? "p-3" : ""
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
        <MessageCircle className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          Stuck on this topic?
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          Drop it into the{" "}
          <span className="font-medium text-emerald-300">Instrict {departmentName}</span>{" "}
          WhatsApp Community to solve it with your coursemates right now.
        </p>
      </div>
      <span className="self-center text-xs font-medium text-emerald-300 opacity-0 transition-opacity group-hover:opacity-100">
        Join →
      </span>
    </a>
  );
}