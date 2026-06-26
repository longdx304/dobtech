# Order Detail Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two bugs in the order detail page: (1) "Chuyển sang kho" timeline action saves user info and renders a timeline event; (2) Customer section displays customer name.

**Architecture:** Issue 1 requires changes in three layers — the action handler (save user to metadata), the timeline builder hook (generate event from metadata), and a new event component (render it). Issue 2 is a single-component UI addition. No API or backend changes needed.

**Tech Stack:** React, TypeScript, Medusa React, Ant Design, Lucide React, Tailwind CSS

---

## File Map

| Action | File |
|--------|------|
| Modify | `src/modules/admin/orders/components/orders/timeline/index.tsx` |
| Modify | `src/modules/admin/orders/hooks/use-build-timeline.tsx` |
| Create | `src/modules/admin/orders/components/orders/timeline/timeline-events/transferred-to-warehouse.tsx` |
| Modify | `src/modules/admin/orders/components/orders/customer-info/index.tsx` |

---

## Task 1: Save user info when transferring to warehouse

**Files:**
- Modify: `src/modules/admin/orders/components/orders/timeline/index.tsx` (lines 242–265)

The `handleTransferToWarehouse()` function currently saves only `transferred_to_warehouse: true` and `transferred_at`. We need to also save the current user's id and name. `useUser()` is already called on line 76, so `user` is already in scope.

- [ ] **Step 1: Update `handleTransferToWarehouse` to save user info**

In `src/modules/admin/orders/components/orders/timeline/index.tsx`, find `handleTransferToWarehouse` (line 242) and update the metadata payload:

```typescript
const handleTransferToWarehouse = async () => {
	message.loading('Đang chuyển đơn hàng sang kho...');

	const currentMetadata = order?.metadata ? { ...order.metadata } : {};

	await updateOrder.mutateAsync(
		{
			metadata: {
				...currentMetadata,
				transferred_to_warehouse: true,
				transferred_at: new Date().toISOString(),
				transferred_by_user_id: user?.id,
				transferred_by_user_name: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim(),
			},
		} as AdminPostOrdersOrderReq & { metadata: any },
		{
			onSuccess: () => {
				refetchOrder();
				message.success('Chuyển đơn hàng sang kho thành công');
			},
			onError: (err: any) => {
				message.error(getErrorMessage(err));
			},
		}
	);
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd dobtech/adminfront && npx tsc --noEmit`
Expected: No errors related to this file.

---

## Task 2: Add `transferred-to-warehouse` event type and builder

**Files:**
- Modify: `src/modules/admin/orders/hooks/use-build-timeline.tsx`

- [ ] **Step 1: Add event type to the union**

In `use-build-timeline.tsx`, find the `TimelineEvent` interface `type` union (lines 28–51). Add `'transferred-to-warehouse'` to the list:

```typescript
| 'attachment'
| 'transferred-to-warehouse';
```

- [ ] **Step 2: Add the `TransferredToWarehouseEvent` interface**

After the `AttachmentEvent` interface (line 54–57), add:

```typescript
export interface TransferredToWarehouseEvent extends TimelineEvent {
	transferredByName: string;
}
```

- [ ] **Step 3: Push the event in `useMemo`**

After the attachment block (after line 374 where `order.metadata?.files` is processed), add:

```typescript
if (
	order.metadata?.transferred_to_warehouse === true &&
	order.metadata?.transferred_by_user_name
) {
	events.push({
		id: `${order.id}-transferred-to-warehouse`,
		time: new Date(order.metadata.transferred_at as string),
		type: 'transferred-to-warehouse',
		orderId: order.id,
		transferredByName: order.metadata.transferred_by_user_name as string,
	} as TransferredToWarehouseEvent);
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

---

## Task 3: Create `TransferredToWarehouse` timeline event component

**Files:**
- Create: `src/modules/admin/orders/components/orders/timeline/timeline-events/transferred-to-warehouse.tsx`

Follow the exact same pattern as `attachment.tsx`.

- [ ] **Step 1: Create the component file**

```typescript
import { TransferredToWarehouseEvent } from '@/modules/admin/orders/hooks/use-build-timeline';
import { Warehouse } from 'lucide-react';
import React from 'react';
import EventContainer, { EventIconColor } from './event-container';

type Props = {
	event: TransferredToWarehouseEvent;
};

const TransferredToWarehouse: React.FC<Props> = ({ event }) => {
	const args = {
		icon: <Warehouse size={20} />,
		iconColor: EventIconColor.DEFAULT,
		time: event.time,
		title: 'Chuyển sang kho',
		detail: `Thực hiện bởi: ${event.transferredByName}`,
		isFirst: event.first,
	};
	return <EventContainer {...args} />;
};

export default TransferredToWarehouse;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

---

## Task 4: Register the new event in `switchOnType`

**Files:**
- Modify: `src/modules/admin/orders/components/orders/timeline/index.tsx`

- [ ] **Step 1: Import the new component and event type**

At the top of `timeline/index.tsx`, add two imports alongside the existing ones:

```typescript
import TransferredToWarehouse from './timeline-events/transferred-to-warehouse';
import { TransferredToWarehouseEvent } from '@/modules/admin/orders/hooks/use-build-timeline';
```

(The `TransferredToWarehouseEvent` import goes inside the existing import block from `use-build-timeline`.)

- [ ] **Step 2: Add the case to `switchOnType`**

In the `switchOnType` function (around line 434, after the `'attachment'` case), add:

```typescript
case 'transferred-to-warehouse':
    return <TransferredToWarehouse event={event as TransferredToWarehouseEvent} />;
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Manual smoke test**

1. Open an order that has already been "Chuyển sang kho" via the new code (i.e., after Task 1 was deployed for a new transfer).
2. Confirm the timeline shows a "Chuyển sang kho" entry with "Thực hiện bởi: [tên người dùng]".
3. Open an old order transferred before this fix — confirm NO "Chuyển sang kho" entry appears.

---

## Task 5: Show customer name in the Customer section

**Files:**
- Modify: `src/modules/admin/orders/components/orders/customer-info/index.tsx`

- [ ] **Step 1: Add customer name row**

In `customer-info/index.tsx`, find the `<Flex vertical gap={4} className="pt-8">` block (line 115). Add a new row **before** the Email row (before line 116):

```tsx
<Flex justify="space-between" align="center">
    <Text className="text-gray-500 text-sm">Tên khách hàng:</Text>
    <Text className="text-gray-500 text-sm">
        {[order.customer?.first_name, order.customer?.last_name]
            .filter(Boolean)
            .join(' ') || '-'}
    </Text>
</Flex>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Manual smoke test**

Open any order detail page. In the "Khách hàng" section, confirm:
- "Tên khách hàng" row appears above "Email"
- For an order with customer `first_name: "Thư - Syna"` and `last_name: "Quận 9"`, it shows `"Thư - Syna Quận 9"`
- For an order with no customer name set, it shows `"-"`
