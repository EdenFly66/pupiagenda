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
          "flex size-8 items-center justify-center rounded-full border border-rose-100 bg-white text-muted transition hover:bg-rose-50 hover:text-foreground",
        button_next:
          "flex size-8 items-center justify-center rounded-full border border-rose-100 bg-white text-muted transition hover:bg-rose-50 hover:text-foreground",
        weekdays: "grid grid-cols-7 gap-1 text-muted",
        weekday: "flex h-8 items-center justify-center text-xs font-semibold",
        week: "grid grid-cols-7 gap-1",
        day: "relative flex size-9 items-center justify-center rounded-full text-sm",
        day_button:
          "flex size-9 items-center justify-center rounded-full transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-100",
        selected:
          "rounded-full bg-brand text-brand-foreground hover:bg-brand hover:text-brand-foreground",
        today: "font-bold text-brand",
        outside: "text-stone-300",
        disabled: "text-stone-300 opacity-50",
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
