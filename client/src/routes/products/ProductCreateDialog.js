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

const PRODUCT_CREATE_MUTATION = gql`
  mutation ProductCreate($data: ProductCreateInput!) {
    productCreate(data: $data) {
      id
    }
  }
`;

const getRelationOptions = (items = []) =>
  items.map(item => ({ value: item.id, label: item._description || 'Untitled Record' }));

const enhancer = graphql(PRODUCT_CREATE_MUTATION, {
  name: 'productCreate',
  options: {
    refetchQueries: ['ProductsTableContent', 'ProductsList'],
    context: {
      TOAST_SUCCESS_MESSAGE: 'Product successfully created',
    },
  },
});

const ProductCreateDialog = enhancer(
  class ProductCreateDialog extends React.PureComponent {
    static contextType = ModalContext;

    onSubmit = async data => {
      await this.props.productCreate({ variables: { data } });

      this.context.closeModal('PRODUCT_CREATE_DIALOG_ID');
    };

    onClose = () => {
      this.context.closeModal('PRODUCT_CREATE_DIALOG_ID');
    };

    renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
      <form onSubmit={handleSubmit}>
        <Dialog.Header title="New Product" onClose={this.onClose} />
        <Dialog.Body scrollable>
          <Grid.Layout gap="md" stretch>
            <Grid.Box>
              <Field name="picture" label="Picture" component={FileInputField} />
            </Grid.Box>
            <Grid.Box>
              <Field name="name" label="Name" component={InputField} />
            </Grid.Box>
            <Grid.Box>
              <Field name="description" label="Description" component={InputField} />
            </Grid.Box>
            <Grid.Box>
              <Field name="price" label="Price" type="number" component={InputField} />
            </Grid.Box>
          </Grid.Layout>
        </Dialog.Body>
        <Dialog.Footer>
          <Button color="neutral" type="button" variant="outlined" disabled={submitting} onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit" loading={submitting}>
            Create Product
          </Button>
        </Dialog.Footer>
      </form>
    );

    render() {
      return (
        <Dialog id={'PRODUCT_CREATE_DIALOG_ID'} size="sm">
          <FormLogic type="CREATE" tableSchemaName="Products" onSubmit={this.onSubmit} formatRelationToIds>
            {this.renderFormContent}
          </FormLogic>
        </Dialog>
      );
    }
  }
);

export { ProductCreateDialog };
