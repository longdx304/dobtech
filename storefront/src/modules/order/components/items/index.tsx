import { LineItem, Region } from "@medusajs/medusa"


type ItemsProps = {
  items: LineItem[]
  region: Region
}

const Items = ({ items, region }: ItemsProps) => {
  return (
    <div className="flex flex-col">
      items
    </div>
  )
}

export default Items
