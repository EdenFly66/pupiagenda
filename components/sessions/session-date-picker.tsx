"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SessionDatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
};

export function SessionDatePicker({ value, onChange }: SessionDatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="block">
      <span className="text-sm font-semibold text-foreground">Fecha</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="mt-2 flex h-12 w-full items-center justify-between rounded-2xl border border-rose-100 bg-white/95 px-4 text-left text-sm font-medium text-foreground shadow-sm outline-none transition hover:bg-rose-50/70 focus:border-brand focus:ring-4 focus:ring-rose-100"
          >
            <span>{format(value, "d 'de' MMMM yyyy", { locale: es })}</span>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-brand">
              Cal
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (!date) {
                return;
              }

              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
