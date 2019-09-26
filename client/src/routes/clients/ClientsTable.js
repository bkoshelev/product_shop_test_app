import React from 'react';
import gql from 'graphql-tag';
import objectPath from 'object-path';
import { graphql, compose } from 'react-apollo';
import { DateTime } from 'luxon';
import { TableBuilder, Dropdown, Icon, Menu, Link, Tag, Row, withModal } from '@8base/boost';
import { FIELD_TYPE, SMART_FORMATS, FILE_FORMATS, DATE_FORMATS, SWITCH_FORMATS, SWITCH_VALUES } from '@8base/utils';

const CLIENTS_LIST_QUERY = gql`
query ClientsTableContent($filter: ClientFilter, $orderBy: [ClientOrderBy], $after: String, $before: String, $first: Int, $last: Int, $skip: Int) {
  clientsList(filter: $filter, orderBy: $orderBy, after: $after, before: $before, first: $first, last: $last, skip: $skip) {
    items {
      id
      firstName
      lastName
      email
      phone
      birthday
      _description
    }
    count
  }
}
`;

const TABLE_COLUMNS = [
  {
    name: 'firstName',
    title: 'FirstName',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.TEXT,
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
      },
    },
  },
  {
    name: 'lastName',
    title: 'LastName',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.TEXT,
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
      },
    },
  },
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
  {
    name: 'edit',
    title: '',
    width: '60px',
  },
];

const enhancer = compose(
  withModal,
  graphql(CLIENTS_LIST_QUERY, { name: 'clients' })
);

const ClientsTable = enhancer(
  class ClientsTable extends React.PureComponent {
    renderEdit = rowData => (
      <Dropdown defaultOpen={false}>
        <Dropdown.Head>
          <Icon name="More" size="sm" color="LIGHT_GRAY2" />
        </Dropdown.Head>
        <Dropdown.Body pin="right">
          {({ closeDropdown }) => (
            <Menu>
              <Menu.Item
                onClick={() => {
                  this.props.openModal('CLIENT_EDIT_DIALOG_ID', { id: rowData.id });
                  closeDropdown();
                }}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  this.props.openModal('CLIENT_DELETE_DIALOG_ID', { id: rowData.id });
                  closeDropdown();
                }}
              >
                Delete
              </Menu.Item>
            </Menu>
          )}
        </Dropdown.Body>
      </Dropdown>
    );

    renderItems = (column, rowData, handler) => {
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

    renderScalar = (column, rowData) => {
      return this.renderItems(column, rowData, item => item);
    };

    renderDate = (column, rowData) => {
      const dateFormat =
        column.meta.fieldTypeAttributes.format === DATE_FORMATS.DATE ? DateTime.DATE_SHORT : DateTime.DATETIME_SHORT;

      return this.renderItems(column, rowData, item => DateTime.fromISO(item).toLocaleString(dateFormat));
    };

    renderRelation = (column, rowData) => {
      const dataPath = column.name.split('.');

      if (column.meta.isList) {
        return objectPath.get(rowData, [...dataPath, 'count']) || '';
      } else {
        return objectPath.get(rowData, [...dataPath, '_description']) || '';
      }
    };

    renderCell = (column, rowData) => {
      if (column.name === 'edit') {
        return this.renderEdit(rowData);
      }

      switch (column.meta.fieldType) {
        case FIELD_TYPE.TEXT:
        case FIELD_TYPE.NUMBER:
          return this.renderScalar(column, rowData);

        case FIELD_TYPE.DATE:
          return this.renderDate(column, rowData);

        case FIELD_TYPE.RELATION:
          return this.renderRelation(column, rowData);

        default:
          return null;
      }
    };

    openCreateModal = () => {
      const { openModal } = this.props;

      openModal('CLIENT_CREATE_DIALOG_ID');
    };

    render() {
      const { clients } = this.props;
      const tableData = objectPath.get(clients, ['clientsList', 'items']) || [];

      return (
        <TableBuilder
          loading={clients.loading}
          data={tableData}
          columns={TABLE_COLUMNS}
          action="Create Client"
          renderCell={this.renderCell}
          onActionClick={this.openCreateModal}
        />
      );
    }
  }
);

export { ClientsTable };
