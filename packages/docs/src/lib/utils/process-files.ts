import fs from 'fs';
import fm from 'front-matter';
import marked from '$lib/utils/marked';

export interface DocEntry {
  html: string,
  slug: string
}

export function processFiles(location, html = true): Required<DocEntry>[] {
  const files = fs.readdirSync(location);

  const docs = [];
  for (let i = 0; i < files.length; i++) {
    const content = fs.readFileSync(`${location}/${files[i]}`, { encoding: 'utf-8' });
    // Use the front-matter library to separate the body from the front matter
    const { body, ...matter } = fm(content);
    // Use the marked library to turn markdown into html
    if (html) {
      const html: string = marked(body);
      docs.push({ html, slug: files[i].split('.md')[0], ...(matter.attributes as Record<string, unknown>) });
    } else {
      docs.push({ slug: files[i].split('.md')[0], ...(matter.attributes as Record<string, unknown>) });
    }
  }

  return docs;
}
