import { Component, Element, State, h, VNode, getAssetPath } from '@stencil/core';
import { href } from '@stencil/router';

import Router from '../../router';

@Component({
  tag: 'site-header'
})
export class SiteHeader {

  @Element() el: HTMLElement;

  @State() expanded = false;
  @State() subMenuExpanded = false;

  @State() hovered: string | null = null;

  setHovered = (h: string) => () => (this.hovered = h);

  clearHover = () => (this.hovered = null);

  toggleExpanded = () => (this.expanded = !this.expanded);
  toggleSubMenu = () => (this.subMenuExpanded = !this.subMenuExpanded);

  routes: Route[] = [
    {
      name: 'Home',
      path: '/'
    }
  ];

  render() {
    const { clearHover, expanded, subMenuExpanded, hovered } = this;

    return <div class="relative">
      <div class="absolute inset-0 shadow z-30 pointer-events-none" aria-hidden="true"></div>
      <div class="relative bg-white dark:bg-gray-600 z-20">
        <div class="max-w-7xl mx-auto flex justify-between items-center px-4 py-5 sm:px-6 sm:py-4 lg:px-8 md:justify-start md:space-x-10">
          <div>
            <a {...href('/')} class="flex">
              <nxext-logo></nxext-logo>
            </a>
          </div>
          <div class="-mr-2 -my-2 md:hidden">
            <button type="button" onClick={this.toggleExpanded} class="bg-white dark:bg-gray-600 rounded-md p-2 inline-flex items-center justify-center text-gray-400 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-400" aria-expanded="false">
              <span class="sr-only">Open menu</span>

              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div class="hidden md:flex-1 md:flex md:items-center md:justify-between">
            <nav class="flex space-x-10">
              {this.routes.map((route) => (
                <NavLink
                  path={'/'}
                  hovered={hovered === route.name}
                  onHover={this.setHovered(route.name)}
                  onExit={clearHover}
                >
                  {route.name}
                </NavLink>
              ))}

              <div>
                <button type="button" onClick={this.toggleSubMenu} class="text-gray-700 dark:text-gray-200 group rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400" aria-expanded="false">
                  <span>Docs</span>

                  <svg class="text-gray-700 dark:text-gray-200 ml-2 h-5 w-5 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>

                {this.openSubNav(subMenuExpanded)}

              </div>
            </nav>
          </div>
          <div>
            <mode-switch></mode-switch>
          </div>
        </div>
      </div>

      {this.openMobileNav(expanded)}

      <site-backdrop visible={expanded} onClick={() => this.toggleExpanded()} />
      <site-backdrop visible={subMenuExpanded} onClick={() => this.toggleSubMenu()} />
    </div>
  }

  openMobileNav(expanded: boolean) {
    if(expanded) {
      return <div class="absolute z-30 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
        <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
          <div class="pt-5 pb-6 px-5 sm:pb-8">
            <div class="flex items-center justify-between">
              <div>
                <nxext-logo></nxext-logo>
              </div>
              <div class="-mr-2">
                <button type="button" onClick={this.toggleExpanded} class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-400">
                  <span class="sr-only">Close menu</span>
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="mt-6 sm:mt-8">
              <nav>
                <div class="grid gap-7 sm:grid-cols-2 sm:gap-y-8 sm:gap-x-4">
                  <a {...href('/docs/stencil/overview')} class="-m-3 flex items-center p-3 rounded-lg hover:bg-gray-50 border-2">
                    <div class="flex-shrink-0 flex items-center justify-center h-10 w-24 rounded-md text-white sm:h-12 sm:w-12">
                      <img src={getAssetPath('/assets/stenciljs-logo.png')} alt={'StencilJS'} />
                    </div>
                  </a>

                  <a {...href('/docs/svelte/overview')} class="-m-3 flex items-center p-3 rounded-lg hover:bg-gray-50 border-2">
                    <span class="inline-flex items-center justify-center h-10 w-24 rounded-md">
                      <img src={getAssetPath('/assets/svelte-logo.png')} alt={'SvelteJs'}/>
                    </span>
                  </a>
                </div>
                <div class="mt-8 text-base">
                  <a {...href('/docs')} class="font-medium text-indigo-600 hover:text-indigo-500"> View all docs <span aria-hidden="true">&rarr;</span></a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    }
  }

