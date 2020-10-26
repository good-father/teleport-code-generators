import babelGenerator from '@babel/generator'
import { Node } from '@babel/types'

import { CodeGeneratorFunction } from '@teleporthq/teleport-types'
import { unicode2Chinese } from './utils'

export const generator: CodeGeneratorFunction<Node> = (ast) => {
  return unicode2Chinese(babelGenerator(ast).code)
}
