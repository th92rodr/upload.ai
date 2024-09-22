import { useEffect, useState } from 'react'

import { api } from '@/lib/axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface Prompt {
  id: string
  title: string
  template: string
}

interface PromptSelectProps {
  onPromptSelected: (template: string) => void
}

export function PromptSelect({ onPromptSelected }: PromptSelectProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([])

  useEffect(() => {
    api.get('/prompts').then(response => {
      setPrompts(response.data.prompts)
    })
  }, [])

  function handlePromptSelected(id: string) {
    const selectedPrompt = prompts.find(prompt => prompt.id === id)

    if (!selectedPrompt) {
      return
    }

    onPromptSelected(selectedPrompt.template)
  }

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts.map(prompt => {
          return (
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.title}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
