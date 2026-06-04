import { useContext } from 'react'
import { EventLogContext } from '../context/EventLogContext'

export function useEventLog() {
  return useContext(EventLogContext)
}
