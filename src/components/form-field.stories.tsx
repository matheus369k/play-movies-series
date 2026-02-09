import { Meta, StoryObj, StoryFn } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { FormFieldInput, FormFieldIcon, FormFieldRoot } from './form-field'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Form } from './ui/form'
import { useForm } from 'react-hook-form'
import { Fragment, type ReactNode } from 'react'
import { Mail } from 'lucide-react'

const UserSchema = z.object({
  userName: z.string().min(3).max(64),
})

const FormFieldInputMeta: Meta<typeof FormFieldRoot> = {
  title: 'Components/FormField',
  component: FormFieldRoot,
  parameters: { layout: 'centered' },
  decorators: (Story) => {
    const hookUseForm = useForm({
      resolver: zodResolver(
        z.object({
          userName: z.string().min(3).max(64),
        }),
      ),
      defaultValues: {
        userName: '',
      },
    })

    return (
      <Form {...hookUseForm}>
        <form
          className='p-4 w-96'
          onSubmit={hookUseForm.handleSubmit(
            (props: z.infer<typeof UserSchema>) => {
              console.table(props)
              hookUseForm.reset()
            },
          )}
        >
          {Story()}
        </form>
      </Form>
    )
  },
  args: {
    children: (
      <FormFieldInput fieldName='userName' placeholder='Type your name...' />
    ),
    isError: false,
  },
  argTypes: {
    children: {
      description: 'children field',
      control: { disable: true, type: 'object' },
      table: { defaultValue: { summary: 'undefined' } },
    },
    isError: {
      control: { type: 'boolean' },
      options: [true, false],
      description: 'showing error styles when is true',
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
}

export default FormFieldInputMeta
export const Default: StoryObj<typeof FormFieldInputMeta> = {}
export const WithIcon: StoryObj<typeof FormFieldInputMeta> = {
  args: {
    children: (
      <>
        <FormFieldInput fieldName='userName' placeholder='Type your name...' />
        <FormFieldIcon>
          <Mail />
        </FormFieldIcon>
      </>
    ),
  },
}
export const WithError: StoryObj<typeof FormFieldInputMeta> = {
  args: {
    children: (
      <>
        <FormFieldInput fieldName='userName' placeholder='Type your name...' />
        <FormFieldIcon>
          <Mail />
        </FormFieldIcon>
      </>
    ),
    isError: true,
  },
}
