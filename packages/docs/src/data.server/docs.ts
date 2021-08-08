import type { MapParamData } from '@stencil/router';
import {
  getPageNavigation,
  MarkdownResults,
  PageNavigation,
  parseMarkdown,
  parseTableOfContents,
  TableOfContents
} from '@stencil/ssg/parse';
import { join } from 'path';
import fs from 'fs';

const repoRootDir = join(__dirname, '..', '..', '..', '..', '..', '..', '..');
const pagesDir = join(repoRootDir, 'packages', 'docs', 'data');
const docsDir = join(pagesDir, 'docs');

export interface DocsData extends MarkdownResults {
  contributors?: string[];
  lastUpdated?: string;
  navigation?: PageNavigation;
  editUrl?: string;
  tableOfContents?: TableOfContents;
  options?: any[];
}

export const getDocsData: MapParamData = async ({ id }) => {
  if (!id) {
    id = 'nxext/index';
  }

  const pagePath = join(docsDir, id);
  const pageFilePath = `${pagePath}.md`;

  if (!fs.existsSync(pageFilePath)) {
    return;
  }
  const results: DocsData = await parseMarkdown(pageFilePath, {
    headingAnchors: true,
    beforeHtmlSerialize(document: DocumentFragment) {
      hookUpDesignSystem(document);
    }
  });

  results.tableOfContents = await getTableOfContents();

  results.navigation = await getPageNavigation(pagesDir, results.filePath, {
    tableOfContents: results.tableOfContents
  });

  if (results.attributes.schema && fs.existsSync(join(repoRootDir, results.attributes.schema))) {
    const rawFile = fs.readFileSync(join(repoRootDir, results.attributes.schema), {
      encoding: 'utf-8'
    });
    const jsonFile = JSON.parse(rawFile);
    const options = Object.keys(jsonFile?.properties).map(key => {
      return {
        name: key,
        ...jsonFile?.properties[key]
      }
    })

    results.options = options;
  }

  return results;
};

const getTableOfContents = async () => {
  const tocPath = join(docsDir, 'toc.md');
  return await parseTableOfContents(tocPath, pagesDir);
};

export const hookUpDesignSystem = (frag: DocumentFragment) => {
  const headings = frag.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headings.forEach(heading => {
    const level = heading.nodeName?.split('')[1];

    heading.classList.add(`ui-heading`);
    heading.classList.add(`ui-heading-${level}`);
    heading.classList.add(`ui-theme--editorial`);
  });

  return frag;
};
