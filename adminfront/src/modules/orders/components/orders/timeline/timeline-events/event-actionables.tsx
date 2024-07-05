import React from "react"
import { ActionAbles } from '@/components/Dropdown';

type EventActionablesProps = {
  actions: any
}

const EventActionables: React.FC<EventActionablesProps> = ({ actions }) => {
  return (
    <Actionables actions={actions} />
  )
}

export default EventActionables
