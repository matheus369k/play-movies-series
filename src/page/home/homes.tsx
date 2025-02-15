import { CategorySection } from "@/components/category-section";
import { randomYearNumber } from "@/functions";
import { lazy, Suspense } from "react";
import { EmphasisLoading } from "./components/emphasis-loading";

// Permitir o uso do Suspense API
const EmphasisLazy = lazy(()=> import("./components/emphasis"))

export function Home() {
  return (
    <section className="flex flex-col gap-6 max-xl:px-4">
      <Suspense fallback={<EmphasisLoading />}>
        <EmphasisLazy />
      </Suspense>
      <div className="flex flex-col gap-8">
        <CategorySection year={2024} page={1} title="Release" type="" />
        <CategorySection
          year={randomYearNumber()}
          page={1}
          title="Recommendation"
          type=""
        />
        <CategorySection
          year={randomYearNumber()}
          page={1}
          title="Movies"
          type="movie"
        />
        <CategorySection
          year={randomYearNumber()}
          page={1}
          title="Series"
          type="series"
        />
      </div>
    </section>
  );
}
