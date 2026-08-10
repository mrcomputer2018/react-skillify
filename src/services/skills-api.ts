const DELAY = 700;

function delay(ms?: number) {
    return new Promise((resolve) => setTimeout(resolve, ms ?? DELAY));
}

export type SkillOption = {
    id: string;
    nome: string;
    descricao: string;
    imgUrl?: string;
};

export type UserSkill = SkillOption & {
    level: number;
};

export type NovaSkillInput = {
    nome: string;
    descricao: string;
    imgUrl?: string;
    level: number;
};

const USER_SKILLS_KEY = "skills_app_user_skills";

function loadUserSkills(): UserSkill[] {
    try {
        const raw = localStorage.getItem(USER_SKILLS_KEY);
        return raw ? (JSON.parse(raw) as UserSkill[]) : [];
    } catch {
        return [];
    }
}

function saveUserSkills(list: UserSkill[]) {
    localStorage.setItem(USER_SKILLS_KEY, JSON.stringify(list));
}

export async function login(usuario: string, senha: string) {
    await delay();
    if (!usuario || !senha) throw new Error("Preencha usuário e senha.");
    if (senha.length < 4) throw new Error("Usuário ou senha inválidos.");
    return { token: "mock-token-" + Date.now(), usuario };
}

export async function cadastrar(usuario: string) {
    await delay();
    if (usuario.toLowerCase() === "admin") throw new Error("Usuário já existe.");
    return { usuario };
}

export async function listarSkillsDoUsuario(): Promise<UserSkill[]> {
    await delay(500);
    return loadUserSkills();
}

export async function adicionarSkill(input: NovaSkillInput): Promise<UserSkill[]> {
    await delay();
    const list = loadUserSkills();
    const item: UserSkill = {
        id: crypto.randomUUID(),
        nome: input.nome,
        descricao: input.descricao,
        imgUrl: input.imgUrl || undefined,
        level: input.level,
    };
    list.push(item);
    saveUserSkills(list);
    return list;
}

export async function atualizarLevelSkill(skillId: string, level: number): Promise<UserSkill[]> {
    await delay(300);
    const list = loadUserSkills().map((s) =>
        s.id === skillId ? { ...s, level: Number(level) } : s,
    );
    saveUserSkills(list);
    return list;
}

export async function atualizarSkill(skillId: string, input: NovaSkillInput): Promise<UserSkill[]> {
    await delay();
    const list = loadUserSkills().map((s) =>
        s.id === skillId
            ? {
                  ...s,
                  nome: input.nome,
                  descricao: input.descricao,
                  imgUrl: input.imgUrl || undefined,
                  level: input.level,
              }
            : s,
    );
    saveUserSkills(list);
    return list;
}

export async function removerSkill(skillId: string): Promise<UserSkill[]> {
    await delay(300);
    const list = loadUserSkills().filter((s) => s.id !== skillId);
    saveUserSkills(list);
    return list;
}
