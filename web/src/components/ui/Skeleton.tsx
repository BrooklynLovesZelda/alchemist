import { cn } from "../../lib/cn";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return <div className={cn("rounded-lg bg-helios-surface-soft/60 animate-pulse", className)} />;
}

interface SkeletonListProps {
    count?: number;
    itemClassName?: string;
    className?: string;
}

export default function SkeletonList({ count = 3, itemClassName = "h-12 w-full", className }: SkeletonListProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} className={itemClassName} />
            ))}
        </div>
    );
}
