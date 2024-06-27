import _ from 'lodash';

export default function compareAddresses(address1: any, address2: any) {
  return _.isEqual(
    _.omit(address1, [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "metadata",
      "customer_id",
    ]),
    _.omit(address2, [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "metadata",
      "customer_id",
    ])
  )
}
