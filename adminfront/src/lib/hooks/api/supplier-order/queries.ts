import { queryKeysFactory } from "medusa-react";

const SUPPLIER_ORDER_LIST = `admin-supplier-order` as const;

export const supplierOrdersKeys = queryKeysFactory(SUPPLIER_ORDER_LIST);
