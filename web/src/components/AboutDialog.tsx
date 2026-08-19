import { useState, useEffect } from "react";
import { X, Terminal, Server, Cpu, Activity, ShieldCheck, Box, Download, RefreshCw, type LucideIcon } from "lucide-react";
import { apiJson, isApiError } from "../lib/api";
import { showToast } from "../lib/toast";
import Modal from "./ui/Modal";

interface SystemInfo {
    ffmpeg_version: string;
    is_docker: boolean;
    os_version: string;
    telemetry_enabled: boolean;
    version: string;
    cpu_count: number;
    total_memory_gb: number;
}

interface UpdateInfo {
    current_version: string;
    channel: "stable" | "rc" | "nightly";
    latest_version: string | null;
    release_url: string | null;
    update_available: boolean;
    install_type: "docker" | "homebrew" | "aur" | "source" | "direct_binary" | "windows_exe" | "unknown";
    can_self_update: boolean;
    action: "self_update" | "guided" | "unsupported";
    guidance: string | null;
    guidance_command: string | null;
    verification_status: "verified" | "public_key_unavailable" | "manifest_unavailable" | "failed";
    verification_error: string | null;
}

interface UpdateInstallResponse {
    install_state: "up_to_date" | "draining" | "restarting";
    message?: string;
    active_jobs?: number;
    status: UpdateInfo;
}

interface AboutDialogProps {
    isOpen: boolean;
    onClose: () => void;
    originRect?: DOMRect | null;
}

