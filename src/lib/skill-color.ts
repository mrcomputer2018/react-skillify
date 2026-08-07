const PALETTE = [
    "#4f7efe",
    "#4fbffe",
    "#7a6ef0",
    "#4fd1b3",
    "#f0a64f",
    "#f04f8b",
];

export function getSkillColor(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return PALETTE[hash % PALETTE.length];
}
