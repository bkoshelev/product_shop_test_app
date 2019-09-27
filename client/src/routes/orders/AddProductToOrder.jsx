import React, { useState, useContext } from 'react';
import { Button, Icon, Input } from '@8base/boost';
import { BasketUpdateContext } from './BasketContext';
import { clone} from 'ramda';

const AddProductToOrder = ({ rowData }) => {
    const [state, setState] = useState(0);

    const updateBasket = useContext(BasketUpdateContext);

    return <>
    <Input name="input" type="number" value={state} width={5} stretch={true} onChange={setState} />
    <Button onClick={() => {
        updateBasket((prevState) => {
            const newState = clone(prevState);
            const isIncludes = newState.findIndex( (product) => product.id === rowData.id)
            if (isIncludes !== -1) {
                newState[isIncludes].quantity = newState[isIncludes].quantity + Number(state);
            } else {
                newState.push({ ...rowData, quantity: Number(state)});
            }
            setState(0)
            return newState;
        }) 
    }}><Icon name="Add" ></Icon></Button>
    </>
}

export default AddProductToOrder;