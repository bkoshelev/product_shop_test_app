import React from 'react';
import { Card, Heading, Divider } from '@8base/boost';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { DateTime } from 'luxon';
import objectPath from 'object-path';
import { TableBuilder, Tag, Row } from '@8base/boost';

import { FIELD_TYPE, DATE_FORMATS, SWITCH_FORMATS, SWITCH_VALUES } from '@8base/utils';


const ORDER_TABLE_COLUMNS = [
  {
    name: 'client.fullName',
    title: 'Client',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.RELATION,
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
      },
    },
  },
  {
    name: 'address',
    title: 'Address',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.TEXT,
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
      },
    },
  },
  {
    name: 'deliveryDt',
    title: 'DeliveryDt',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.DATE,
      fieldTypeAttributes: {
        format: 'DATETIME',
      },
    },
  },
  {
    name: 'comment',
    title: 'Comment',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.TEXT,
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
      },
    },
  },
  {
    name: 'status',
    title: 'Status',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.SWITCH,
      fieldTypeAttributes: {
        format: 'CUSTOM',
      },
    },
  }
];


const ORDER_PRODUCTS_TABLE_COLUMNS = [
  {
    name: 'product.name',
    title: 'Name',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.RELATION,
      fieldTypeAttributes: {
        format: '',
      },
    },
  },
  {
    name: 'product.price',
    title: 'Price',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.RELATION,
      fieldTypeAttributes: {
        format: 'NUMBER',
      },
    },
  },
  {
    name: 'product.quantity',
    title: 'Quantity',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.RELATION,
      fieldTypeAttributes: {
        format: 'NUMBER',
      },
    },
  }
];

const ORDER_PAGE_QUERY = gql`
query ($id: ID) {
  order(id: $id) {
    id
    client {
        id
        firstName
        lastName
        _description
    }
    address
    deliveryDt
    comment
    status
    orderItems {
      items {
        product {
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
      _description
        }
        quantity
      }
    }
  }
  }
`;

const enhancer = compose(
  graphql(ORDER_PAGE_QUERY,
    {
      name: 'order',
      options: (props) => ({ variables: { id: props.computedMatch.params.id } }),
    })

);

const renderItems = (column, rowData, handler) => {
  const dataPath = column.name.split('.');
  const cellData = objectPath.get(rowData, dataPath) || '';

  if (column.meta.isList) {
    const itemsArray = cellData.items ? cellData.items : cellData;

    return (
      <Row style={{ flexWrap: 'wrap' }}>
        {itemsArray && itemsArray.map(item => !!item && <Tag color="LIGHT_GRAY2">{handler(item)}</Tag>)}
      </Row>
    );
  } else {
    return cellData && <div>{handler(cellData)}</div>;
  }
};

const renderScalar = (column, rowData) => {
  return renderItems(column, rowData, item => item);
};

const renderDate = (column, rowData) => {
  const dateFormat =
    column.meta.fieldTypeAttributes.format === DATE_FORMATS.DATE ? DateTime.DATE_SHORT : DateTime.DATETIME_SHORT;

  return renderItems(column, rowData, item => DateTime.fromISO(item).toLocaleString(dateFormat));
};

const renderSwitch = (column, rowData) => {
  if (column.meta.fieldTypeAttributes.format === SWITCH_FORMATS.CUSTOM) {
    return renderItems(column, rowData, item => item);
  } else {
    return renderItems(column, rowData, item => SWITCH_VALUES[column.meta.fieldTypeAttributes.format][item]);
  }
};

const renderRelation = (column, rowData) => {

  if (column.name === 'client.fullName') {
    console.log(column.name, rowData, objectPath.get(rowData, ['client', 'firstName']))
    const firstName = objectPath.get(rowData, ['client', 'firstName']) || '';
    const lastName = objectPath.get(rowData, ['client', 'lastName']) || '';

    return `${firstName} ${lastName}`;

  }

  
  if (column.name === 'product.quantity') {
    return objectPath.get(rowData, ['quantity']) || '';
  }
  
  if (column.name === 'product.name') {
    return objectPath.get(rowData, ['product', 'name']) || '';
  }

  if (column.name === 'product.price') {
    return objectPath.get(rowData, ['product', 'price']) || '';
  }
}

const renderCell = (column, rowData) => {

  if (column.name === 'edit') {
    return this.renderEdit(rowData);
  }

  switch (column.meta.fieldType) {
    case FIELD_TYPE.TEXT:
    case FIELD_TYPE.NUMBER:
      return renderScalar(column, rowData);

    case FIELD_TYPE.DATE:
      return renderDate(column, rowData);

    case FIELD_TYPE.SWITCH:
      return renderSwitch(column, rowData);

    case FIELD_TYPE.RELATION:
      return renderRelation(column, rowData);

    default:
      return null;
  }
};

const Order = enhancer((props) => {
  const { order = {
    id: '',
    address: '',
    deliveryDt: '',
    comment: '',
    status: ''
  } } = props.order;
  const { id, orderItems = {
    items: [{
      product: {
        name: ''
      },
      quantity: 0
    }]
  } } = order;

  console.log({ orderItems})

  return (
    <>
      <Card padding="md" stretch>
        <Card.Header>
          <Heading type="h4" text={`Order: #${id}`} />
        </Card.Header>
        <Card.Body padding="none" stretch scrollable>
          <TableBuilder
            loading={props.order.loading}
            data={[order]}
            columns={ORDER_TABLE_COLUMNS}
            renderCell={renderCell}
          />
        </Card.Body>
      </Card>
      <Divider />

      <Card padding="md" stretch>
        <Card.Header>
          <Heading type="h4" text="Products" />
        </Card.Header>
        <Card.Body padding="none" stretch scrollable>
          <TableBuilder
            loading={props.order.loading}
            data={orderItems.items}
            columns={ORDER_PRODUCTS_TABLE_COLUMNS}
            renderCell={renderCell}
          />
        </Card.Body>
      </Card>
    </>
  )
}
);

export { Order };
