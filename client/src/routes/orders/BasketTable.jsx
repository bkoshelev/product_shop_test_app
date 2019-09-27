import React, { useContext } from 'react';

import { TableBuilder } from '@8base/boost';
import { BasketContext } from './BasketContext';
import { FIELD_TYPE } from '@8base/utils';

const SHOP_BASKET_TABLE_COLUMNS = [
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
        name: 'quantity',
        title: 'Quantity',
        meta: {
            isList: false,
            fieldType: FIELD_TYPE.NUMBER,
            fieldTypeAttributes: {
                format: 'NUMBER',
            },
        },
    },
];


const BasketTable = () => {

    const basketData = useContext(BasketContext);
  return  <TableBuilder
    data={basketData}
    columns={SHOP_BASKET_TABLE_COLUMNS}
/>
}

export default BasketTable;