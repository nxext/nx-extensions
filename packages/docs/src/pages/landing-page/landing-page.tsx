import { Component, getAssetPath, h, Host } from '@stencil/core';
import Helmet from '@stencil/helmet';

@Component({
  tag: 'landing-page'
})
export class LandingPage {

  render() {
    return (
      <Host>
        <div class="container mx-auto px-8">
          <Head />

          <main class="flex flex-col-reverse sm:flex-row jusitfy-between items-center py-12">
            <div class="sm:w-2/5 flex flex-col items-center sm:items-start text-center sm:text-left">
              <h1 class="uppercase text-6xl text-gray-800 dark:text-gray-200 font-bold leading-none tracking-wide mb-2">
                Nxext
              </h1>
              <h2 class="uppercase text-2xl text-orange-400 dark:text-orange-200 tracking-widest mb-6">
                StencilJs for Nx
              </h2>
              <p class="text-gray-800 dark:text-gray-100 leading-relaxed mb-12">
                Lorem ipsum dolor sit amet, consectetur adipiscing. Vestibulum
                rutrum metus at enim congue scelerisque. Sed suscipit metu non
                iaculis semper consectetur adipiscing elit.
              </p>
              <a
                href="#"
                class="bg-brand py-3 px-6 uppercase text-lg font-bold text-white rounded-md shadow-xl hover:shadow-none"
              >
                Getting started
              </a>
            </div>
            <div class="mb-16 sm:mb-0 mt-8 sm:mt-0 sm:w-3/5 sm:pl-12">
              <img src={getAssetPath('/assets/mainpage.svg')} />
            </div>
          </main>
        </div>
      </Host>
    );
  }
}

const Head = () => (
  <Helmet>
    <title>Nxext - StencilJs meets Nx</title>
    <meta
      name="description"
      content={'Build StencilJS project in Nx'}
    />
    <meta
      property="og:description"
      content="Build StencilJS project in Nx"
    />
    <meta property="og:site_name" content="Nxext.dev"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:site" content="@dominik_pieper"/>
    <meta name="twitter:creator" content="dominik_pieper"/>
    <meta name="twitter:title" content="Build StencilJS apps and libs in Nxdevtools"/>
    <meta name="twitter:description" content="Build StencilJS apps and libs in Nxdevtools"/>
    <meta name="twitter:image" content={getAssetPath('/assets/sm-cover.jpg')}/>
    <meta property="og:image" content={getAssetPath('/assets/sm-cover.jpg')}/>
    <meta property="og:url" content="https://nxext.dev/"/>
  </Helmet>
);
