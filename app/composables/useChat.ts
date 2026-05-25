import type { Tables } from '~/types/database.types'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export const useChat = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const conversations = useState<Tables<'conversations'>[]>('conversations', () => [])
  const currentConversation = useState<Tables<'conversations'> | null>('currentConversation', () => null)
  const messages = useState<ChatMessage[]>('chatMessages', () => [])
  const isLoading = useState('chatLoading', () => false)
  const error = useState<string | null>('chatError', () => null)

  const loadConversations = async () => {
    if (!user.value) return

    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.value.id)
      .order('updated_at', { ascending: false })

    if (data) conversations.value = data
  }

  const createConversation = async (title = 'New Chat', model = 'google/gemini-2.0-flash-exp:free') => {
    if (!user.value) return null

    const { data, error: err } = await supabase
      .from('conversations')
      .insert({
        user_id: user.value.id,
        title,
        model,
      })
      .select()
      .single()

    if (!err && data) {
      conversations.value.unshift(data)
      currentConversation.value = data
      messages.value = []
      return data
    }
    return null
  }

  const selectConversation = async (conversation: Tables<'conversations'>) => {
    currentConversation.value = conversation
    await loadMessages(conversation.id)
  }

  const loadMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (data) {
      messages.value = data.map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        created_at: m.created_at,
      }))
    }
  }

  const sendMessage = async (content: string, model?: string) => {
    if (!user.value || !content.trim()) return
    error.value = null

    // Create conversation if none exists
    if (!currentConversation.value) {
      const title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
      await createConversation(title, model)
    }

    if (!currentConversation.value) return

    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    messages.value.push(userMessage)

    // Save user message to Supabase
    await supabase.from('messages').insert({
      conversation_id: currentConversation.value.id,
      role: 'user',
      content,
    })

    // Call AI API
    isLoading.value = true
    try {
      const apiMessages = messages.value.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response: any = await $fetch('/api/chat', {
        method: 'POST',
        body: {
          messages: apiMessages,
          model: model || currentConversation.value.model,
        },
      })

      const assistantContent = response?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'

      // Add assistant message to UI
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantContent,
        created_at: new Date().toISOString(),
      }
      messages.value.push(assistantMessage)

      // Save assistant message to Supabase
      await supabase.from('messages').insert({
        conversation_id: currentConversation.value.id,
        role: 'assistant',
        content: assistantContent,
      })

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentConversation.value.id)
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to get AI response'
      // Remove the user message if AI call failed
      messages.value.pop()
    } finally {
      isLoading.value = false
    }
  }

  const deleteConversation = async (id: string) => {
    await supabase.from('messages').delete().eq('conversation_id', id)
    await supabase.from('conversations').delete().eq('id', id)
    conversations.value = conversations.value.filter(c => c.id !== id)

    if (currentConversation.value?.id === id) {
      currentConversation.value = null
      messages.value = []
    }
  }

  const clearCurrentChat = () => {
    currentConversation.value = null
    messages.value = []
  }

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    loadConversations,
    createConversation,
    selectConversation,
    loadMessages,
    sendMessage,
    deleteConversation,
    clearCurrentChat,
  }
}
