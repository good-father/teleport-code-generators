import {
  PackProjectFunction,
  GenerateComponentFunction,
  ComponentUIDL,
  PublisherType,
  ProjectType,
  ComponentType,
  StyleVariation,
  ReactStyleVariation,
  InvalidProjectTypeError,
  InvalidPublisherTypeError,
  GeneratorOptions,
} from '@teleporthq/teleport-types'
import { createProjectPacker } from '@teleporthq/teleport-project-packer'
import { Constants } from '@teleporthq/teleport-shared'

import {
  ReactTemplate,
  createReactProjectGenerator,
  ReactProjectMapping,
} from '@teleporthq/teleport-project-generator-react'

import { createZipPublisher } from '@teleporthq/teleport-publisher-zip'
import { createDiskPublisher } from '@teleporthq/teleport-publisher-disk'
import { createGithubPublisher } from '@teleporthq/teleport-publisher-github'
import { createCodesandboxPublisher } from '@teleporthq/teleport-publisher-codesandbox'

import { createReactComponentGenerator } from '@teleporthq/teleport-component-generator-react'

const componentGeneratorFactories = {
  [ComponentType.REACT]: createReactComponentGenerator,
}

const componentGeneratorProjectMappings = {
  [ComponentType.REACT]: ReactProjectMapping,
}

const projectGeneratorFactories = {
  [ProjectType.REACT]: createReactProjectGenerator,
}

const templates = {
  [ProjectType.REACT]: ReactTemplate,
}

const projectPublisherFactories = {
  [PublisherType.ZIP]: createZipPublisher,
  [PublisherType.DISK]: createDiskPublisher,
  [PublisherType.GITHUB]: createGithubPublisher,
  [PublisherType.CODESANDBOX]: createCodesandboxPublisher,
}

export const packProject: PackProjectFunction = async (
  projectUIDL,
  { projectType, publisher, publishOptions = {}, assets = [] }
) => {
  const packer = createProjectPacker()

  const projectGeneratorFactory = projectGeneratorFactories[projectType]
  const projectTemplate = templates[projectType]

  if (!projectGeneratorFactory) {
    throw new InvalidProjectTypeError(projectType)
  }

  if (publisher && !projectPublisherFactories[publisher]) {
    throw new InvalidPublisherTypeError(publisher)
  }

  packer.setAssets({
    assets,
    path: [Constants.ASSETS_IDENTIFIER],
  })

  packer.setGenerator(projectGeneratorFactory())
  packer.setTemplate(projectTemplate)

  // If no publisher is provided, the packer will return the generated project
  if (publisher) {
    const publisherFactory = projectPublisherFactories[publisher]
    const projectPublisher = publisherFactory(publishOptions)
    // @ts-ignore
    packer.setPublisher(projectPublisher)
  }

  return packer.pack(projectUIDL)
}

export const generateComponent: GenerateComponentFunction = async (
  componentUIDL: ComponentUIDL,
  {
    componentType = ComponentType.REACT,
    styleVariation = ReactStyleVariation.CSSModules,
    componentGeneratorOptions = {},
  }: {
    componentType?: ComponentType
    styleVariation?: ReactStyleVariation
    componentGeneratorOptions?: GeneratorOptions
  } = {}
) => {
  const generator = createComponentGenerator(componentType, styleVariation)
  const projectMapping = componentGeneratorProjectMappings[componentType]

  // @ts-ignore
  generator.addMapping(projectMapping)
  return generator.generateComponent(componentUIDL, componentGeneratorOptions)
}

const createComponentGenerator = (componentType: ComponentType, styleVariation: StyleVariation) => {
  const generatorFactory = componentGeneratorFactories[componentType]

  if (!generatorFactory) {
    throw new Error(`Invalid ComponentType: ${componentType}`)
  }

  if (componentType === ComponentType.REACT) {
    // @ts-ignore
    return generatorFactory(styleVariation)
  }

  return generatorFactory()
}
