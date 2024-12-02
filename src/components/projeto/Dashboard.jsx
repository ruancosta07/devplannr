import dayjs from '@/utils/dayjs'
import { CheckCircle2, History, ListTodo } from 'lucide-react'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import useUserStore from '@/store/User'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ClockAlert } from 'lucide-react'
import { User } from 'lucide-react'

const Dashboard = ({ tasks, project }) => {
  const { user } = useUserStore()

  function returnMonthsTasks(tasks) {
    if (tasks) {
      const groupedTasks = tasks?.reduce((acc, task) => {
        const month = dayjs(task.createdAt).format('MMMM')

        if (!acc[month]) {
          acc[month] = 0 // inicializa o contador para o mês se ainda não existir
        }

        acc[month] += 1 // incrementa o contador para o mês
        return acc
      }, {})

      // Obtém o último mês das tarefas para definir o ponto de partida
      const firstTaskDate = dayjs(tasks[0]?.createdAt)
      const lastMonth = firstTaskDate.startOf('month')

      // Adiciona meses, incluindo os futuros, até ter pelo menos quatro meses
      const result = []
      for (let i = 0; i < 6; i++) {
        const currentMonth = lastMonth.add(i, 'month').format('MMMM') // Exibe apenas o mês
        result.push({
          month: currentMonth,
          tarefas: groupedTasks[currentMonth] || 0, // contagem de tarefas ou 0 se não houver tarefas
        })
      }

      return result
    }
  }

  const chartConfig = {
    views: {
      label: 'Tarefas concluídas',
    },
    desktop: {
      label: 'Status',
      color: '#f2f2f2',
    },
  }
  const completedTasks = tasks
    .filter((task) => task.status === 'Concluída')
    .map((task) => ({
      ...task,
      length: tasks.filter((t) => t.status === 'Concluída').length,
    }))

  const [activeChart, setActiveChart] = useState('desktop')
  return (
    <section className="grid grid-cols-3 gap-[1rem] mt-[2rem]">
      <div className="p-[1.4rem] border border-zinc-800 rounded-[.5rem]">
        <div className="flex items-center text-zinc-300 justify-between">
          <p className=" text-[1.8rem] ">Total de tarefas</p>
          <ListTodo />
        </div>
        <span className="text-zinc-50 text-[3rem] mt-[1.2rem] block font-semibold">{tasks?.length}</span>
      </div>
      <div className="p-[1.4rem] border border-zinc-800 rounded-[.5rem]">
        <div className="flex items-center text-zinc-300 justify-between">
          <p className=" text-[1.8rem] ">Tarefas concluídas</p>
          <CheckCircle2 />
        </div>
        <span className="text-zinc-50 text-[3rem] mt-[1.2rem] block font-semibold">
          {tasks?.filter((t) => t.status === 'Concluída').length}
        </span>
      </div>
      <div className="p-[1.4rem] border border-zinc-800 rounded-[.5rem]">
        <div className="flex items-center text-zinc-300 justify-between">
          <p className=" text-[1.8rem] ">Tarefas não iniciadas</p>
          <ClockAlert />
        </div>
        <span className="text-zinc-50 text-[3rem] mt-[1.2rem] block font-semibold">
          {tasks?.filter((t) => t.status === 'Não iniciada').length}
        </span>
      </div>
      <div className="p-[1.4rem] border border-zinc-800 rounded-[.5rem]">
        <div className="flex items-center text-zinc-300 justify-between">
          <p className=" text-[1.8rem] ">Minhas tarefas</p>
          <User />
        </div>
        <div className="mt-[1.2rem] flex flex-col gap-[2rem] max-h-[300px] overflow-y-auto modal-task">
          {tasks
            .filter((t) => t.users.map((u) => u.id === user.id))
            .map((t) => (
              <div key={t.id}>
                <div>
                  <span className="text-zinc-100 text-[1.8rem] font-semibold">{t.name}</span>
                  <p className="text-zinc-300 text-[1.4rem] mt-[.4rem] leading-[1.2]">
                    {t.description.length > 80 ? t.description.slice(0, 80) + '...' : t.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="p-[1.4rem] border border-zinc-800 rounded-[.5rem]">
        <div className="flex items-center text-zinc-300 justify-between">
          <p className=" text-[1.8rem] ">Atividades</p>
          <History />
        </div>
        <div className="mt-[1.2rem] flex flex-col gap-[1rem] max-h-[300px] overflow-y-auto modal-task">
          {project?.recents
            ?.sort((a, b) => dayjs(b.occurredAt).diff(a.occurredAt))
            .map((t) => (
              <div key={t.id}>
                <div className="grid grid-cols-[auto_1fr] gap-[1rem]">
                  <img src={t.avatar} className="w-[4rem] h-[4rem] rounded-full object-cover" alt="" />
                  <div>
                    <p className="text-zinc-100 text-[1.4rem] font-semibold mt-[.4rem] leading-[1.2]">{(t.userId === user.id ? "Você": t.name) + " " + t.text} </p>
                    <p className="text-zinc-300 text-[1.3rem] mt-[.4rem] leading-[1.2]">
                      {dayjs(t.occurredAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* <div className="col-span-3">
        <Card>
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-zinc-800 p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[2rem]">Tarefas concluídas</CardTitle>
                <CheckCircle2 className="" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
              <BarChart
                accessibilityLayer
                data={completedTasks} 
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} className="stroke-transparent" />
                <XAxis
                  dataKey="createdAt"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  className="text-[1.2rem] font-semibold"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString('pt-BR', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      }}
                      className="text-[1.4rem] labelsla"
                    />
                  }
                />
                <Bar dataKey="status" className="fill-zinc-100" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div> */}
    </section>
  )
}

export default Dashboard
