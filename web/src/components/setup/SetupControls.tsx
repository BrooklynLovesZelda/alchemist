import type { ReactNode } from "react";

export { RangeControl, LabeledInput, LabeledSelect, ToggleSwitch, ToggleRow } from "../ui/FormControls";

interface SectionHeaderProps {
    icon: ReactNode;
    eyebrow: string;
    title: string;
    body: string;
}

/** Sub-section header used within a setup step (icon + eyebrow + title + body). */
export function SectionHeader({ icon, eyebrow, title, body }: SectionHeaderProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="rounded-lg bg-helios-solar/10 p-2 text-helios-solar">
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold uppercase text-helios-slate/70">{eyebrow}</p>
                <h3 className="mt-1 text-base font-semibold text-helios-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-helios-slate">{body}</p>
            </div>
        </div>
    );
}

interface StepHeaderProps {
    icon: ReactNode;
    title: string;
    subtitle: ReactNode;
    className?: string;
}

/** Top-of-step title used by every setup wizard step (icon + h2 + subtitle). */
export function StepHeader({ icon, title, subtitle, className = "space-y-2" }: StepHeaderProps) {
    return (
        <div className={className}>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-helios-ink">
                {icon}
                {title}
            </h2>
            <p className="text-sm leading-relaxed text-helios-slate">{subtitle}</p>
        </div>
    );
}

interface ReviewCardProps {
    title: string;
    lines: string[];
}

export function ReviewCard({ title, lines }: ReviewCardProps) {
    return (
        <div className="rounded-lg border border-helios-line/20 bg-helios-surface-soft/40 px-5 py-5">
            <div className="text-xs font-medium text-helios-slate/70 pb-2 mb-2 border-b border-helios-line/20">
                {title}
            </div>
            <div className="mt-3 space-y-2">
                {lines.map((line) => (
                    <p key={line} className="text-sm text-helios-slate break-words">
                        {line}
                    </p>
                ))}
            </div>
        </div>
    );
}
