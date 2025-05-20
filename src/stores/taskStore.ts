import { defineStore } from 'pinia'

export interface Task {
  id: number
  title: string
  date: string // formato 'YYYY-MM-DD'
  type: string // por ejemplo: 'marketing', 'reunión'
  priority: 'alta' | 'media' | 'baja'
}

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [] as Task[]
  }),
  actions: {
    addTask(task: Task) {
      this.tasks.push(task)
    },
    getTasksByDate(date: string) {
      return this.tasks.filter(t => t.date === date)
    }
  }
})


