import { queryKeysFactory } from "medusa-react";

const SUPPLIER_ORDER_LIST = `supplier_orders` as const;

export const supplierOrdersKeys = queryKeysFactory(SUPPLIER_ORDER_LIST);
