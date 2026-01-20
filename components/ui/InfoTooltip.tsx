import { Info } from "lucide-react";

interface InfoTooltipProps {
    text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
    return (
        <span className="relative group inline-flex ml-1">
            <Info size={10} className="text-[var(--text-muted)] cursor-help" />
            <span className="absolute bottom-full right-0 mb-1 px-2.5 py-2 text-xs leading-relaxed normal-case font-normal text-[var(--text-primary)] bg-[var(--surface-elevated)] border border-[var(--border)] rounded shadow-lg w-52 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {text}
            </span>
        </span>
    );
}
