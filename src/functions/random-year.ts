// Gerador de um ano aleatorio entre 2000 e 2025
export function randomYearNumber() {
    const page = Math.floor(Math.random() * 25);
    return 2000 + page;
}