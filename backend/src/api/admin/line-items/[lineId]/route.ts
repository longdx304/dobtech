import {
	LineItem,
	LineItemService,
	MedusaRequest,
	MedusaResponse,
} from "@medusajs/medusa";

export async function POST(
	req: MedusaRequest,
	res: MedusaResponse
): Promise<void> {
	const lineItemService =
		req.scope.resolve<LineItemService>("lineItemService");
	const { lineId } = req.params;

	try {
		const lineItem = await lineItemService.update(
			lineId,
			req.body as Partial<LineItem>
		);
		res.json({
			message: "Update line item successfully",
			lineItem,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
}
