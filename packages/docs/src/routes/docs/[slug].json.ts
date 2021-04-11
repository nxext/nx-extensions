import { docs } from './_docs';

type Input = { params: Record<string, unknown> }
type Output = void | Record<string, unknown>

const lookup = new Map();
docs.forEach((post) => {
  lookup.set(post.slug, JSON.stringify(post));
});

function getSummary(index) {
  if (index >= 0 && index <= docs.length - 1) {
    const { title, slug } = docs[index];
    return { title, slug }
  }

  return;
}

export function get(req: Input): Output {
  const index = docs.findIndex(a => a.slug === req.params.slug);

  if (index < 0) return;

  const post = docs[index];
  const prev = getSummary(index + 1);
  const next = getSummary(index - 1)

  return { body: JSON.stringify({ prev, next, post })}
}
