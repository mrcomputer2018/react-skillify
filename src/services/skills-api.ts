import { api } from "@/services/api";

export type SkillOption = {
    id: number;
    nome: string;
    descricao: string;
    imgUrl?: string;
};

export type UserSkill = {
    id: number;
    skillId: number;
    nome: string;
    descricao: string;
    imgUrl?: string;
    level: number;
};

type LoginResponseDTO = {
    token: string;
    tipo: string;
    expiraEm: number;
    usuarioId: number;
    login: string;
};

type CadastroResponseDTO = {
    id: number;
    login: string;
    mensagem: string;
};

type SkillResponseDTO = {
    id: number;
    nome: string;
    descricao: string;
    urlImagem?: string;
};

type UsuarioSkillResponseDTO = {
    id: number;
    skillId: number;
    nomeSkill: string;
    descricaoSkill: string;
    urlImagemSkill?: string;
    level: number;
};

function toUserSkill(dto: UsuarioSkillResponseDTO): UserSkill {
    return {
        id: dto.id,
        skillId: dto.skillId,
        nome: dto.nomeSkill,
        descricao: dto.descricaoSkill,
        imgUrl: dto.urlImagemSkill || undefined,
        level: dto.level,
    };
}

export async function login(usuario: string, senha: string) {
    const { data } = await api.post<LoginResponseDTO>("/api/auth/login", {
        login: usuario,
        senha,
    });
    return {
        usuarioId: data.usuarioId,
        usuario: data.login,
        token: data.token,
    };
}

export async function cadastrar(usuario: string, senha: string) {
    const { data } = await api.post<CadastroResponseDTO>("/api/auth/cadastro", {
        login: usuario,
        senha,
    });
    return { usuario: data.login };
}

export async function listarCatalogoSkills(): Promise<SkillOption[]> {
    const { data } = await api.get<SkillResponseDTO[]>("/api/skills");
    return data.map((s) => ({
        id: s.id,
        nome: s.nome,
        descricao: s.descricao,
        imgUrl: s.urlImagem || undefined,
    }));
}

export async function listarSkillsDoUsuario(
    usuarioId: number,
): Promise<UserSkill[]> {
    const { data } = await api.get<UsuarioSkillResponseDTO[]>(
        `/api/usuario-skills/usuario/${usuarioId}`,
    );
    return data.map(toUserSkill);
}

export async function adicionarSkill(
    usuarioId: number,
    skillId: number,
    level: number,
): Promise<UserSkill> {
    const { data } = await api.post<UsuarioSkillResponseDTO>(
        "/api/usuario-skills",
        { usuarioId, skillId, level },
    );
    return toUserSkill(data);
}

export async function atualizarLevelSkill(
    associationId: number,
    level: number,
): Promise<UserSkill> {
    const { data } = await api.put<UsuarioSkillResponseDTO>(
        `/api/usuario-skills/${associationId}`,
        { level },
    );
    return toUserSkill(data);
}

export async function removerSkill(associationId: number): Promise<void> {
    await api.delete(`/api/usuario-skills/${associationId}`);
}
