export function NotFound({ text, code = 404 }: { code?: number; text: string }) {
  return (
    <div className="flex justify-center items-center bg-gray-950 text-gray-100 min-h-screen font-inter tracking-wider">
      <div className="flex gap-x-4 items-center p-6 bg-gray-900 rounded-xl border-2 border-gray-800">
        <img src="./public/play.png" alt="logo" className="size-20" />
        <div>
          <h1 className="text-4xl font-bold">{code}</h1>
          <p className="capitalize text-xl text-gray-200 font-semibold">{text}</p>
        </div>
      </div>
    </div>
  );
}
