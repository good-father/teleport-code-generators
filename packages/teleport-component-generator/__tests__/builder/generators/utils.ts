import { unicode2Chinese } from '../../../src/builder/generators/utils'

describe('unicode2Chinese', () => {
  it('unicode to chinese', () => {
    const unicodeStr = '\\u4f60\\u597d'
    const chineseStr = unicode2Chinese(unicodeStr)

    expect(chineseStr).toBe('你好')
  })
})
