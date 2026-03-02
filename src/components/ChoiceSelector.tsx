import { cn } from "@/lib/utils";

export interface Choice {
    id: string;
    text: string;
    healthImpact: number;
}

interface ChoiceSelectorProps {
    choices: Choice[];
    onSelect: (choice: Choice) => void;
    disabled?: boolean;
}

export default function ChoiceSelector({ choices, onSelect, disabled = false }: ChoiceSelectorProps) {
    if (choices.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 mt-12 mb-8 max-w-2xl mx-auto font-sans">
            <h3 className="text-sm uppercase tracking-widest text-[var(--color-primary)] mb-2 font-semibold">
                What do you do?
            </h3>
            {choices.map((choice) => (
                <button
                    key={choice.id}
                    onClick={() => onSelect(choice)}
                    disabled={disabled}
                    className={cn(
                        "p-4 text-left border rounded-lg transition-all duration-200",
                        "border-[var(--color-primary)] opacity-80 hover:opacity-100",
                        "hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-primary)]",
                        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-inherit"
                    )}
                >
                    {choice.text}
                </button>
            ))}
        </div>
    );
}
