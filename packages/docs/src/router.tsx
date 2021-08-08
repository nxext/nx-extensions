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
    <Route path="/">
      <landing-page />
    </Route>

    <Route
      path={matchAny(['/docs', '/docs/:id*'])}
      mapParams={staticState(getDocsData)}
      render={(_, data) => {
        return (
        <Fragment>
          <docs-page data={data} />
        </Fragment>
      )}}
    />
  </Router.Switch>
);
