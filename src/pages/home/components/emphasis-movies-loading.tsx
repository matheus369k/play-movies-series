import { ButtonPlay } from '@/components/button-play'
import { GrPrevious } from 'react-icons/gr'
import { GrNext } from 'react-icons/gr'
import { dbFocusData } from '@/data/movies-id'

export function EmphasisMoviesLoading() {
  return (
    <div className='relative max-w-7xl mx-auto w-full h-full flex items-center flex-col gap-16 z-40 justify-center px-2 pt-28'>
      <div className='flex flex-col gap-4 w-full items-center justify-between h-[28rem] md:h-[30rem]'>
        <div className='flex items-center flex-col gap-6 max-w-7xl text-zinc-500'>
          <div className='relative group/play text-zinc-100 bg-zinc-900 rounded-md w-max h-max z-40'>
            <img
              src='https://placehold.co/225x300/111827/111827.png'
              className='w-44 h-64 object-cover transition-all max-sm:w-32 max-sm:h-48'
            />
          </div>
          <p className='select-none font-bold text-center max-sm:text-sm text-zinc-900 bg-zinc-900'>
            <span>Genre: </span>
            Movie
            <span> - Release: </span>
            2008
            <span> - Note: </span>
            6.7
          </p>
          <p className='max-w-[80%] text-center font-normal w-full max-md:max-w-full max-sm:text-sm text-zinc-900 bg-zinc-900'>
            During the '90s, a new faction of Transformers - the Maximals - join
            the Autobots as allies in the battle for Earth.
          </p>
        </div>
        <div className='bg-zinc-900 rounded-full'>
          <ButtonPlay fluxDefault />
        </div>

        <div className='absolute left-0 top-1/2 -translate-y-1/2 flex justify-between w-full px-6 max-lg:px-2 max-sm:top-1/3 text-zinc-900'>
          <GrPrevious className='w-11 h-auto max-sm:size-8' />
          <GrNext className='w-11 h-auto max-sm:size-8' />
        </div>
      </div>

      <ul className='flex gap-4 flex-nowrap items-center w-fit mx-auto'>
        {dbFocusData.map((focusData) => {
          return (
            <li
              key={focusData.imdbid}
              className='w-2 h-2 rounded-full bg-zinc-900'
            />
          )
        })}
      </ul>
    </div>
  )
}
