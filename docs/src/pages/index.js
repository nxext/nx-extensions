import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>StencilJs</>,
    imageUrl: 'img/stenciljs-logo.png',
    description: (
      <>
        Stencil is a toolchain for building reusable, scalable Design Systems.
        Generate small, blazing fast, and 100% standards based Web Components
        that run in every browser.
      </>
    ),
  },
  {
    title: <>Nx devtools</>,
    imageUrl: 'img/nx-logo.png',
    description: (
      <>
        Nx is a set of extensible dev tools for monorepos, which helps you
        develop like Google, Facebook, and Microsoft.
      </>
    ),
  },
  {
    title: <>Svelte</>,
    imageUrl: 'img/svelte-logo.png',
    description: (
      <>
        Svelte is a radical new approach to building user interfaces. Whereas
        traditional frameworks like React and Vue do the bulk of their work in
        the browser, Svelte shifts that work into a compile step that happens
        when you build your app.
      </>
    ),
  },
  {
    title: <>SolidJS</>,
    imageUrl: 'img/solidjs-logo.png',
    description: (
      <>Simple and performant reactivity for building user interfaces.</>
    ),
  },
  {
    title: <>Vite</>,
    imageUrl: 'img/vite.svg',
    description: <>Next Generation Frontend Tooling</>,
  },
  /*{
    title: <>React</>,
    imageUrl: 'img/react.svg',
    description: <>A JavaScript library for building user interfaces</>,
  },*/
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className={styles.featureBox}>
          <div className="text--center">
            <img className={styles.featureImage} src={imgUrl} alt={title} />
          </div>
        </div>
      )}
      <h3>{title}</h3>
      <blockquote>{description}</blockquote>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Bring StencilJS and Svelte to Nx devtools"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/nxext/introduction')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
