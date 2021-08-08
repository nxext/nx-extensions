import { Fragment, h } from '@stencil/core';
import {
  Route,
  createStaticRouter,
  staticState,
  matchAny,
} from '@stencil/router';
import { getDocsData } from './data.server/docs';

export const Router = createStaticRouter();

export default Router;
export const Routes = () => (
  <Router.Switch>
    <Route
      path="/"
      render={() => (
        <Fragment>
          <landing-page />
        </Fragment>
      )}
    />

    <Route
      path={matchAny(['/docs/:id*', '/docs'])}
      mapParams={staticState(getDocsData)}
      render={(_, data) => <docs-page data={data} />}
    />
  </Router.Switch>
);
