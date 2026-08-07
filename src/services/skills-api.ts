const DELAY = 700;

function delay(ms?: number) {
    return new Promise((resolve) => setTimeout(resolve, ms ?? DELAY));
}

export type SkillOption = {
    id: string;
    nome: string;
    descricao: string;
};

export type UserSkill = SkillOption & {
    level: number;
};

const AVAILABLE_SKILLS: SkillOption[] = [
    { id: "js", nome: "JavaScript", descricao: "Linguagem de programação para a web." },
    { id: "react", nome: "React", descricao: "Biblioteca para construção de interfaces." },
    { id: "node", nome: "Node.js", descricao: "Runtime JavaScript no lado do servidor." },
    { id: "python", nome: "Python", descricao: "Linguagem versátil para dados e backend." },
    { id: "design", nome: "UI/UX Design", descricao: "Design de interfaces e experiência do usuário." },
    { id: "sql", nome: "SQL", descricao: "Consulta e modelagem de bancos de dados." },
    { id: "docker", nome: "Docker", descricao: "Containerização de aplicações." },
    { id: "aws", nome: "AWS", descricao: "Serviços de nuvem da Amazon." },
];

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

export async function listarSkillsDisponiveis(): Promise<SkillOption[]> {
    await delay(400);
    return AVAILABLE_SKILLS;
}

export async function listarSkillsDoUsuario(): Promise<UserSkill[]> {
    await delay(500);
    return loadUserSkills();
}

export async function adicionarSkill(skillId: string, level: number): Promise<UserSkill[]> {
    await delay();
    const base = AVAILABLE_SKILLS.find((s) => s.id === skillId);
    if (!base) throw new Error("Skill inválida.");
    const list = loadUserSkills();
    if (list.some((s) => s.id === skillId)) throw new Error("Skill já adicionada.");
    const item: UserSkill = { ...base, level: Number(level) || 1 };
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

export async function removerSkill(skillId: string): Promise<UserSkill[]> {
    await delay(300);
    const list = loadUserSkills().filter((s) => s.id !== skillId);
    saveUserSkills(list);
    return list;
}
