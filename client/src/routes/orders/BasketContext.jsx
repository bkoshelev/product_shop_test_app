import React, { useState} from 'react';

const BasketContext = React.createContext([]);
const BasketUpdateContext = React.createContext(() => {});

const BasketContextProvider= props => {
  const [basket, updateBasket] = useState([])

  return (
    <BasketUpdateContext.Provider
      value={updateBasket}>
      <BasketContext.Provider value={basket}>
        {props.children}
      </BasketContext.Provider>
    </BasketUpdateContext.Provider>
  );
};

export {
    BasketContext,
    BasketUpdateContext,
    BasketContextProvider,
};