import { Emphasis } from "./components/emphasis";
import { CategorySection } from "../components/category-section";
import { randomYearNumber } from "../functions/random-year";

export function Home() {
    return (
        <section className="flex flex-col gap-6 max-xl:px-4">
            <Emphasis />
            <div className="flex flex-col gap-8">
            <CategorySection year={2024} page={1} title="Release" type="" />
            <CategorySection year={randomYearNumber()} page={1} title="Recommendation" type="" />
            <CategorySection year={randomYearNumber()} page={1} title="Movies" type="movie" />
            <CategorySection year={randomYearNumber()} page={1} title="Series" type="series" />
            </div>
        </section>
    )
}