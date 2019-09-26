/*
 * Data that is sent to this function can be accessed on the event argument at:
 *  event.data[KEY_NAME]
 *
 * To invoke this function locally, run:
 *  8base invoke-local getFullName -p src/resolvers/getFullName/mocks/request.json
 */
import gql from 'graphql-tag';

const GET_USER_NAME_PARTS_QUERY = gql`
  query ($id: ID!) {
    client (id: $id) {
      firstName
      lastName
    }
  }
`;


type ResolverResult = {
  data: {
    fullName: string,
  },
};

export default async (event: any, ctx: any) : Promise<ResolverResult> => {
  console.log(event);
 const response = await ctx.api.gqlRequest(GET_USER_NAME_PARTS_QUERY, { id: event.data.id });
 const { client: { firstName, lastName}} = response;

  return {
    data: {
      fullName: `${firstName} ${lastName}`,
    },
  };
};