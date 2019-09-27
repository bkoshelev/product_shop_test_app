import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { Query, graphql, compose } from 'react-apollo';
import { Form as FormLogic, Field, FieldArray } from '@8base/forms';
import { BasketContext } from './BasketContext';

import {
  Dialog,
  Grid,
  Button,
  Form,
  Row,
  Column,
  Icon,
  Text,
  SelectField,
  InputField,
  CheckboxField,
  DateInputField,
  Label,
  ModalContext,
} from '@8base/boost';
import { AddressInputField, PhoneInputField, ListFields, FileInputField } from '../../shared/components';

const ORDER_CREATE_MUTATION = gql`
  mutation OrderCreate($data: OrderCreateInput!) {
    orderCreate(data: $data) {
      id
    }
  }
`;

const ORDER_ITEM_CREATE = gql`
  mutation OrderCreate($data: OrderItemCreateInput!) {
    orderItemCreate(data: $data) {
      id
    }
  }
`;

const CLIENT_LIST_QUERY = gql`
  query ClientsList {
    clientsList: clientsList {
      items {
        id
        _description
      }
    }
  }
`;

const getRelationOptions = (items = []) =>
  items.map(item => ({ value: item.id, label: item._description || 'Untitled Record' }));

const enhancer = compose(
  graphql(ORDER_CREATE_MUTATION, {
    name: 'orderCreate',
    options: {
      refetchQueries: ['OrdersTableContent', 'OrdersList'],
      context: {
        TOAST_SUCCESS_MESSAGE: 'Order successfully created',
      },
    },
  }),
  graphql(ORDER_ITEM_CREATE, {
    name: 'orderItemCreate',
    options: {
      context: {
      },
    },
  })
);

const OrderCreateDialogComponent = (props) => {
  const baseContext = useContext(ModalContext);
  const backetData = useContext(BasketContext);

  const onSubmit = async data => {
    const response = await props.orderCreate({ variables: { data, products: backetData } });

    const response2 = await Promise.all(
      backetData.map(//map location to promise
        product => {
          const data = {
            quantity: product.quantity,
            product: {
              connect: {
                id: product.id,

              }
            },
            order: {
              connect: {
                id: response.data.orderCreate.id
              }
            }
          }
          return props.orderItemCreate({ variables: { data } })
        }
      ))

    baseContext.closeModal('ORDER_CREATE_DIALOG_ID');
    baseContext.closeModal('ORDER_CREATE_MODAL_ID');
  };

  const onClose = () => {
    baseContext.closeModal('ORDER_CREATE_DIALOG_ID');
  };

  const renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="New Order" onClose={onClose} />
      <Dialog.Body scrollable>
        <Grid.Layout gap="md" stretch>
          <Grid.Box>
            <Query query={CLIENT_LIST_QUERY}>
              {({ data, loading }) => (
                <Field
                  name="client"
                  label="Client"
                  multiple={false}
                  component={SelectField}
                  placeholder="Select a client"
                  loading={loading}
                  options={loading ? [] : getRelationOptions(data.clientsList.items)}
                  stretch
                />
              )}
            </Query>
          </Grid.Box>
          <Grid.Box>
            <Field name="address" label="Address" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="deliveryDt" label="Delivery Dt" withTime={true} component={DateInputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="comment" label="Comment" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="status"
              label="Status"
              multiple={false}
              component={SelectField}
              options={[
                { label: 'Opened', value: 'Opened' },
                { label: 'Paid', value: 'Paid' },
                { label: 'ReadyToDelivery', value: 'ReadyToDelivery' },
                { label: 'Delivering', value: 'Delivering' },
                { label: 'Closed', value: 'Closed' },
                { label: 'Canceled', value: 'Canceled' },
              ]}
            />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" type="button" variant="outlined" disabled={submitting} onClick={onClose}>
          Back
          </Button>
        <Button color="primary" type="submit" loading={submitting}>
          Create Order
          </Button>
      </Dialog.Footer>
    </form>
  );

  return (
    <Dialog id={'ORDER_CREATE_DIALOG_ID'} size="sm">
      <FormLogic type="CREATE" tableSchemaName="Orders" onSubmit={onSubmit} formatRelationToIds>
        {renderFormContent}
      </FormLogic>
    </Dialog>
  );
}

const OrderCreateDialog = React.memo(enhancer(OrderCreateDialogComponent));

export { OrderCreateDialog };
