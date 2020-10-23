import { component, staticNode, slotNode, elementNode } from '@teleporthq/teleport-uidl-builders'

import { createReactComponentGenerator } from '../../src'

const reactGenerator = createReactComponentGenerator()

describe('Component Slot Node', () => {
  describe('Simple Slot', () => {
    const uidl = component(
      'Simple Slot',
      elementNode('container', {}, [slotNode({ type: 'static', content: '1234' })])
    )

    it('renders props.children in React', async () => {
      const result = await reactGenerator.generateComponent(uidl)
      const code = result.files[0].content

      expect(code).toContain('{props.children}')
    })
  })
})
