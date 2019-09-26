import React from 'react';
import styled from 'react-emotion';
import { Grid, Navigation } from '@8base/boost';

const NavTag = styled(Navigation)(props => console.log(props) || ({
  position: 'fixed',
  left: 0,
  zIndex: 1000,
}));

const NavPlate = ({ children, ...rest }) => (
  <Grid.Box area="nav">
    <NavTag {...rest}>{children}</NavTag>
  </Grid.Box>
);

export { NavPlate };
