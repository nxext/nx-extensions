import {
  Component,
  ComponentInterface,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { href } from '@stencil/router';
import type { TableOfContents } from '@stencil/ssg';
import state from '../../store';

@Component({
  tag: 'docs-menu'
})
export class SiteMenu implements ComponentInterface {
  template = 'docs';
  @Prop() toc: TableOfContents;
  @Prop() activePath: string;

  @State() expands: { [key: string]: number[] } = {
    docs: []
  };

  @State() showOverlay = false;

  componentWillLoad() {
    this.expandActive();
  }

  @Watch('activePath')
  expandActive() {
    if (this.toc?.root) {
      const activeIndex = this.toc.root.findIndex(
        t => t.children && t.children.some(c => c.url === this.activePath),
      );
      if (
        activeIndex > -1 &&
        !this.expands[this.template].includes(activeIndex)
      ) {
        this.expands = {
          ...this.expands,
          [this.template]: [...this.expands[this.template], activeIndex],
        };
      }
    }
  }

  toggleParent = (itemNumber: number) => {
    return (e: MouseEvent) => {
      e.preventDefault();

      if (this.expands[this.template].includes(itemNumber)) {
        this.expands[this.template].splice(
          this.expands[this.template].indexOf(itemNumber),
          1,
        );
      } else {
        this.expands[this.template] = [
          ...this.expands[this.template],
          itemNumber,
        ];
      }
      this.expands = { ...this.expands };
    };
  };

  itemIsExpanded(itemNumber: number) {
    return this.expands[this.template].includes(itemNumber);
  }

  render() {
    return (
      <nav class={{
        "mt-5 flex-1 px-2 space-y-1": true,
        "translate-x-0": state.menuShown,
        "-translate-x-full sm:translate-x-0": !state.menuShown
      }}>
        {this.toc?.root.map((item, itemNumber) => {
          const expanded = this.itemIsExpanded(itemNumber);

          if (item.children && item.children.length > 0) {
            return (
              <div class={{
                "bg-gray-200 dark:bg-gray-500 rounded-md": this.itemIsExpanded(itemNumber)
              }}>
                <button class={{
                  "w-full flex justify-between items-center py-2 px-4 text-textcolor hover:text-highlight-primary font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none cursor-pointer": true,
                  "text-highlight-primary": this.itemIsExpanded(itemNumber)
                }} onClick={this.toggleParent(itemNumber)}>
                  <span class="flex items-center">
                    <span class="mx-2 font-medium">
                      {item.text}
                    </span>
                  </span>

                  <span>
                    {this.showChevron(expanded)}
                  </span>
                </button>
                <div class={{
                  "bg-gray-200 dark:bg-gray-500 font-medium rounded-b-md": true,
                  "block": expanded,
                  "hidden": !expanded
                }}>
                  {item.children && item.children.map(childItem => {
                    const isActive = childItem.url === this.activePath;
                    if(childItem.children && childItem.children.length > 0) {
                      return (
                        <a {...href(childItem.url)} class={{
                          "py-2 px-8 block text-sm text-textcolor hover:bg-gray-200 dark:hover:bg-gray-500 hover:text-highlight-primary": true,
                          "text-highlight-primary": isActive
                        }}>
                          {childItem.text}
                        </a>
                      );
                    } else {
                      return (
                        <a {...href(childItem.url)} class={{
                          "py-2 px-8 block text-sm text-textcolor hover:bg-gray-200 dark:hover:bg-gray-500 hover:text-highlight-primary": true,
                          "text-highlight-primary": isActive
                        }}>
                          {childItem.text}
                        </a>
                      );
                    }
                  })}
                </div>
              </div>
            );
          }
        })}
      </nav>
    );
  }

  private showChevron(expanded: boolean) {
    return (
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {expanded
          ? <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round"></path>
          : <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round"></path>
        }
      </svg>
    );
  }
}
