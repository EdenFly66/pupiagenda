import type { ChangeEvent } from "react";
import { cn } from "@/lib/utils";

type SessionTextareaProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  helper?: string;
  className?: string;
};

export function SessionTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 7,
  helper,
  className,
}: SessionTextareaProps) {
  return (
    <label className="block">
      <span className="text-base font-semibold text-foreground">{label}</span>
      {helper ? <p className="mt-1 text-sm text-muted">{helper}</p> : null}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          "mt-3 w-full resize-y rounded-3xl border border-rose-100 bg-white/95 px-5 py-4 text-base leading-7 text-foreground shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-rose-100",
          className,
        )}
      />
    </label>
  );
}
