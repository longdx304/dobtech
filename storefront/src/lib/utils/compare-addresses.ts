import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

export default function compareAddresses(address1: any, address2: any) {
  return isEqual(
    omit(address1, [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "metadata",
      "customer_id",
    ]),
    omit(address2, [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "metadata",
      "customer_id",
    ])
  )
}
