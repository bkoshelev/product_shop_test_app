/**
 * This file was generated using 8base CLI.
 *
 * To learn more about writing custom trigger functions, visit
 * the 8base documentation at:
 *
 * https://docs.8base.com/8base-console/custom-functions/triggers
 *
 * To update this functions invocation settings, update its configuration block
 * in the projects 8base.yml file:
 *  functions:
 *    createOrderItems:
 *      ...
 *
 * Data that is sent to the function can be accessed on the event argument at:
 *  event.data[KEY_NAME]
 *
 * To invoke this function locally, run:
 *  8base invoke-local createOrderItems -p src/triggers/createOrderItems/mocks/request.json
 */
import gql from "graphql-tag";

const CREATE_ORDER_ITEM = gql`
  mutation($productId: ID, $orderId: ID, $quantity: Int) {
    orderItemCreate(
      data: {
        product: { connect: { id: $productId } }
        order: { connect: { id: $orderId } }
        quantity: $quantity
      }
    ) {
      id
      quantity
      product {
        id
      }
    }
  }
`;

type TriggerResult = {
  data: {
    result: string;
  };
  errors: Array<object>;
};

export default async (event: any, ctx: any): Promise<TriggerResult> => {
  const {
    data: { id }
  } = event;

  console.log('DEBUG: ', event);
  console.log("-------------- EVENT ----------------")
  console.log(JSON.stringify(event))

  console.log("-------------- DATA ----------------")
  console.log(JSON.stringify(event.data))
  console.log("-------------- HEADERS ----------------")

  console.log(JSON.stringify(event.headers));
  console.log("-------------- ORIGINAL DATA ----------------")

  console.log(JSON.stringify(event.originalData))
  const {
    originalData: {
      products
    }
  } = event; // { id: 0, quantity: 1}

  
  const result = await products.map(
    product =>
       ctx.api.gqlRequest(CREATE_ORDER_ITEM, {
        variables: { productId: product.id, orderId: id, quantity: product.quantity }
      })
  );

  return {
    data: {
      result: result.orderItemCreate.id
    },
    errors: []
  };
};

/**
 * Triggers allow for errors to be specified in the response
 * as an array of user defined objects.
 *
 * Example:
 *
 * [{
 *  message: "Error message",
 *  code: "error_code"
 * }, ...]
 */
