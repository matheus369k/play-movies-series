interface MovieCardProps {
  onlyImage?: boolean;
}

export function MovieCardLoading({ onlyImage }: MovieCardProps) {
  return (
    <li
      className={`flex flex-col items-center bg-gray-900 rounded border border-gray-800 max-w-52 max-sm:w-32 w-full animate-pulse ${
        onlyImage ? "" : " p-2"
      }`}
    >
      <div className="relative group/play z-50 rounded cursor-pointer aspect-[3/4] overflow-hidden min-h-full">
        <img
          src="https://placehold.co/225x300/111827/111827.png"
          loading="lazy"
          className="w-full h-full object-fill border-b border-b-gray-800 transition-all opacity-100 max-sm:border-none"
          alt={"movie: transformers"}
        />
      </div>
      {!onlyImage && (
        <>
          <h3 className="max-w-44 overflow-hidden text-center text-ellipsis text-nowrap text-sm max-sm:hidden max-sm:max-w-28">
            transformers
          </h3>
          <p className="text-center text-sm max-sm:hidden">
            <span>transformers </span>-<span> 2008</span>
          </p>
        </>
      )}
    </li>
  );
}
