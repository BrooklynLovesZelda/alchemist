import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    detail?: string;
    className?: string;
}

export default function EmptyState({ icon: Icon, title, detail, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-3 rounded-lg border border-helios-line/30 bg-helios-surface p-10 text-center", className)}>
            <Icon size={28} className="text-helios-slate/40" />
            <p className="text-sm font-medium text-helios-ink">{title}</p>
            {detail && <p className="max-w-xs text-xs text-helios-slate">{detail}</p>}
        </div>
    );
}
