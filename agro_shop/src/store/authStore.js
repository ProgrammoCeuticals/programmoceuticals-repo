import { create } from 'zustand'
import { supabase, useMock } from '../lib/supabase'

const DEMO_USER = { id: 'demo-admin', email: 'admin@demo.com' }
const DEMO_PROFILE = { full_name: 'Demo Admin', role: 'admin' }

export const useAuthStore = create((set) => ({
  user:    null,
  session: null,
  role:    null,
  loading: true,
  profile: null,

  initialize: async () => {
    if (useMock) {
      set({ user: DEMO_USER, profile: DEMO_PROFILE, role: 'admin', loading: false })
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        set({ user: session.user, session, profile, role: profile?.role ?? null, loading: false })
      } else {
        set({ loading: false })
      }
    } catch {
      set({ loading: false })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        set({ user: session.user, session, profile, role: profile?.role ?? null, loading: false })
      } else {
        set({ user: null, session: null, profile: null, role: null, loading: false })
      }
    })
  },

  login: async (email, password) => {
    if (useMock) {
      set({ user: DEMO_USER, profile: DEMO_PROFILE, role: 'admin', loading: false })
      return { error: null }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error && data.session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      set({ user: data.user, session: data.session, profile, role: profile?.role ?? null })
    }
    return { error }
  },

  logout: async () => {
    if (useMock) {
      set({ user: null, session: null, profile: null, role: null, loading: false })
      return
    }
    await supabase.auth.signOut()
    set({ user: null, session: null, profile: null, role: null })
  },
}))
