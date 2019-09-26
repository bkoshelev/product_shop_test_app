import React from 'react';
import gql from 'graphql-tag';
import { Form as FormLogic } from '@8base/forms';
import { Dialog, Button, ModalContext } from '@8base/boost';
import { graphql } from 'react-apollo';

const ORDER_DELETE_MUTATION = gql`
  mutation OrderDelete($id: ID!) {
    orderDelete(data: { id: $id }) {
      success
    }
  }
`;

const enhancer = graphql(ORDER_DELETE_MUTATION, {
  name: 'orderDelete',
  options: {
    refetchQueries: ['OrdersTableContent', 'OrdersList'],
    context: {
      TOAST_SUCCESS_MESSAGE: 'Order successfully deleted',
    },
  },
});

const OrderDeleteDialog = enhancer(
  class OrderDeleteDialog extends React.Component {
    static contextType = ModalContext;

    createOnSubmit = id => async () => {
      await this.props.orderDelete({ variables: { id } });

      this.context.closeModal('ORDER_DELETE_DIALOG_ID');
    };

    onClose = () => {
      this.context.closeModal('ORDER_DELETE_DIALOG_ID');
    };

    renderFormContent = ({ handleSubmit, invalid, submitting }) => (
      <form onSubmit={handleSubmit}>
        <Dialog.Header title="Delete Order" onClose={this.onClose} />
        <Dialog.Body scrollable>Do you really want to delete order?</Dialog.Body>
        <Dialog.Footer>
          <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="danger" type="submit" disabled={invalid} loading={submitting}>
            Delete Order
          </Button>
        </Dialog.Footer>
      </form>
    );

    renderContent = ({ args }) => {
      return (
        <FormLogic onSubmit={this.createOnSubmit(args.id)} formatRelationToIds>
          {this.renderFormContent}
        </FormLogic>
      );
    };

    render() {
      return (
        <Dialog id={'ORDER_DELETE_DIALOG_ID'} size="sm">
          {this.renderContent}
        </Dialog>
      );
    }
  }
);

export { OrderDeleteDialog };
