import { Component, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'error-page'
})
export class ErrorPage implements ComponentInterface {
  render() {
    return (<div class="min-h-screen pt-16 pb-12 flex flex-col bg-white">
      <main class="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex-shrink-0 flex justify-center">
          <a href="/" class="inline-flex">
            <span class="sr-only">Workflow</span>
            <img class="h-12 w-auto"
                 src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600" alt=""/>
          </a>
        </div>
        <div class="py-16">
          <div class="text-center">
            <p class="text-sm font-semibold text-indigo-600 uppercase tracking-wide">404 error</p>
            <h1 class="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found.</h1>
            <p class="mt-2 text-base text-gray-500">Sorry, we couldn’t find the page you’re looking for.</p>
            <div class="mt-6">
              <a href="#" class="text-base font-medium text-indigo-600 hover:text-indigo-500">Go back home<span
                aria-hidden="true"> &rarr;</span></a>
            </div>
          </div>
        </div>
      </main>
      <footer class="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex justify-center space-x-4">
          <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-600">Contact Support</a>
          <span class="inline-block border-l border-gray-300" aria-hidden="true"></span>
          <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-600">Status</a>
          <span class="inline-block border-l border-gray-300" aria-hidden="true"></span>
          <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-600">Twitter</a>
        </nav>
      </footer>
    </div>);
  }
}
