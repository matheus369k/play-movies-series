export function SearchMoreContainer(props: {
  children?: React.ReactNode
  isFetching: boolean
  title: string
}) {
  function RenderChildrenUI() {
    const isExistChildren = !!props.children

    if (isExistChildren) {
      return props.children
    }

    if (props.isFetching) {
      return (
        <p
          aria-label='loading'
          className='capitalize text-center justify-self-normal text-zinc-500'
        >
          loading...
        </p>
      )
    }

    return (
      <p
        aria-label='not found'
        className='capitalize text-center justify-self-normal text-zinc-500'
      >
        not found
      </p>
    )
  }

  return (
    <section className='flex flex-col px-2 gap-5 pt-24 max-w-7xl mx-auto min-h-screen h-fit w-full'>
      <span className='pl-3 border-l-4 border-l-red-600 rounded'>
        <h2 className='font-bold capitalize text-4xl max-lg:text-2xl'>
          {props.title}
        </h2>
      </span>

      {RenderChildrenUI()}
    </section>
  )
}
