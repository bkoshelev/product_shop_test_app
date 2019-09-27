import React, { useState } from 'react';
import { TableBuilder, Button, Icon, Input, Tag, Row } from '@8base/boost';
import { FIELD_TYPE } from '@8base/utils';
import objectPath from 'object-path';
import AddProductToOrder from './AddProductToOrder';

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

const PRODUCTS_TABLE_COLUMNS = [
    {
        name: 'name',
        title: 'Name',
        meta: {
            isList: false,
            fieldType: FIELD_TYPE.TEXT,
            fieldTypeAttributes: {
                format: 'UNFORMATTED',
            },
        },
    },

    {
        name: 'price',
        title: 'Price',
        meta: {
            isList: false,
            fieldType: FIELD_TYPE.NUMBER,
            fieldTypeAttributes: {
                format: 'NUMBER',
            },
        },
    },
    {
        name: 'add',
        title: 'Add',
        meta: {
            isList: false,
            fieldType: FIELD_TYPE.SMART,
            fieldTypeAttributes: {
                format: 'SMART',
            },
        },
    },
];


const ProductsTable = ({ loading, data }) => {
    const [state, setState] = useState({});

    const productsTableRenderCell = (column, rowData) => {
        if (column.name === 'add') {
            return <AddProductToOrder {...{ rowData}}> </AddProductToOrder>
        }
        return renderItems(column, rowData, item => item);
    }


    if (loading) return <TableBuilder
        data={[]}
        columns={PRODUCTS_TABLE_COLUMNS}
    />;

    return <TableBuilder
        data={data.productsList.items}
        columns={PRODUCTS_TABLE_COLUMNS}
        renderCell={productsTableRenderCell}

    />
}

export default React.memo(ProductsTable);