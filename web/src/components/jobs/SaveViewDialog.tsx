import { useRef, type FormEvent } from "react";
import { X } from "lucide-react";
import Modal from "../ui/Modal";

interface SaveViewDialogProps {
    open: boolean;
    name: string;
    submitting: boolean;
    /** Existing saved-view labels, used for inline duplicate detection. */
    existingLabels: string[];
    onNameChange: (value: string) => void;
    onClose: () => void;
    onSubmit: () => Promise<void>;
}

/**
 * Themed, focus-trapped replacement for the native `window.prompt` previously
 * used to name a saved job view. Matches the EnqueuePathDialog pattern: Esc to
 * cancel, Enter to submit, with inline required/duplicate validation.
 */
export function SaveViewDialog({
    open,
    name,
    submitting,
    existingLabels,
    onNameChange,
    onClose,
    onSubmit,
}: SaveViewDialogProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const trimmed = name.trim();
    const isDuplicate = existingLabels.some(
        (label) => label.toLowerCase() === trimmed.toLowerCase(),
    );
    const validationError = isDuplicate ? "A saved view with this name already exists." : null;
    const canSubmit = trimmed.length > 0 && !validationError && !submitting;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit) return;
        await onSubmit();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            labelledBy="save-view-title"
            maxWidth="max-w-md"
            panelClassName="rounded-xl"
            initialFocusRef={inputRef}
            disableClose={submitting}
            zIndexBase={110}
        >
            <form
                onSubmit={(event) => void handleSubmit(event)}
                className="contents"
            >
                <div className="flex items-start justify-between gap-4 border-b border-helios-line/10 bg-helios-surface-soft/50 px-6 py-5">
                    <div>
                        <h2 id="save-view-title" className="text-lg font-bold text-helios-ink">Save view</h2>
                        <p className="mt-1 text-sm text-helios-slate">
                            Save the current tab, sort, and search as a reusable view.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-md p-2 text-helios-slate transition-colors hover:bg-helios-line/10 disabled:opacity-50"
                        aria-label="Close save view dialog"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-2 px-6 py-5">
                    <label htmlFor="save-view-name" className="block text-xs font-semibold uppercase tracking-wide text-helios-slate">
                        View name
                    </label>
                    <input
                        id="save-view-name"
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(event) => onNameChange(event.target.value)}
                        placeholder="e.g. Large HEVC remuxes"
                        maxLength={60}
                        aria-invalid={Boolean(validationError)}
                        className="w-full rounded-lg border border-helios-line/20 bg-helios-surface px-4 py-3 text-sm text-helios-ink outline-none focus:border-helios-solar"
                    />
                    {validationError && (
                        <p className="text-xs text-status-error" role="alert">{validationError}</p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-helios-line/10 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-lg border border-helios-line/20 px-4 py-2 text-sm font-semibold text-helios-slate transition-colors hover:bg-helios-surface-soft disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="rounded-lg bg-helios-solar px-4 py-2 text-sm font-bold text-helios-main transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Saving..." : "Save view"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
