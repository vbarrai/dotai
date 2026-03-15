import { defineBuildConfig } from 'obuild/config'

export default defineBuildConfig({
  entries: [
    {
      type: 'bundle',
      input: './src/cli.ts',
      esbuild: {
        target: 'node18',
        treeShaking: true,
      },
    },
  ],
})
