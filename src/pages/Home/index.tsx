import { useEffect, useState } from "react";
import { LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router";

import { AddSkillModal } from "@/components/skills/add-skill-modal";
import { EmptyState } from "@/components/skills/empty-state";
import { SkillRow } from "@/components/skills/skill-row";
import { SkillsSkeleton } from "@/components/skills/skills-skeleton";
import { useAuth } from "@/contexts/authContext";
import { useToast } from "@/contexts/toastContext";
import {
    adicionarSkill,
    atualizarLevelSkill,
    listarSkillsDisponiveis,
    listarSkillsDoUsuario,
    removerSkill,
    type SkillOption,
    type UserSkill,
} from "@/services/skills-api";
import { ModeToggle } from "@/components/mode-toggle";

export function HomePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { showToast } = useToast();

    const [skills, setSkills] = useState<UserSkill[]>([]);
    const [availableSkills, setAvailableSkills] = useState<SkillOption[]>([]);
    const [skillsLoading, setSkillsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(
        null,
    );

    useEffect(() => {
        Promise.all([listarSkillsDisponiveis(), listarSkillsDoUsuario()]).then(
            ([avail, mine]) => {
                setAvailableSkills(avail);
                setSkills(mine);
                setSkillsLoading(false);
            },
        );
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const changeLevel = async (id: string, delta: number) => {
        const current = skills.find((s) => s.id === id);
        if (!current) return;
        const newLevel = Math.max(1, Math.min(10, current.level + delta));
        if (newLevel === current.level) return;
        setSkills((prev) =>
            prev.map((s) => (s.id === id ? { ...s, level: newLevel } : s)),
        );
        await atualizarLevelSkill(id, newLevel);
    };

    const confirmDelete = async (id: string) => {
        const list = await removerSkill(id);
        setSkills(list);
        setDeleteConfirmId(null);
        showToast("success", "Skill removida.");
    };

    const saveModal = async (skillId: string, level: number) => {
        const list = await adicionarSkill(skillId, level);
        setSkills(list);
        setModalOpen(false);
        showToast("success", "Skill adicionada!");
    };

    const modalOptions = availableSkills.filter(
        (a) => !skills.some((s) => s.id === a.id),
    );
    const showEmptyState = !skillsLoading && skills.length === 0;
    const showSkillsList = !skillsLoading && skills.length > 0;

    return (
        <div className="flex min-h-screen w-full flex-col bg-[var(--background)]">
            <header className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-6 py-[22px] sm:px-10">
                <div className="flex items-center gap-2.5">
                    <div className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]">
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="#ffffff"
                        >
                            <polygon points="13,2 3,14 11,14 9,22 21,9 13,9" />
                        </svg>
                    </div>
                    <span className="text-[17px] font-bold text-[var(--foreground)]">
                        Skillify
                    </span>
                </div>
                <div className="flex items-center gap-[18px]">
                    <span className="hidden text-[13px] text-[var(--muted-foreground)] sm:inline">
                        Olá, {user?.usuario}
                    </span>
                    <ModeToggle />
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[#eaf1ff] px-4 py-2.5 text-[13px] font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[#dce8ff] dark:bg-transparent dark:hover:bg-[var(--input-bg-nested)]"
                    >
                        <LogOut className="size-3.5" />
                        Sair
                    </button>
                </div>
            </header>

            <div className="mx-auto w-full max-w-[920px] flex-1 px-6 pt-9 pb-[60px] sm:px-10">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <div className="text-[22px] font-extrabold text-[var(--foreground)]">
                            Minhas Skills
                        </div>
                        <div className="mt-1 text-[13px] text-[var(--muted-foreground)]">
                            Gerencie as habilidades do seu perfil
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="flex shrink-0 items-center gap-2 rounded-[9px] bg-[var(--primary)] px-[18px] py-2.5 text-sm font-bold whitespace-nowrap text-white hover:bg-[var(--primary-hover)]"
                    >
                        <Plus className="size-[15px]" />
                        Adicionar Skill
                    </button>
                </div>

                {skillsLoading && <SkillsSkeleton />}

                {showEmptyState && (
                    <EmptyState onAdd={() => setModalOpen(true)} />
                )}

                {showSkillsList && (
                    <div className="flex flex-col gap-3">
                        {skills.map((skill) => (
                            <SkillRow
                                key={skill.id}
                                skill={skill}
                                confirming={deleteConfirmId === skill.id}
                                onIncLevel={() => changeLevel(skill.id, 1)}
                                onDecLevel={() => changeLevel(skill.id, -1)}
                                onAskDelete={() =>
                                    setDeleteConfirmId(skill.id)
                                }
                                onCancelDelete={() =>
                                    setDeleteConfirmId(null)
                                }
                                onConfirmDelete={() =>
                                    confirmDelete(skill.id)
                                }
                            />
                        ))}
                    </div>
                )}
            </div>

            {modalOpen && (
                <AddSkillModal
                    options={modalOptions}
                    onClose={() => setModalOpen(false)}
                    onSave={saveModal}
                />
            )}
        </div>
    );
}
