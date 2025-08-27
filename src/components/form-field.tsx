import type { ComponentProps } from 'react'
import { useFormContext } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface FormFieldRootProps extends ComponentProps<'div'> {
  isError?: boolean
}

export function FormFieldRoot({
  isError = false,
  className,
  ...props
}: FormFieldRootProps) {
  return (
    <div
      data-is-error={isError}
      className={twMerge(
        'relative flex justify-between h-10 items-center rounded-3xl border border-zinc-500 overflow-hidden focus-within:text-zinc-50 focus-within:border-zinc-50 data-[is-error=true]:text-red-600 data-[is-error=true]:border-red-600',
        className
      )}
      {...props}
    />
  )
}

interface FormFieldInputProps extends ComponentProps<'input'> {
  fieldName: string
}

export function FormFieldInput({
  className,
  fieldName,
  ...props
}: FormFieldInputProps) {
  const { register } = useFormContext()
  return (
    <input
      className={twMerge(
        'bg-transparent placeholder:text-zinc-500 text-sm focus:ring-0 focus:outline-none w-full h-full py-2 pl-4 rounded-3xl',
        className
      )}
      {...register(fieldName)}
      {...props}
    />
  )
}

export function FormFieldIcon({ className, ...props }: ComponentProps<'i'>) {
  return (
    <i
      className={twMerge(
        'absolute top-1/2 right-4 -translate-y-1/2',
        className
      )}
      {...props}
    />
  )
}
