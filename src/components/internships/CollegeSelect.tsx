"use client";

import { useMemo, useRef, useState } from "react";
import { Search, Check, X, Info } from "lucide-react";
import { colleges } from "@/lib/data/colleges";

const MAX_RESULTS = 8;

export function CollegeSelect({ name, inputClass }: { name: string; inputClass: string }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return colleges
      .filter((c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS);
  }, [query]);

  // Nothing in the list matches, so whatever they typed is the answer. The
  // hidden input below submits it verbatim, which is why the hint asks for
  // the full Google spelling rather than an abbreviation.
  const usingCustom = !selected && query.trim().length > 0 && matches.length === 0;

  function choose(collegeName: string) {
    setSelected(collegeName);
    setQuery(collegeName);
    setOpen(false);
  }

  function clear() {
    setSelected(null);
    setQuery("");
    setOpen(false);
  }

  return (
    <div>
      <label htmlFor={`${name}-search`} className="mb-2 block text-sm font-medium text-foreground/90">
        College <span className="text-red-400">*</span>
      </label>

      <div className="relative">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id={`${name}-search`}
          type="text"
          required
          autoComplete="off"
          value={query}
          placeholder="Search for your college"
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          className={`${inputClass} pl-10 ${selected ? "pr-10" : ""}`}
        />
        {selected && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear selected college"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
          >
            <X size={15} />
          </button>
        )}

        {open && matches.length > 0 && (
          <ul className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-xl">
            {matches.map((college) => (
              <li key={`${college.name}-${college.city}`}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (blurTimer.current) clearTimeout(blurTimer.current);
                    choose(college.name);
                  }}
                  className="flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-foreground/[0.06]"
                >
                  <span className="flex-1">
                    <span className="block text-sm text-foreground/90">{college.name}</span>
                    <span className="block text-xs text-muted">{college.city}</span>
                  </span>
                  {selected === college.name && <Check size={14} className="mt-0.5 shrink-0 text-red-500" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <Check size={13} className="text-red-500" />
          Selected from the list.
        </p>
      )}

      {usingCustom && (
        <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-red-500/30 bg-red-500/5 p-2.5 text-xs leading-relaxed text-foreground/85">
          <Info size={13} className="mt-0.5 shrink-0 text-red-500" />
          <span>
            College not found. Please type your college&rsquo;s <strong>full name exactly as it appears on
            Google search</strong>, not an abbreviation, so we can group applicants correctly.
          </span>
        </p>
      )}

      <input type="hidden" name={name} value={selected ?? query.trim()} />
    </div>
  );
}
