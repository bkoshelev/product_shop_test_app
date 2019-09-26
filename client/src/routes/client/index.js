import React from 'react';
import { Card, Heading, Divider } from '@8base/boost';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { DateTime } from 'luxon';
import objectPath from 'object-path';
import { TableBuilder, Tag, Row } from '@8base/boost';

import { FIELD_TYPE, DATE_FORMATS } from '@8base/utils';


const CLIENT_TABLE_COLUMNS = [
  {
    name: 'email',
    title: 'Email',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.TEXT,
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
      },
    },
  },
  {
    name: 'phone',
    title: 'Phone',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.TEXT,
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
      },
    },
  },
  {
    name: 'birthday',
    title: 'Birthday',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.DATE,
      fieldTypeAttributes: {
        format: 'DATE',
      },
    },
  },
];


const CLIENT_ORDERS_COLUMNS = [
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
    title: 'Delivery',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.TEXT,
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
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
      fieldType: FIELD_TYPE.TEXT,
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
      },
    },
  },
];

const CLIENT_PAGE_QUERY = gql`
query {
  client(id: "ck0z6b5cw026r01jp23gnf57n") {
    firstName
    lastName
    email
    phone
    birthday
    orders {
      items {
        id
        address
        deliveryDt
        comment
        status
      }
    }
  }
}
`;

const enhancer = compose(
  graphql(CLIENT_PAGE_QUERY, { name: 'client' })
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

const renderRelation = (column, rowData) => {
  const dataPath = column.name.split('.');

  if (column.meta.isList) {
    return objectPath.get(rowData, [...dataPath, 'count']) || '';
  } else {
    return objectPath.get(rowData, [...dataPath, '_description']) || '';
  }
}

const renderCell = (column, rowData) => {
  switch (column.meta.fieldType) {
    case FIELD_TYPE.TEXT:
    case FIELD_TYPE.NUMBER:
      return renderScalar(column, rowData);

    case FIELD_TYPE.DATE:
      return renderDate(column, rowData);

    case FIELD_TYPE.RELATION:
      return renderRelation(column, rowData);

    default:
      return null;
  }
};

const Client = enhancer((props) => {
  console.log(props);
  const { client = { firstName: '', lastName: '' } } = props.client;
  const { firstName, lastName, orders = {
    items: [{
      id: 0,
      address: '',
      deliveryDt: '',
      comment: '',
      status: ''
    }]
  } } = client;

  return (
    <>
      <Card padding="md" stretch>
        <Card.Header>
          <Heading type="h4" text={`Client: ${firstName} ${lastName}`} />
        </Card.Header>
        <Card.Body padding="none" stretch scrollable>
          <TableBuilder
            loading={props.client.loading}
            data={[client]}
            columns={CLIENT_TABLE_COLUMNS}
            renderCell={renderCell}
          />
        </Card.Body>
      </Card>
      <Divider />

      <Card padding="md" stretch>
        <Card.Header>
          <Heading type="h4" text="Orders" />
        </Card.Header>
        <Card.Body padding="none" stretch scrollable>
          <TableBuilder
            loading={props.client.loading}
            data={orders.items}
            columns={CLIENT_ORDERS_COLUMNS}
            renderCell={renderCell}
          />
        </Card.Body>
      </Card>
    </>
  )
}
);

export { Client };
