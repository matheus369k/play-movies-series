import { MoviesAndSeriesInFocus } from "./components/focus-movies-series";
import { SectionMoviesAndSeries } from "./components/section-movies-series";

export function Home() {
    function randowYearNumber() {
        const page = Math.floor(Math.random() * 25);
        return 2000 + page;
    }

    return (
        <section className="flex flex-col gap-6">
            <MoviesAndSeriesInFocus />
            <SectionMoviesAndSeries year={2023} page={1} title="Lançamentos" type=""/>
            <SectionMoviesAndSeries year={randowYearNumber()} page={1} title="Recomendados" type=""/>
            <SectionMoviesAndSeries year={randowYearNumber()} page={1} title="Filmes" type="movie"/>
            <SectionMoviesAndSeries year={randowYearNumber()} page={1} title="Series" type="series"/>
        </section>
    )
}