export default function AboutDialog({ isOpen, onClose, originRect }: AboutDialogProps) {
    const [info, setInfo] = useState<SystemInfo | null>(null);
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [installing, setInstalling] = useState(false);

    useEffect(() => {
        if (isOpen && !info) {
            apiJson<SystemInfo>("/api/system/info")
                .then(setInfo)
                .catch((e: unknown) => {
                    const message = isApiError(e) ? e.message : "Failed to load version info";
                    showToast({ kind: "error", title: "About", message });
                });
        }
    }, [isOpen, info]);

    useEffect(() => {
        if (isOpen && !updateInfo) {
            apiJson<UpdateInfo>("/api/system/update")
                .then(setUpdateInfo)
                .catch(() => {
                    // Non-critical; keep update checks soft-fail.
                });
        }
    }, [isOpen, updateInfo]);

    const refreshUpdateInfo = async () => {
        setUpdateLoading(true);
        try {
            const data = await apiJson<UpdateInfo>("/api/system/update/check", { method: "POST" });
            setUpdateInfo(data);
            showToast({ kind: "success", title: "Updates", message: "Update status refreshed." });
        } catch (error) {
            const message = isApiError(error) ? error.message : "Failed to check for updates.";
            showToast({ kind: "error", title: "Updates", message });
        } finally {
            setUpdateLoading(false);
        }
    };

    const installUpdate = async () => {
        setInstalling(true);
        try {
            const payload = await apiJson<UpdateInstallResponse>("/api/system/update/install", {
                method: "POST",
            });
            setUpdateInfo(payload.status);
            showToast({
                kind: payload.install_state === "draining" ? "info" : "success",
                title: "Updates",
                message: payload.message ?? "Update install started.",
                durationMs: 6000,
            });
        } catch (error) {
            const message = isApiError(error) ? error.message : "Failed to install update.";
            showToast({ kind: "error", title: "Updates", message });
        } finally {
            setInstalling(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            labelledBy="about-dialog-title"
            maxWidth="max-w-lg"
            panelClassName="rounded-xl border-helios-line/30 relative"
            originRect={originRect}
            zIndexBase={50}
        >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-helios-solar/10 to-transparent pointer-events-none" />

            <div className="p-8 relative">
                <div className="flex items-center justify-end mb-6">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-helios-surface-soft rounded-full text-helios-slate hover:text-helios-ink transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <h2 id="about-dialog-title" className="text-3xl font-extrabold text-helios-ink tracking-tight">Alchemist</h2>
                        {info && (
                            <span className="px-2 py-0.5 rounded-full bg-helios-solar/10 text-helios-solar text-[10px] font-bold uppercase tracking-wider border border-helios-solar/20">
                                v{info.version}
                            </span>
                        )}
                    </div>
                    <p className="text-helios-slate font-medium">Professional Media Transcoding Agent</p>
                </div>

                {info ? (
                    <div className="space-y-3">
                        <InfoRow icon={Terminal} label="Version" value={`v${info.version}`} />
                        <InfoRow icon={Activity} label="FFmpeg" value={info.ffmpeg_version} />
                        <InfoRow icon={Server} label="System" value={info.os_version} />
                        <InfoRow icon={Cpu} label="Hardware" value={`${info.cpu_count} Cores / ${info.total_memory_gb} GB RAM`} />
                        <InfoRow icon={Box} label="Environment" value={info.is_docker ? "Docker Container" : "Native Host"} />
                        <InfoRow icon={ShieldCheck} label="Telemetry" value={info.telemetry_enabled ? "Enabled" : "Disabled"} />
                        {updateInfo && (
                            <UpdatePanel
                                updateInfo={updateInfo}
                                updateLoading={updateLoading}
                                installing={installing}
                                onRefresh={refreshUpdateInfo}
                                onInstall={installUpdate}
                            />
                        )}
                    </div>
                ) : (
                    <div className="flex justify-center p-8">
                        <div className="w-6 h-6 border-2 border-helios-solar border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-helios-line/10 text-center">
                    <p className="text-xs text-helios-slate/60">
                        &copy; {new Date().getFullYear()} Alchemist Contributors. <br />
                        Released under AGPL-3.0 License.
                    </p>
                </div>
            </div>
        </Modal>
    );
}

interface UpdatePanelProps {
    updateInfo: UpdateInfo;
    updateLoading: boolean;
    installing: boolean;
    onRefresh: () => void;
    onInstall: () => void;
}

function titleCase(value: string | null | undefined): string {
    if (!value) return "Unknown";
    return value
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function UpdatePanel({ updateInfo, updateLoading, installing, onRefresh, onInstall }: UpdatePanelProps) {
    const statusLabel = updateInfo.update_available
        ? `v${updateInfo.latest_version ?? "unknown"} available`
        : updateInfo.latest_version
            ? "Current"
            : "No release found";
    const canInstall = updateInfo.update_available && updateInfo.can_self_update;

    return (
        <div className="rounded-xl bg-helios-surface-soft border border-helios-line/10 p-3">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-helios-slate">
                        {titleCase(updateInfo.channel)} Updates
                    </p>
                    <p className="text-sm font-bold text-helios-ink">{statusLabel}</p>
                    <p className="mt-1 text-xs text-helios-slate">
                        {titleCase(updateInfo.install_type)} install · {titleCase(updateInfo.verification_status)}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={updateLoading || installing}
                    className="rounded-lg border border-helios-line/20 p-2 text-helios-slate hover:text-helios-ink disabled:opacity-50"
                    aria-label="Check for updates"
                    title="Check for updates"
                >
                    <RefreshCw size={16} className={updateLoading ? "animate-spin" : ""} />
                </button>
            </div>

            {updateInfo.guidance && (
                <p className="mt-2 text-xs text-helios-slate">{updateInfo.guidance}</p>
            )}
            {updateInfo.guidance_command && (
                <code className="mt-2 block rounded-lg border border-helios-line/20 bg-helios-main/60 px-3 py-2 text-xs text-helios-ink break-all">
                    {updateInfo.guidance_command}
                </code>
            )}
            {updateInfo.verification_error && (
                <p className="mt-2 text-xs text-amber-500">{updateInfo.verification_error}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
                {canInstall && (
                    <button
                        type="button"
                        onClick={onInstall}
                        disabled={installing}
                        className="inline-flex items-center gap-2 rounded-lg bg-helios-solar px-3 py-2 text-xs font-bold text-helios-main hover:opacity-90 disabled:opacity-50"
                    >
                        <Download size={14} />
                        {installing ? "Starting..." : "Drain and Install"}
                    </button>
                )}
                {updateInfo.update_available && updateInfo.release_url && (
                    <a
                        href={updateInfo.release_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-helios-line/20 px-3 py-2 text-xs font-bold text-helios-ink hover:bg-helios-surface"
                    >
                        Release Notes
                    </a>
                )}
            </div>
        </div>
    );
}

interface InfoRowProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-helios-surface-soft border border-helios-line/5 hover:border-helios-line/20 hover:bg-helios-surface-soft/80 transition-all duration-200 group">
            <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-helios-slate/5 text-helios-slate group-hover:text-helios-solar transition-colors">
                    <Icon size={16} />
                </div>
                <span className="text-sm font-semibold text-helios-slate/80">{label}</span>
            </div>
            <span className="text-sm font-bold text-helios-ink font-mono break-all text-right max-w-[60%] selection:bg-helios-solar/30">{value}</span>
        </div>
    );
}
