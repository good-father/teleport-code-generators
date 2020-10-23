import { readFileSync, rmdirSync, mkdirSync } from 'fs'
import { join } from 'path'
import { packProject } from '@teleporthq/teleport-code-generator'
import { ProjectUIDL, PackerOptions, ProjectType, PublisherType } from '@teleporthq/teleport-types'

import reactProjectJSON from '../../../examples/uidl-samples/project.json'

const reactProjectUIDL = (reactProjectJSON as unknown) as ProjectUIDL
const assetFile = readFileSync(join(__dirname, 'asset.png'))
const base64File = new Buffer(assetFile).toString('base64')
const packerOptions: PackerOptions = {
  publisher: PublisherType.DISK,
  projectType: ProjectType.REACT,
  publishOptions: {
    outputPath: 'dist',
  },
  assets: [
    {
      fileType: 'png',
      name: 'icons-192',
      content: base64File,
    },
    {
      fileType: 'png',
      name: 'icons-512',
      content: base64File,
    },
  ],
}

const run = async () => {
  try {
    if (packerOptions.publisher === PublisherType.DISK) {
      rmdirSync('dist', { recursive: true })
      mkdirSync('dist')
    }

    let result
    // result = await packProject(projectUIDL, {
    //   ...packerOptions,
    //   projectType: ProjectType.REACTNATIVE,
    // })
    // console.info(ProjectType.REACTNATIVE, '-', result.payload)
    result = await packProject(reactProjectUIDL, {
      ...packerOptions,
      projectType: ProjectType.REACT,
    })
    console.info(ProjectType.REACT, '-', result.payload)
  } catch (e) {
    console.info(e)
  }
}

run()
