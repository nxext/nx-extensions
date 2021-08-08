# Server Side Only Code

Code within the `data.server` directory will only run within nodejs at build time.

This directory can use nodejs APIs, but will be removed from the browser builds.

Any static data used to build out the page state will be added to the document by prerendering.

Should not reference any `state`, just return serializable data.
