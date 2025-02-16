import { CategorySection } from "@/components/category-section";
import { randomYearNumber } from "@/functions";
import { lazy, Suspense } from "react";
import { EmphasisLoading } from "./components/emphasis-loading";
import { MORE_ROUTES } from "@/router/path-routes";

// Permitir o uso do Suspense API
const EmphasisLazy = lazy(() => import("./components/emphasis"));
const EmphasisContainer = lazy(() => import("./components/emphasis-container"));

export function Home() {
  return (
    <section className="flex flex-col gap-6 max-xl:px-4">
      <Suspense fallback={<EmphasisLoading />}>
        <EmphasisContainer>
          <EmphasisLazy />
        </EmphasisContainer>
      </Suspense>
      <div className="flex flex-col gap-8">
        <CategorySection
          year={2024}
          page={1}
          title={MORE_ROUTES.RELEASE.title}
          type=""
        />
        <CategorySection
          year={randomYearNumber()}
          page={1}
          title={MORE_ROUTES.RECOMMENDATION.title}
          type=""
        />
        <CategorySection
          year={randomYearNumber()}
          page={1}
          title={MORE_ROUTES.MOVIES.title}
          type="movie"
        />
        <CategorySection
          year={randomYearNumber()}
          page={1}
          title={MORE_ROUTES.SERIES.title}
          type="series"
        />
      </div>
    </section>
  );
}
