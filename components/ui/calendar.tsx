"use client";

import { DayPicker } from "react-day-picker";
import type { ComponentProps } from "react";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";

type CalendarProps = ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={es}
      className={cn("p-1 text-sm", className)}
      classNames={{
        root: "rdp text-foreground",
        months: "flex flex-col gap-4",
        month: "space-y-4",
        month_caption: "flex h-10 items-center justify-center",
        caption_label: "text-sm font-semibold capitalize",
        nav: "absolute inset-x-3 top-3 flex items-center justify-between",
        button_previous:
          "flex size-8 items-center justify-center rounded-full border border-leaf bg-white text-leaf-foreground transition hover:bg-leaf-soft hover:text-leaf-strong",
        button_next:
          "flex size-8 items-center justify-center rounded-full border border-leaf bg-white text-leaf-foreground transition hover:bg-leaf-soft hover:text-leaf-strong",
        weekdays: "grid grid-cols-7 gap-1 text-muted",
        weekday: "flex h-8 items-center justify-center text-xs font-semibold",
        week: "grid grid-cols-7 gap-1",
        day: "relative flex size-9 items-center justify-center rounded-full text-sm",
        day_button:
          "flex size-9 items-center justify-center rounded-full transition hover:bg-leaf-soft focus:outline-none focus:ring-2 focus:ring-leaf",
        selected:
          "rounded-full bg-brand text-brand-foreground hover:bg-brand hover:text-brand-foreground",
        today: "font-bold text-brand-active",
        outside: "text-stone-500",
        disabled: "text-stone-500 opacity-70",
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
