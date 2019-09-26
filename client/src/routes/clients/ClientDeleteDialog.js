import React from 'react';
import gql from 'graphql-tag';
import { Form as FormLogic } from '@8base/forms';
import { Dialog, Button, ModalContext } from '@8base/boost';
import { graphql } from 'react-apollo';

const CLIENT_DELETE_MUTATION = gql`
  mutation ClientDelete($id: ID!) {
    clientDelete(data: { id: $id }) {
      success
    }
  }
`;

const enhancer = graphql(CLIENT_DELETE_MUTATION, {
  name: 'clientDelete',
  options: {
    refetchQueries: ['ClientsTableContent', 'ClientsList'],
    context: {
      TOAST_SUCCESS_MESSAGE: 'Client successfully deleted',
    },
  },
});

const ClientDeleteDialog = enhancer(
  class ClientDeleteDialog extends React.Component {
    static contextType = ModalContext;

    createOnSubmit = id => async () => {
      await this.props.clientDelete({ variables: { id } });

      this.context.closeModal('CLIENT_DELETE_DIALOG_ID');
    };

    onClose = () => {
      this.context.closeModal('CLIENT_DELETE_DIALOG_ID');
    };

    renderFormContent = ({ handleSubmit, invalid, submitting }) => (
      <form onSubmit={handleSubmit}>
        <Dialog.Header title="Delete Client" onClose={this.onClose} />
        <Dialog.Body scrollable>Do you really want to delete client?</Dialog.Body>
        <Dialog.Footer>
          <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="danger" type="submit" disabled={invalid} loading={submitting}>
            Delete Client
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
        <Dialog id={'CLIENT_DELETE_DIALOG_ID'} size="sm">
          {this.renderContent}
        </Dialog>
      );
    }
  }
);

export { ClientDeleteDialog };
