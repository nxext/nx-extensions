import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'site-footer'
})
export class SiteFooter {
  displayYear(): string {
    const currentYear = (new Date()).getFullYear();
    return currentYear != 2020 ? `2020 - ${currentYear}` : `${currentYear}`;
  }
  render() {
    return (
      <Host>
        <footer class="bg-white dark:bg-gray-600 w-full bottom-0">
          <div class="container max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-6 text-textcolor">
            <p>
              © {this.displayYear()} | Released under <span id="mit">MIT License</span>
            </p>
          </div>
        </footer>
      </Host>
    );
  }
}
