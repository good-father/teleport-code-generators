import { createProjectPacker } from '@teleporthq/teleport-project-packer'

import { createReactProjectGenerator } from '@teleporthq/teleport-project-generator-react'

import { createDiskPublisher } from '@teleporthq/teleport-publisher-disk'
import { RemoteTemplateDefinition, ProjectUIDL, ProjectGenerator } from '@teleporthq/teleport-types'

import config from '../config.json'

import { GITHUB_TEMPLATE_OWNER, REACT_GITHUB_PROJECT } from './constants'

import projectUIDL from '../../../examples/uidl-samples/project.json'

const generators: Record<string, ProjectGenerator> = {
  react: createReactProjectGenerator(),
}

const getGithubRemoteDefinition = (username: string, repo: string): RemoteTemplateDefinition => {
  return { username, repo, provider: 'github' }
}

const templates: Record<string, RemoteTemplateDefinition> = {
  react: getGithubRemoteDefinition(GITHUB_TEMPLATE_OWNER, REACT_GITHUB_PROJECT),
}

const publisher = createDiskPublisher({
  outputPath: 'dist',
})

const packProject = async (projectType: string) => {
  const remoteTemplate = templates[projectType] as RemoteTemplateDefinition

  remoteTemplate.auth = {
    token: config.token,
  }

  const packer = createProjectPacker()
  packer.setPublisher(publisher)
  packer.setGenerator(generators[projectType])
  await packer.loadRemoteTemplate(remoteTemplate)

  const result = await packer.pack((projectUIDL as unknown) as ProjectUIDL)

  console.info(projectType, ' - ', result)
}

const run = async () => {
  try {
    await packProject('react')
  } catch (e) {
    console.info(e)
  }
}

run()
