import type { Tables, TablesInsert } from '~/types/database.types'

export const useNotes = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const notes = useState<Tables<'notes'>[]>('notes', () => [])
  const folders = useState<Tables<'folders'>[]>('folders', () => [])

  const fetchNotes = async (folderId?: string) => {
    if (!user.value) return

    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (folderId) {
      query = query.eq('folder_id', folderId)
    }

    const { data } = await query
    if (data) notes.value = data
  }

  const fetchFolders = async () => {
    if (!user.value) return

    const { data } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.value.id)
      .order('name')

    if (data) folders.value = data
  }

  const createNote = async (note: Omit<TablesInsert<'notes'>, 'user_id'>) => {
    if (!user.value) return null

    const { data, error } = await supabase
      .from('notes')
      .insert({ ...note, user_id: user.value.id })
      .select()
      .single()

    if (!error && data) {
      notes.value.unshift(data)
      return data
    }
    return null
  }

  const updateNote = async (id: string, updates: Partial<Tables<'notes'>>) => {
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      const idx = notes.value.findIndex(n => n.id === id)
      if (idx !== -1) notes.value[idx] = data
    }
  }

  const deleteNote = async (id: string) => {
    await supabase.from('notes').delete().eq('id', id)
    notes.value = notes.value.filter(n => n.id !== id)
  }

  const createFolder = async (name: string) => {
    if (!user.value) return null

    const { data, error } = await supabase
      .from('folders')
      .insert({ name, user_id: user.value.id })
      .select()
      .single()

    if (!error && data) {
      folders.value.push(data)
      return data
    }
    return null
  }

  const deleteFolder = async (id: string) => {
    await supabase.from('folders').delete().eq('id', id)
    folders.value = folders.value.filter(f => f.id !== id)
  }

  return {
    notes,
    folders,
    fetchNotes,
    fetchFolders,
    createNote,
    updateNote,
    deleteNote,
    createFolder,
    deleteFolder,
  }
}
