export function randomYearNumber() {
    const page = Math.floor(Math.random() * 25);
    console.log(page);
    return 2000 + page;
}