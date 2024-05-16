import { Emphasis } from "./components/emphasis";
import { CategorySection } from "../components/category-section";

export function Home() {
    function randowYearNumber() {
        const page = Math.floor(Math.random() * 25);
        return 2000 + page;
    }

    return (
        <section className="flex flex-col gap-6">
            <Emphasis />
            <CategorySection year={2024} page={1} title="Lançamentos" type="" />
            <CategorySection year={randowYearNumber()} page={1} title="Recomendados" type="" />
            <CategorySection year={randowYearNumber()} page={1} title="Filmes" type="movie" />
            <CategorySection year={randowYearNumber()} page={1} title="Series" type="series" />
        </section>
    )
}