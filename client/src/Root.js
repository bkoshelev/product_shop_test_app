import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ProtectedRoute } from './shared/components';
import { MainPlate, ContentPlate, Nav } from './components';
import { Auth } from './routes/auth';
/** __APP_PAGES_IMPORTS__ */
import { Orders } from './routes/orders';
import { Clients } from './routes/clients';
import { Client } from './routes/client';

export const Root = () => (
  <Switch>
    <Route path="/auth" component={Auth} />
    <ProtectedRoute>
      <MainPlate>
        <Nav.Plate color="BLUE">
          {/** __APP_ROUTE_LINKS__ */}
          <Nav.Item to="/orders" label="Orders" />
          <Nav.Item to="/clients" label="Clients" />
        </Nav.Plate>
        <ContentPlate>
          <Switch>
            {/** __APP_ROUTES__ */}
            <ProtectedRoute exact path="/orders" component={Orders} />
            <ProtectedRoute exact path="/clients" component={Clients} />
            <ProtectedRoute exact path="/client/:id" component={Client} />
          </Switch>
        </ContentPlate>
      </MainPlate>
    </ProtectedRoute>
  </Switch>
);
