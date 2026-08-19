import { useId, type KeyboardEvent, type ReactNode } from "react";
import clsx from "clsx";

interface RangeControlProps {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
    valueLabel?: string;
    helperText?: string;
    disabled?: boolean;
}

interface LabeledInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    helperText?: string;
    error?: string;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

interface LabeledSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    disabled?: boolean;
    helperText?: string;
}

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
}

interface ToggleRowProps {
    title: string;
    body: string | ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
    disabled?: boolean;
}

export function RangeControl({ label, min, max, step, value, onChange, valueLabel, helperText, disabled = false }: RangeControlProps) {
    const inputId = useId();
    const helperId = useId();
    return (
        <div className={clsx("space-y-2", disabled && "opacity-60")}>
            <div className="flex items-center justify-between gap-3">
                <label htmlFor={inputId} className="text-xs font-medium text-helios-slate">{label}</label>
                <span className="rounded-md border border-helios-line/20 bg-helios-surface-soft px-2 py-1 text-xs font-semibold text-helios-ink">
                    {valueLabel ?? value}
                </span>
            </div>
            <input
                id={inputId}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                disabled={disabled}
                aria-describedby={helperText ? helperId : undefined}
                className="h-1.5 w-full cursor-pointer accent-helios-solar disabled:cursor-not-allowed"
            />
            {helperText && <p id={helperId} className="text-xs leading-relaxed text-helios-slate">{helperText}</p>}
        </div>
    );
}

export function LabeledInput({ label, value, onChange, placeholder, type = "text", disabled = false, helperText, error, onKeyDown }: LabeledInputProps) {
    const inputId = useId();
    const helperId = useId();
    const errorId = useId();
    return (
        <div className={clsx("space-y-2", disabled && "opacity-60")}>
            <label htmlFor={inputId} className="text-xs font-medium text-helios-slate">{label}</label>
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={error ? true : undefined}
                aria-describedby={clsx(error && errorId, helperText && helperId) || undefined}
                className={clsx(
                    "w-full rounded-md border bg-helios-surface-soft px-4 py-3 text-helios-ink outline-none focus:ring-1 disabled:cursor-not-allowed",
                    error
                        ? "border-status-error/60 focus:border-status-error focus:ring-status-error"
                        : "border-helios-line/20 focus:border-helios-solar focus:ring-helios-solar"
                )}
            />
            {error && <p id={errorId} className="text-xs font-medium text-status-error">{error}</p>}
            {helperText && <p id={helperId} className="text-xs leading-relaxed text-helios-slate">{helperText}</p>}
        </div>
    );
}

export function LabeledSelect({ label, value, onChange, options, disabled = false, helperText }: LabeledSelectProps) {
    const inputId = useId();
    const helperId = useId();
    return (
        <div className={clsx("space-y-2", disabled && "opacity-60")}>
            <label htmlFor={inputId} className="text-xs font-medium text-helios-slate">{label}</label>
            <select
                id={inputId}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                aria-describedby={helperText ? helperId : undefined}
                className="w-full rounded-md border border-helios-line/20 bg-helios-surface-soft px-4 py-3 text-helios-ink outline-none focus:border-helios-solar focus:ring-1 focus:ring-helios-solar disabled:cursor-not-allowed"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {helperText && <p id={helperId} className="text-xs leading-relaxed text-helios-slate">{helperText}</p>}
        </div>
    );
}

/** Bare pill switch. Use inside a card/row you build yourself; use `ToggleRow` for the common title+description+switch card. */
export function ToggleSwitch({ checked, onChange, disabled = false, label }: ToggleSwitchProps) {
    return (
        <label className={clsx("relative inline-flex items-center", disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                aria-label={label}
                className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-helios-line/20 peer-focus-visible:ring-2 peer-focus-visible:ring-helios-solar peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-helios-surface peer-checked:bg-helios-solar after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-helios-ink after:bg-helios-ink after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-helios-ink" />
        </label>
    );
}

/** Bordered card with a title, description, switch, and optional revealed children when checked. */
export function ToggleRow({ title, body, checked, onChange, children, disabled = false }: ToggleRowProps) {
    return (
        <div className={clsx("rounded-lg border border-helios-line/20 bg-helios-surface-soft/40 px-4 py-4", disabled && "opacity-70")}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-helios-ink">{title}</p>
                    <p className="mt-1 text-xs text-helios-slate">{body}</p>
                </div>
                <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled} label={title} />
            </div>
            {children && <div className="mt-3 border-t border-helios-line/10 pt-3">{children}</div>}
        </div>
    );
}
