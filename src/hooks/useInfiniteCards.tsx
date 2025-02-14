import { SearchContext } from "@/context/search-context";
import { fetchManyOmbdapi } from "@/services/fetch-omdbapi";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useRef } from "react";
import { getUrlParams } from "@/functions";

export function useInfiniteCards({ page }: { page: "more" | "search" }) {
  const { search } = useContext(SearchContext);
  const isSearchPage = page === "search";

  // Parametros que controlam a paginação infinita
  const PagesRef = useRef({
    currentPage: 1,
    totalPages: 1,
  });

  // Parametros que controlam a busca de dados
  const QueryRef = useRef({
    type: getUrlParams("type") || "",
    year: getUrlParams("year") || "",
    title: getUrlParams("title")?.replace("+", " ") || "Random",
  });

  // Trocar o title da url para o valor do context search, se for uma pagina de busca
  if (isSearchPage) {
    QueryRef.current = {
      ...QueryRef.current,
      title: search,
    };
  }

  // Requisição para os dados da API
  const { data, isFetching, refetch } = useQuery({
    queryFn: async () =>
      await fetchManyOmbdapi({
        params: `?s=${search}&type=${QueryRef.current.type}&y=${QueryRef.current.year}&page=${PagesRef.current.currentPage}`,
      }),
    queryKey: [QueryRef.current.title],
    // Limitar o refresh da requisição, a função do mesmo nome, apos a primeira requisição bem sucedida.
    enabled: PagesRef.current.totalPages === 1,
    onSuccess: (data) => {
      PagesRef.current = {
        currentPage: PagesRef.current.currentPage + 1,
        totalPages: Number(data?.totalResults ?? 1),
      };
    },
    structuralSharing(oldData, newData) {
      // Se não tiver dados anteriores, retorna o novo
      if (!oldData) return newData;
      if (!newData) return oldData;

      // Coletar os ids dos últimos filmes
      const oldDataLastId = oldData.Search[oldData.Search.length - 1].imdbID;
      const newDataLastId = newData.Search[newData.Search.length - 1].imdbID;

      // Se os ids forem iguais, não fazer nada
      if (oldDataLastId === newDataLastId) return oldData;

      // Retornar os dados antigos + novos
      return {
        ...oldData,
        Search: [...oldData.Search, ...newData.Search],
      };
    },
  });

  // Fazer um nova busca quando for chamada
  function handleFetchMoreData() {
    const { currentPage, totalPages } = PagesRef.current;
    const isFirstLoadPage = totalPages === 1;
    const isLastPage = currentPage * 10 >= totalPages;

    if (isLastPage && isFirstLoadPage) return;
    if (isFetching) return;

    refetch();
  }

  // Resetar os dados quando for feito uma nova busca
  useEffect(() => {
    if (isSearchPage) {
      PagesRef.current = {
        currentPage: 1,
        totalPages: 1,
      };
    }
    
    const isFirstLoadPage = PagesRef.current.totalPages === 1;

    if (isFirstLoadPage && isSearchPage && !isFetching) {
      QueryRef.current = {
        title: search,
        type: "",
        year: "",
      };

      refetch();
    }
  }, [search]);

  return {
    title: QueryRef.current.title,
    handleFetchMoreData,
    isFetching,
    data,
  };
}
