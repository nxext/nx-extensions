import { Component, h, getAssetPath, State, ComponentInterface } from '@stencil/core';
import { ModeType, onChange } from '../../store';

@Component({
  tag: 'nxext-logo'
})
export class NxextLogo implements ComponentInterface {

  @State() file = '/assets/logo-dark.svg';

  componentWillLoad() {
    onChange('pageTheme', (value: ModeType) => {
      if(value === ModeType.Light) {
        this.file = '/assets/logo-dark.svg';
      } else {
        this.file = '/assets/logo-light.svg';
      }
    })
  }

  render() {
    return ([
      <span class="sr-only">Nxext</span>,
      <img class="h-8 w-auto sm:h-10" src={getAssetPath(this.file)} alt=""/>
    ]);
  }
}
