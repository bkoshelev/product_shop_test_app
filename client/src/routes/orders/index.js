import React from 'react';
import { Card, Heading, Paper } from '@8base/boost';
import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';

import { OrderCreateDialog } from './OrderCreateDialog';
import { OrderEditDialog } from './OrderEditDialog';
import { OrderDeleteDialog } from './OrderDeleteDialog';
import { OrdersTable } from './OrdersTable';
import OrderCreateModal from './OrderCreateModal';
import { BasketContextProvider } from './BasketContext';

const getTotalCostOfOrders = gql`
query {
  getTotalCostOfOrders {
    totalCost
  }
}
`;

const Orders = () => (
  <Card padding="md" stretch>
    <Card.Header>
      <Heading type="h4" text=" Orders" />  
    </Card.Header>
    <BasketContextProvider>
    
    <OrderCreateModal></OrderCreateModal>
    <OrderCreateDialog />
    </BasketContextProvider>
    <OrderEditDialog />
    <OrderDeleteDialog />
    <Card.Body padding="none" stretch scrollable>
      <OrdersTable />
    </Card.Body>
    <Card.Footer>
    <Query query={getTotalCostOfOrders}>
      {({loading, data}) => {
        if (loading) return 'Total Cost';
      return `Total Cost: ${data.getTotalCostOfOrders.totalCost}`
      }}
      </Query>
    </Card.Footer>
  </Card>
);

export { Orders };
