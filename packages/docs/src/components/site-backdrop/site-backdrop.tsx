import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'site-backdrop'
})
export class SiteBackdrop {
  @Prop() visible = false;
  @Prop() withColor = true

  render() {
    return (
      <Host
        tabindex="-1"
        class={{
          'fixed top-0 left-0 right-0 opacity-0 bg-gray-600 z-10 h-full transition duration-150 ease-in-out': true,
          'hidden': !this.visible,
          'opacity-80': this.visible && this.withColor,
          'pointer-events-auto': this.visible,
        }}
      />
    );
  }
}
