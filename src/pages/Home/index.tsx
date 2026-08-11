import { useEffect, useState } from "react";
import { LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router";

import { AddSkillModal } from "@/components/skills/add-skill-modal";
import { CreateSkillModal } from "@/components/skills/create-skill-modal";
import { EmptyState } from "@/components/skills/empty-state";
import { SkillRow } from "@/components/skills/skill-row";
import { SkillsSkeleton } from "@/components/skills/skills-skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import { useToast } from "@/contexts/toastContext";
import {
    adicionarSkill,
    atualizarLevelSkill,
    atualizarSkill,
    criarSkill,
    listarSkillsDoUsuario,
    removerSkill,
    type UserSkill,
} from "@/services/skills-api";
import { ModeToggle } from "@/components/mode-toggle";
import type { CreateSkillFormData } from "@/validators/create-skill-schema";
import type { SkillFormData } from "@/validators/skill-schema";

export function HomePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { showToast } = useToast();

    const [skills, setSkills] = useState<UserSkill[]>([]);
    const [skillsLoading, setSkillsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<UserSkill | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(
        null,
    );

    useEffect(() => {
        if (!user) return;
        listarSkillsDoUsuario(user.usuarioId).then((mine) => {
            setSkills(mine);
            setSkillsLoading(false);
        });
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const changeLevel = async (id: number, delta: number) => {
        const current = skills.find((s) => s.id === id);
        if (!current) return;
        const newLevel = Math.max(1, Math.min(5, current.level + delta));
        if (newLevel === current.level) return;
        setSkills((prev) =>
            prev.map((s) => (s.id === id ? { ...s, level: newLevel } : s)),
        );
        await atualizarLevelSkill(id, newLevel);
    };

    const confirmDelete = async (id: number) => {
        await removerSkill(id);
        setSkills((prev) => prev.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
        showToast("success", "Skill removida.");
    };

    const openAddModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const saveModal = async (data: SkillFormData) => {
        if (!user) return;
        const created = await adicionarSkill(
            user.usuarioId,
            data.skillId,
            data.level,
        );
        setSkills((prev) => [...prev, created]);
        closeModal();
        showToast("success", "Skill adicionada!");
    };

    const openEditModal = (skill: UserSkill) => {
        setEditingSkill(skill);
        setCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
        setEditingSkill(null);
    };

    const saveCreateModal = async (data: CreateSkillFormData) => {
        if (!user) return;
        if (editingSkill) {
            const updatedSkill = await atualizarSkill(
                editingSkill.skillId,
                data.nome,
                data.descricao,
                data.imgUrl,
            );
            const updatedAssoc = await atualizarLevelSkill(
                editingSkill.id,
                data.level,
            );
            const updated: UserSkill = {
                id: updatedAssoc.id,
                skillId: updatedSkill.id,
                nome: updatedSkill.nome,
                descricao: updatedSkill.descricao,
                imgUrl: updatedSkill.imgUrl,
                level: updatedAssoc.level,
            };
            setSkills((prev) =>
                prev.map((s) => (s.id === updated.id ? updated : s)),
            );
            closeCreateModal();
            showToast("success", "Skill atualizada!");
        } else {
            const novaSkill = await criarSkill(
                data.nome,
                data.descricao,
                data.imgUrl,
            );
            const created = await adicionarSkill(
                user.usuarioId,
                novaSkill.id,
                data.level,
            );
            setSkills((prev) => [...prev, created]);
            closeCreateModal();
            showToast("success", "Skill criada!");
        }
    };

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
                    <div className="flex shrink-0 items-center gap-2.5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCreateModalOpen(true)}
                            className="h-auto gap-2 rounded-[9px] px-[18px] py-2.5 text-sm font-bold whitespace-nowrap text-[var(--foreground)]"
                        >
                            <Plus className="size-3.75" />
                            Criar Skill
                        </Button>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="flex items-center gap-2 rounded-[9px] bg-[var(--primary)] px-[18px] py-2.5 text-sm font-bold whitespace-nowrap text-white hover:bg-[var(--primary-hover)]"
                        >
                            <Plus className="size-[15px]" />
                            Adicionar Skill
                        </button>
                    </div>
                </div>

                {skillsLoading && <SkillsSkeleton />}

                {showEmptyState && <EmptyState onAdd={openAddModal} />}

                {showSkillsList && (
                    <div className="flex flex-col gap-3">
                        {skills.map((skill) => (
                            <SkillRow
                                key={skill.id}
                                skill={skill}
                                confirming={deleteConfirmId === skill.id}
                                onIncLevel={() => changeLevel(skill.id, 1)}
                                onDecLevel={() => changeLevel(skill.id, -1)}
                                onEdit={() => openEditModal(skill)}
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
                <AddSkillModal onClose={closeModal} onSave={saveModal} />
            )}

            {createModalOpen && (
                <CreateSkillModal
                    skill={editingSkill ?? undefined}
                    onClose={closeCreateModal}
                    onSave={saveCreateModal}
                />
            )}
        </div>
    );
}
