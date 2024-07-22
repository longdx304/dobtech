import clsx from "clsx"
import { useAdminCancelReturn } from "medusa-react"
import React, { useState } from "react"
// import { ReceiveReturnMenu } from "../../../domain/orders/details/receive-return"
import { ReturnEvent } from "@/modules/orders/hooks/use-build-timeline";
import useToggleState from '@/lib/hooks/use-toggle-state';
import { Button } from "@/components/Button"
import { CircleAlert, Ban, PackageCheck, Trash2 } from 'lucide-react';

import DeletePrompt from "../../organisms/delete-prompt"
import EventActionables from "./event-actionables"
import EventContainer from "./event-container"
import EventItemContainer from "./event-item-container"

type ReturnRequestedProps = {
  event: ReturnEvent
  refetch: () => void
}

const Return: React.FC<ReturnRequestedProps> = ({ event, refetch }) => {
  const [showCancel, setShowCancel] = useState(false)
  const cancelReturn = useAdminCancelReturn(event.id)

  const {
    state: showReceiveReturnMenu,
    close: closeReceiveReturnMenu,
    open: openReceiveReturnMenu,
  } = useToggleState()

  const handleCancel = () => {
    cancelReturn.mutate(undefined, {
      onSuccess: () => {
        refetch()
      },
    })
  }

  const eventContainerArgs = buildReturn(
    event,
    handleCancel,
    openReceiveReturnMenu
  )

  if (event.raw?.claim_order_id) {
    return null
  }

  return (
    <>
      <EventContainer {...eventContainerArgs} />
      {/* {showCancel && (
        <DeletePrompt
          handleClose={() => setShowCancel(false)}
          onDelete={async () => handleCancel()}
          heading="Cancel return"
          confirmText="Yes, cancel"
          successText="Canceled return"
          text="Are you sure you want to cancel this return?"
        />
      )} */}
      {/* {showReceiveReturnMenu && (
        <ReceiveReturnMenu
          onClose={closeReceiveReturnMenu}
          order={event.order}
          returnRequest={event.raw}
        />
      )} */}
    </>
  )
}

function buildReturn(
  event: ReturnEvent,
  onCancel: () => void,
  onReceive: () => void
) {
  let title: string = ""
  let icon: React.ReactNode
  let button: React.ReactNode
  const actions: any[] = [];
	console.log('event', event)

  switch (event.status) {
    case "requested":
      title = "Yêu cầu trả lại"
      icon = <CircleAlert size={20} className="text-orange-400" />
      if (event.currentStatus === "requested") {
        button = event.currentStatus && event.currentStatus === "requested" && (
          <Button
            type="default"
            className={clsx("mt-large w-full")}
            onClick={onReceive}
          >
            Nhận hàng trả lại
          </Button>
        )
        actions.push({
          icon: <Trash2 size={20} />,
          label: "Huỷ yêu cầu",
          danger: true,
          onClick: onCancel,
        })
      }
      break;
    case "received":
      title = "Đã nhận hàng trả lại"
      icon = <PackageCheck size={20} className="text-emerald-400" />
      break
    case "canceled":
      title = "Đã hủy yêu cầu trả lại"
      icon = <Ban size={20} className="text-gray-500" />
      break
    case "requires_action":
      title = "Yêu cầu trả lại cần hành động"
      icon = <CircleAlert size={20} className="text-rose-500" />
      break
    default:
      break
  }

  return {
    title,
    icon,
    time: event.time,
    topNode: actions.length > 0 && <EventActionables actions={actions} />,
    noNotification: event.noNotification,
    children:
      event.status === "requested"
        ? [
            event.items.map((i, index) => {
              return <EventItemContainer key={index} item={i} />
            }),
            React.createElement(React.Fragment, { key: "button" }, button),
          ]
        : event.status === "received"
        ? [
            event.items.map((i, index) => (
              <EventItemContainer
                key={index}
                item={{ ...i, quantity: i.receivedQuantity ?? i.quantity }}
              />
            )),
          ]
        : null,
  }
}

export default Return
