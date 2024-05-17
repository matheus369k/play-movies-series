import { Emphasis } from "./components/emphasis";
import { CategorySection } from "../components/category-section";
import { randomYearNumber } from "../functions/random-year";

export function Home() {
    return (
        <section className="flex flex-col gap-6">
            <Emphasis />
            <CategorySection year={2024} page={1} title="Lançamentos" type="" />
            <CategorySection year={randomYearNumber()} page={1} title="Recomendados" type="" />
            <CategorySection year={randomYearNumber()} page={1} title="Filmes" type="movie" />
            <CategorySection year={randomYearNumber()} page={1} title="Series" type="series" />
        </section>
    )
}