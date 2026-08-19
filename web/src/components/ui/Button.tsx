import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost-danger";
    fullWidth?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-helios-solar text-helios-main hover:brightness-110",
    secondary: "border border-helios-line/20 bg-helios-surface text-helios-slate hover:bg-helios-surface-soft",
    danger: "bg-status-error/20 text-status-error hover:bg-status-error/30",
    "ghost-danger": "text-status-error hover:bg-status-error/5",
};

export default function Button({ variant = "primary", fullWidth = false, className, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
                variantClasses[variant],
                fullWidth && "w-full",
                className,
            )}
        />
    );
}
