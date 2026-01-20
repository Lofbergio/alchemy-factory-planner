interface SegmentedToggleProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedToggleProps<T>) {
  return (
    <div
      className={`relative flex min-w-0 bg-[var(--background-deep)] border border-[var(--border-subtle)] rounded-lg p-1 gap-1 ${className}`}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative flex-1 min-w-0 px-3 py-1.5 text-xs font-medium rounded-md
              transition-all duration-200 cursor-pointer text-center
              ${
                isActive
                  ? "bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--surface)] text-[var(--accent-gold)] shadow-[0_2px_8px_rgba(201,147,14,0.15)] border border-[var(--accent-gold-dim)]/40"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface)]/50 border border-transparent"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
