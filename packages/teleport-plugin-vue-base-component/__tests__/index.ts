import { createVueComponentPlugin } from '../src/index'
import { structure } from './mocks'
import { ChunkType } from '@teleporthq/teleport-types'

describe('vue-base-component-plugin', () => {
  const plugin = createVueComponentPlugin({
    vueJSChunkName: 'component-js',
    vueTemplateChunkName: 'component-html',
  })

  it('outputs two AST chunks with the corresponding chunk names', async () => {
    const result = await plugin(structure)

    // no change to the input UIDL
    expect(JSON.stringify(result.uidl)).toBe(JSON.stringify(structure.uidl))

    // AST chunks created
    expect(result.chunks.length).toBe(2)
    expect(result.chunks[0].type).toBe(ChunkType.HAST)
    expect(result.chunks[0].content).toBeDefined()
    expect(result.chunks[0].name).toBe('component-html')
    expect(result.chunks[1].type).toBe(ChunkType.AST)
    expect(result.chunks[1].content).toBeDefined()
    expect(result.chunks[1].name).toBe('component-js')

    // Dependencies
    expect(Object.keys(result.dependencies).length).toBe(0)
  })
})
