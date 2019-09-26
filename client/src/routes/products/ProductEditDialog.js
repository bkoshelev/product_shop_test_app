import React from 'react';
import gql from 'graphql-tag';
import { Query, graphql } from 'react-apollo';
import { Form as FormLogic, Field, FieldArray } from '@8base/forms';
import {
  AsyncContent,
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

const PRODUCT_QUERY = gql`
  query ProductsEntity($id: ID!) {
  product(id: $id) {
    id
    picture {
      id
      fileId
      filename
      downloadUrl
      shareUrl
      meta
    }
    name
    description
    price
    orderItems {
      items {
        id
        _description
      }
      count
    }
  }
} 
`;

const PRODUCT_UPDATE_MUTATION = gql`
  mutation ProductUpdate($data: ProductUpdateInput!) {
    productUpdate(data: $data) {
      id
    }
  }
`;

const getRelationOptions = (items = []) =>
  items.map(item => ({ value: item.id, label: item._description || 'Untitled Record' }));

const ehnhancer = graphql(PRODUCT_UPDATE_MUTATION, {
  name: 'productUpdate',
  options: {
    refetchQueries: ['ProductsTableContent', 'ProductsList'],
    context: {
      TOAST_SUCCESS_MESSAGE: 'Product successfully updated',
    },
  },
});

const ProductEditDialog = ehnhancer(
  class ProductEditDialog extends React.PureComponent {
    static contextType = ModalContext;

    updateOnSubmit = id => async data => {
      await this.props.productUpdate({ variables: { data: { ...data, id } } });

      this.context.closeModal('PRODUCT_EDIT_DIALOG_ID');
    };

    onClose = () => {
      this.context.closeModal('PRODUCT_EDIT_DIALOG_ID');
    };

    renderForm = ({ args }) => {
      return (
        <Query query={PRODUCT_QUERY} variables={{ id: args.id }}>
          {({ data, loading }) => (
            <FormLogic
              type="UPDATE"
              tableSchemaName="Products"
              onSubmit={this.updateOnSubmit(args.id)}
              initialValues={data.product}
              formatRelationToIds
            >
              {({ handleSubmit, invalid, submitting, pristine }) => (
                <form onSubmit={handleSubmit}>
                  <Dialog.Header title="Edit Product" onClose={this.onClose} />
                  <Dialog.Body scrollable>
                    <AsyncContent loading={loading} stretch>
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
                    </AsyncContent>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button
                      color="neutral"
                      type="button"
                      variant="outlined"
                      disabled={submitting}
                      onClick={this.onClose}
                    >
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" disabled={pristine || invalid} loading={submitting}>
                      Update Product
                    </Button>
                  </Dialog.Footer>
                </form>
              )}
            </FormLogic>
          )}
        </Query>
      );
    };

    render() {
      return (
        <Dialog id={'PRODUCT_EDIT_DIALOG_ID'} size="sm">
          {this.renderForm}
        </Dialog>
      );
    }
  }
);

export { ProductEditDialog };
