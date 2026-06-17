import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getSettings, DEFAULT_SETTINGS } from '../services/settings'
import { getMedicines } from '../services/medicine'
import { getActivity } from '../services/activity'

// ─── State shape ─────────────────────────────────────────────────────────────

const initialState = {
  // Auth
  user:         null,   // Supabase user object | null
  session:      null,   // Supabase session object | null
  authLoading:  true,   // true until onAuthStateChange fires once

  // Data
  medicines:    [],
  activity:     [],
  settings:     DEFAULT_SETTINGS,

  // UI
  dataLoading:  false,
  error:        null,
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case 'AUTH_READY':
      return {
        ...state,
        user:        action.payload.user,
        session:     action.payload.session,
        authLoading: false,
      }
    case 'SIGNED_OUT':
      return {
        ...initialState,
        authLoading: false,
      }
    case 'DATA_LOADING':
      return { ...state, dataLoading: true, error: null }
    case 'DATA_LOADED':
      return {
        ...state,
        dataLoading: false,
        medicines:   action.payload.medicines ?? state.medicines,
        activity:    action.payload.activity  ?? state.activity,
        settings:    action.payload.settings  ?? state.settings,
      }
    case 'DATA_ERROR':
      return { ...state, dataLoading: false, error: action.payload }

    // Optimistic local updates — keeps UI snappy without a full refetch
    case 'MEDICINE_ADDED':
      return { ...state, medicines: [action.payload, ...state.medicines] }
    case 'MEDICINE_UPDATED':
      return {
        ...state,
        medicines: state.medicines.map(m =>
          m.id === action.payload.id ? action.payload : m
        ),
      }
    case 'MEDICINE_DELETED':
      return {
        ...state,
        medicines: state.medicines.filter(m => m.id !== action.payload),
      }
    case 'ACTIVITY_LOGGED':
      return { ...state, activity: [action.payload, ...state.activity] }
    case 'SETTINGS_UPDATED':
      return { ...state, settings: action.payload }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load all user data after sign-in
  const loadUserData = useCallback(async () => {
    dispatch({ type: 'DATA_LOADING' })
    try {
      const [medicines, activity, settings] = await Promise.all([
        getMedicines(),
        getActivity(),
        getSettings(),
      ])
      dispatch({ type: 'DATA_LOADED', payload: { medicines, activity, settings } })
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.message })
    }
  }, [])

  // ── Auth state listener ─────────────────────────────────────────────────────
  // This is the key difference vs PocketBase: Supabase fires onAuthStateChange
  // on every tab, token refresh, and sign-in/out. It replaces pb.authStore.onChange.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          dispatch({
            type:    'AUTH_READY',
            payload: { user: session.user, session },
          })
          // Load data on first sign-in or token refresh (SIGNED_IN, TOKEN_REFRESHED)
          if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            await loadUserData()
          }
        } else {
          dispatch({ type: 'SIGNED_OUT' })
        }
      }
    )

    // Cleanup listener on unmount
    return () => subscription.unsubscribe()
  }, [loadUserData])

  // ── Exposed helpers ────────────────────────────────────────────────────────

  const refreshMedicines = useCallback(async () => {
    const medicines = await getMedicines()
    dispatch({ type: 'DATA_LOADED', payload: { medicines } })
  }, [])

  const refreshActivity = useCallback(async () => {
    const activity = await getActivity()
    dispatch({ type: 'DATA_LOADED', payload: { activity } })
  }, [])

  const value = {
    ...state,
    dispatch,
    refreshMedicines,
    refreshActivity,
    loadUserData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

export default AppContext
