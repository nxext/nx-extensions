import { NormalizedSchema } from '../schema';

export function getComponentTests(schema: NormalizedSchema) {
  return `
  it('should render successfully', () => {
    const wrapper = mount(${schema.className}, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
  `;
}
