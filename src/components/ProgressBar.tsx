interface ProgressBarProps {
    chapter: number;
    maxChapters?: number;
}

export default function ProgressBar({ chapter, maxChapters = 12 }: ProgressBarProps) {
    // Cap at 100% just in case
    const progress = Math.min((chapter / maxChapters) * 100, 100);

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 mb-4">
            <div className="flex justify-between items-center mb-1 text-xs font-sans text-[var(--color-primary)] opacity-70">
                <span>Chapter {chapter}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 w-full bg-[var(--color-primary)] bg-opacity-20 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[var(--color-primary)] transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
