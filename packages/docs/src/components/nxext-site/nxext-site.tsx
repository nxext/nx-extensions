import { Component, h } from '@stencil/core';
import { Routes } from '../../router';

@Component({
  tag: 'nxext-site',
})
export class App {
  render() {
    return (
      <div class="flex flex-col h-screen bg-white dark:bg-gray-500">

        <site-header></site-header>

        <div class="content flex-grow">
          <Routes />
        </div>

        <site-footer></site-footer>

      </div>
    );
  }
}