  openSubNav(expanded: boolean) {
    if(expanded) {
      return <div class="hidden md:block absolute z-10 top-full inset-x-0 transform shadow-lg bg-white dark:bg-gray-500">
        <div class="max-w-7xl mx-auto grid gap-y-6 px-4 py-6 sm:grid-cols-2 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-4 lg:px-8 lg:py-12 xl:py-16">
          <a {...href('/docs/stencil/overview')} class="-m-3 p-3 flex flex-col justify-between rounded-lg hover:bg-gray-50 dark:hover:bg-gray-400">
            <div class="flex md:h-full lg:flex-col">
              <div class="flex-shrink-0">
                <span class="inline-flex items-center justify-center h-10 w-24 rounded-md">
                  <img src={getAssetPath('/assets/stenciljs-logo.png')} alt={'StencilJs'}/>
                </span>
              </div>
              <div class="ml-4 md:flex-1 md:flex md:flex-col md:justify-between lg:ml-0 lg:mt-4">
                <div>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-200">
                    Add StencilJs to your Nx workspace.
                  </p>
                </div>
                <p class="mt-2 text-sm font-medium text-orange-400 lg:mt-4">Learn more <span aria-hidden="true">&rarr;</span></p>
              </div>
            </div>
          </a>

          <a {...href('/docs/svelte/overview')} class="-m-3 p-3 flex flex-col justify-between rounded-lg hover:bg-gray-50 dark:hover:bg-gray-400">
            <div class="flex md:h-full lg:flex-col">
              <div class="flex-shrink-0">
                <span class="inline-flex items-center justify-center h-10 w-24 rounded-md">
                  <img src={getAssetPath('/assets/svelte-logo.png')} alt={'SvelteJs'}/>
                </span>
              </div>
              <div class="ml-4 md:flex-1 md:flex md:flex-col md:justify-between lg:ml-0 lg:mt-4">
                <div>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-200">
                    Add SvelteJs to your Nx workspace.
                  </p>
                </div>
                <p class="mt-2 text-sm font-medium text-orange-400 lg:mt-4">Learn more <span aria-hidden="true">&rarr;</span></p>
              </div>
            </div>
          </a>
        </div>
        <div class="bg-gray-50 dark:bg-gray-600">
          <div class="max-w-7xl mx-auto space-y-6 px-4 py-5 sm:flex sm:space-y-0 sm:space-x-10 sm:px-6 lg:px-8">
            <div class="flow-root">
              <a {...href('/docs')} class="-m-3 p-3 flex items-center rounded-md text-base font-medium text-textcolor">

                <svg class="flex-shrink-0 h-6 w-6 text-textcolor" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="ml-3">View All Projects</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    }
  }
}

interface Route {
  name: string;
  path: string;
}

interface NavLinkProps {
  hovered: boolean;
  path: string;
  onHover: () => void;
  onExit: () => void;
}

const NavLink = (
  { path, hovered, onHover, onExit }: NavLinkProps,
  children: VNode
) => {
  // Detect active if path equals the route path or the current active path plus
  // the route hash equals the path, to support links like /#features
  const active = Router.path === path || Router.path + Router.hash === path;

  return (
    <a
      {...href(path)}
      onMouseOver={onHover}
      onMouseOut={onExit}
      class={{
        'text-base font-medium text-gray-700 dark:text-gray-200': true,
        'text-gray-800 dark:text-gray-100': active || hovered,
        'text-gray-500': !hovered,
      }}
    >
      {children}
    </a>
  );
};
