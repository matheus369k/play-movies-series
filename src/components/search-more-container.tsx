export function SearchMoreContainer({
  children,
  isFetching,
  title,
}: {
  children?: React.ReactNode;
  isFetching: boolean;
  title: string;
}) {
  return (
    <section className="flex flex-col px-2 gap-5 pt-32 max-w-7xl mx-auto min-h-screen h-fit w-full">
      <span className="pl-3 border-l-4 border-l-red-600 rounded">
        <h2 className="font-bold capitalize text-4xl max-lg:text-2xl">
          {title}
        </h2>
      </span>

      {children && <>{children}</>}

      {!children && !isFetching && (
        <p className="capitalize text-center justify-self-normal text-zinc-500">
          not found
        </p>
      )}

      {isFetching && (
        <p className="capitalize text-center justify-self-normal text-zinc-500">
          carregando...
        </p>
      )}
    </section>
  );
}
