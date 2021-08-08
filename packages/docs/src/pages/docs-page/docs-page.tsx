import {
  Component,
  Prop,
  ComponentInterface,
  State,
  h,
  Fragment
} from '@stencil/core';
import Helmet from '@stencil/helmet';
import { RenderJsxAst } from '@stencil/ssg';
import { DocsData } from '../../data.server/docs';
import { href } from '@stencil/router';
import state from '../../store';
import { ErrorPage } from '../error-page/error-page';
import Router from '../../router';

@Component({
  tag: 'docs-page'
})
export class DocsComponent implements ComponentInterface {
  menuEl: HTMLDocsMenuElement;

  @Prop() data: DocsData;
  @State() showBackdrop = true;

  backdropClicked = () => {
    state.menuShown = !state.menuShown;
  };

  Head = () => (
    <Helmet>
      <title>{this.data.title ? `${this.data.title} - Nxext` : 'Nxext'}</title>
      {this.data.description && (
        <meta
          name="description"
          content={`${this.data.description} - Nxext Documentation`}
        />
      )}
    </Helmet>
  );

  render() {
    const { data, Head } = this;

    if (!data) {
      return <ErrorPage></ErrorPage>;
    }

    return (
      <Fragment>
        <Head></Head>

        <div class="h-screen flex overflow-hidden">
          <div class="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true">

            <div class={{
              "fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300": true,
              "opacity-0": !state.docsMenuShown,
              "opacity-100": state.docsMenuShown
            }} aria-hidden="true"></div>

            <div class={{
              "relative flex-1 flex flex-col max-w-xs bg-white dark:bg-gray-600": true,
              "transition ease-in-out duration-300 transform": true,
              "-translate-x-full": !state.docsMenuShown,
              "translate-x-0": state.docsMenuShown
            }}>
              <div class="absolute top-0 right-0 -mr-12 pt-2">
                <button type="button"
                        class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => { state.docsMenuShown = !state.docsMenuShown }}>
                  <span class="sr-only">Close sidebar</span>
                  <svg class="h-6 w-6 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div class="flex-shrink-0 flex items-center px-4">
                  <a {...href('/')} class="flex">
                    <nxext-logo></nxext-logo>
                  </a>
                </div>
                <nav class="mt-5 px-2 space-y-1">
                  <docs-menu
                    ref={(el) => (this.menuEl = el)}
                    toc={data.tableOfContents}
                    activePath={Router.path}
                  />
                </nav>
              </div>
            </div>

            <div class="flex-shrink-0 w-14"></div>
          </div>

          <div class="hidden md:flex md:flex-shrink-0">
            <div class="flex flex-col w-64">
              <div class="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-600 border-r border-gray-200 dark:border-gray-600">
                <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                  <docs-menu
                    ref={(el) => (this.menuEl = el)}
                    toc={data.tableOfContents}
                    activePath={Router.path}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-0 flex-1 overflow-hidden">
            <div class="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
              <button type="button"
                      class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span class="sr-only">Open sidebar</span>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
            <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none">
              <div class="py-6">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
                </div>
                <div
                  class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-gray-800 dark:text-gray-100 prose lg:prose-xl pt-10 px-6">
                  <div class="py-4">
                    <RenderJsxAst
                      ast={data.ast}
                      elementProps={elementRouterHref}
                    />

                    {listOptions(data.options)}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </Fragment>
    );
  }
}

function listOptions(options) {
  if (options) {
    return <Fragment>
      <h2>Options:</h2>

      {
        options.map(option => <Fragment>
          <h3 id={option.name}>
            <a aria-hidden="true" class="heading-anchor" href={option.name}></a>
            –{option.name}
          </h3>
          {option.alias && <p>
            Alias(es): {option.alias}
          </p>}
          <p>
            Type: `{option.type}`
          </p>
          <p>{option.description}</p>
        </Fragment>)
      }
    </Fragment>;
  }
}

const elementRouterHref = (tagName: string, props: any) => {
  if (tagName === 'a' && typeof props.href === 'string') {
    const currentHost = new URL(document.baseURI).host;
    const gotoHost = new URL(props.href, document.baseURI).host;

    if (currentHost !== gotoHost) {
      return {
        ...props,
        target: '_blank',
        class: 'text-gray-500 dark:text-gray-300 external-link',
        rel: 'noopener'
      };
    }

    return {
      ...props,
      ...href(props.href),
      class: 'text-gray-500 dark:text-gray-300'
    };
  }
  return props;
};

/*
<docs-menu
  ref={(el) => (this.menuEl = el)}
  toc={data.tableOfContents}
  activePath={Router.path}
/>

<site-backdrop
  visible={showBackdrop}
  onClick={this.backdropClicked}
/>
*/
