// Salvando um valor
// Uso: await storeData('themePreference', 'dark')
// Uso: await storeData('email', 'yan.m.esteves@gmail.com')
export const storeData = async (key: string, value: unknown) => {
    try {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error("Falha ao salvar objeto", e);
    }
};

// Lendo um valor
// Uso: const themePreference = await getData('themePreference')
// Uso: const email = await getData('email')
export const getData = async (key: string) => {
    try {
        const jsonValue = localStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("Falha ao recuperar dados", e);
    }
};

// Remover um valor
// Uso: removeData('themePreference')
export const removeData = async (key: string) => {
    try {
        localStorage.removeItem(key);
        console.log("Dados removidos");
    } catch (e) {
        // erro ao remover
        console.error("Falha ao remover dados", e);
    }
};

// Uso: clearData()
export const clearData = async () => {
    try {
        localStorage.clear();
        console.log("Dados limpos");
    } catch (e) {
        // erro ao remover
        console.error("Falha ao limpar dados", e);
    }
};
