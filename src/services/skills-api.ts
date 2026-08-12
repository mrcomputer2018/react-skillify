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

export type UserRole = "ADMIN" | "USER";

type LoginResponseDTO = {
    token: string;
    tipo: string;
    expiraEm: number;
    usuarioId: number;
    login: string;
    role: UserRole;
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
        role: data.role,
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

export async function criarSkill(
    nome: string,
    descricao: string,
    imgUrl?: string,
): Promise<SkillOption> {
    const { data } = await api.post<SkillResponseDTO>("/api/skills", {
        nome,
        descricao,
        urlImagem: imgUrl || undefined,
    });
    return {
        id: data.id,
        nome: data.nome,
        descricao: data.descricao,
        imgUrl: data.urlImagem || undefined,
    };
}

export async function atualizarSkill(
    skillId: number,
    nome: string,
    descricao: string,
    imgUrl?: string,
): Promise<SkillOption> {
    const { data } = await api.put<SkillResponseDTO>(`/api/skills/${skillId}`, {
        nome,
        descricao,
        urlImagem: imgUrl || undefined,
    });
    return {
        id: data.id,
        nome: data.nome,
        descricao: data.descricao,
        imgUrl: data.urlImagem || undefined,
    };
}

export async function listarSkillsDoUsuario(): Promise<UserSkill[]> {
    const { data } = await api.get<UsuarioSkillResponseDTO[]>(
        "/api/usuario-skills",
    );
    return data.map(toUserSkill);
}

export async function adicionarSkill(
    skillId: number,
    level: number,
): Promise<UserSkill> {
    const { data } = await api.post<UsuarioSkillResponseDTO>(
        "/api/usuario-skills",
        { skillId, level },
    );
    return toUserSkill(data);
}

export async function atualizarLevelSkill(
    skillId: number,
    level: number,
): Promise<UserSkill> {
    const { data } = await api.put<UsuarioSkillResponseDTO>(
        `/api/usuario-skills/${skillId}`,
        { level },
    );
    return toUserSkill(data);
}

export async function deletarSkill(skillId: number): Promise<void> {
    await api.delete(`/api/skills/${skillId}`);
}
