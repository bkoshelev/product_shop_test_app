
import React, { useState } from 'react';
import { FIELD_TYPE } from '@8base/utils';
import { TableBuilder, Dialog, Grid, Card, Button, Icon, Tag, Row, Input, withModal } from '@8base/boost';
import { Query } from 'react-apollo';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import objectPath from 'object-path';
import ProductsTable from './ProductsTable';
import { BasketContextProvider } from './BasketContext';
import BasketTable from './BasketTable';

const PRODUCTS_LIST_QUERY = gql`
query  {
  productsList {
    items {
      id
      name
      description
      price
      _description
    }
    count
  }
}
`;

const enhancer = compose(
    withModal,
  );

const OrderCreateModal = (props) => {
    const { closeModal, openModal} = props;

    return <Dialog id={'ORDER_CREATE_MODAL_ID'} size="xl">
        <Dialog.Body scrollable="false">
            <Grid.Layout columns="500px 250px" rows="400px">
                <Grid.Box direction="row">
                    <Card padding="md" stretch>
                        <Card.Header>{"Add products to order"}</Card.Header>
                        <Card.Body>
                            <Query query={PRODUCTS_LIST_QUERY}>
                                {({ loading, data }) => <ProductsTable {...{ loading, data }}></ProductsTable>}
                            </Query>
                        </Card.Body>
                    </Card>
                </Grid.Box>
                <Grid.Box direction="row">
                    <Card padding="md" stretch>
                        <Card.Header>{"Order"}</Card.Header>
                        <Card.Body>
                            <BasketTable></BasketTable>
                        </Card.Body>
                    </Card>
                </Grid.Box>
            </Grid.Layout>
        </Dialog.Body>
        <Dialog.Footer>
            <Button color="neutral" variant="outlined" onClick={() => closeModal('ORDER_CREATE_MODAL_ID')}>Cancel</Button>
            <Button type="submit" onClick={() => openModal("ORDER_CREATE_DIALOG_ID")}>Next Step</Button>
        </Dialog.Footer>
    </Dialog>
}

export default enhancer(OrderCreateModal);