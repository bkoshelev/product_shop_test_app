import gql from "graphql-tag";

const GET_USER_NAME_PARTS_QUERY = gql`
  query {
    ordersList {
      items {
        orderItems {
          items {
            product {
              price
            }
            quantity
          }
        }
      }
    }
  }
`;

type ResolverResult = {
  data: {
    totalCost: number;
  };
};

export default async (event: any, ctx: any): Promise<ResolverResult> => {
  const response = await ctx.api.gqlRequest(GET_USER_NAME_PARTS_QUERY);
  const { ordersList } = await response;

  const sumTwoNum = (a, b) => parseFloat((a + b).toFixed(2));
  const multipleTwoNum = (a, b) => parseFloat((a * b).toFixed(2));
  const getOrderCost = (acc, orderItem) => {
    const totalCost = multipleTwoNum(orderItem.quantity, orderItem.product.price);
    return sumTwoNum(acc, totalCost);
  };

  const getOrdersCost = (acc, order) => {
    if (order.orderItems && order.orderItems.items) {
      const orderCost = order.orderItems.items.reduce(getOrderCost, 0);
      console.log({ orderCost})
      return sumTwoNum(acc, orderCost);
    } else {
      return acc;
    }
  }

  const totalCost = await ordersList.items.reduce(getOrdersCost, 0);

  console.log(totalCost);

  return {
    data: {
      totalCost
    }
  };
};
