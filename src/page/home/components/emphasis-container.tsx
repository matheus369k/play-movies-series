export default function EmphasisContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[60vh] max-lg:min-h-[40vh] p-1 my-2 after:bg-[url('../assets/bg-play-movies.webp')] after:bg-cover after:absolute after:top-0 after:left-0 after:size-full after:opacity-20 before:z-10 before:absolute before:bottom-0 before:left-0 before:size-full before:bg-gradient-to-t before:from-gray-950 before:to-transparent">
      {children}
    </div>
  );
}
