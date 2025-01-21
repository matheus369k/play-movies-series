export function randomYearNumber() {
    const page = Math.floor(Math.random() * 25);
    return 2000 + page;
}