const PALETTE = [
    "#4f7efe",
    "#4fbffe",
    "#7a6ef0",
    "#4fd1b3",
    "#f0a64f",
    "#f04f8b",
];

export function getSkillColor(id: number | string) {
    const key = String(id);
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return PALETTE[hash % PALETTE.length];
}
