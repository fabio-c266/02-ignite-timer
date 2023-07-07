import { HandPalm, Play } from 'phosphor-react'

import {
  HomeContainer,
  StartCoutdownButton,
  StopCoutdownButton,
} from './styles'
import { NewCycleForm } from '../../components/NewCycleForm'
import { Coutdown } from '../../components/Countdown'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useContext } from 'react'
import { CyclesContext } from '../../contexts/CycleContext'

const newCycleFormValidationSchema = z.object({
  task: z.string().min(1, 'Informe a tarefa'),
  minutesAmount: z
    .number()
    .min(5, 'O ciclo precisa ser no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser mo máximo de 60 minutos.'),
})

type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const taskValue = watch('task')
  const isSubmitDisabled = !taskValue

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Coutdown />

        {activeCycle ? (
          <StopCoutdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interroper
          </StopCoutdownButton>
        ) : (
          <StartCoutdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCoutdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
