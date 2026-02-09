export function NotFound({
  text,
  code = 404,
}: {
  code?: number
  text: string
}) {
  return (
    <div className='flex justify-center items-center bg-zinc-950 text-zinc-100 min-h-screen font-inter tracking-wider'>
      <div className='flex gap-x-4 items-center p-6 bg-zinc-900 rounded-xl border-2 border-zinc-800'>
        <img src={'play.png'} alt='logo' className='size-20' />
        <div>
          <h1 className='text-4xl font-bold'>{code}</h1>
          <p className='capitalize text-xl text-zinc-200 font-semibold'>
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}
