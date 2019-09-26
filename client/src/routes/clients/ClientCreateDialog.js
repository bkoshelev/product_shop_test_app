import React from 'react';
import gql from 'graphql-tag';
import { Query, graphql } from 'react-apollo';
import { Form as FormLogic, Field, FieldArray } from '@8base/forms';
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

const CLIENT_CREATE_MUTATION = gql`
  mutation ClientCreate($data: ClientCreateInput!) {
    clientCreate(data: $data) {
      id
    }
  }
`;

const getRelationOptions = (items = []) =>
  items.map(item => ({ value: item.id, label: item._description || 'Untitled Record' }));

const enhancer = graphql(CLIENT_CREATE_MUTATION, {
  name: 'clientCreate',
  options: {
    refetchQueries: ['ClientsTableContent', 'ClientsList'],
    context: {
      TOAST_SUCCESS_MESSAGE: 'Client successfully created',
    },
  },
});

const ClientCreateDialog = enhancer(
  class ClientCreateDialog extends React.PureComponent {
    static contextType = ModalContext;

    onSubmit = async data => {
      await this.props.clientCreate({ variables: { data } });

      this.context.closeModal('CLIENT_CREATE_DIALOG_ID');
    };

    onClose = () => {
      this.context.closeModal('CLIENT_CREATE_DIALOG_ID');
    };

    renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
      <form onSubmit={handleSubmit}>
        <Dialog.Header title="New Client" onClose={this.onClose} />
        <Dialog.Body scrollable>
          <Grid.Layout gap="md" stretch>
            <Grid.Box>
              <Field name="firstName" label="First Name" component={InputField} />
            </Grid.Box>
            <Grid.Box>
              <Field name="lastName" label="Last Name" component={InputField} />
            </Grid.Box>
            <Grid.Box>
              <Field name="email" label="Email" component={InputField} />
            </Grid.Box>
            <Grid.Box>
              <Field name="phone" label="Phone" component={InputField} />
            </Grid.Box>
            <Grid.Box>
              <Field name="birthday" label="Birthday" withTime={false} component={DateInputField} />
            </Grid.Box>
          </Grid.Layout>
        </Dialog.Body>
        <Dialog.Footer>
          <Button color="neutral" type="button" variant="outlined" disabled={submitting} onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit" loading={submitting}>
            Create Client
          </Button>
        </Dialog.Footer>
      </form>
    );

    render() {
      return (
        <Dialog id={'CLIENT_CREATE_DIALOG_ID'} size="sm">
          <FormLogic type="CREATE" tableSchemaName="Clients" onSubmit={this.onSubmit} formatRelationToIds>
            {this.renderFormContent}
          </FormLogic>
        </Dialog>
      );
    }
  }
);

export { ClientCreateDialog };
