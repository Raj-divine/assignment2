import { createNode, createServerFeature } from '@payloadcms/richtext-lexical'
import { MarkNode } from '../nodes/markNode'

export const MarkFeature = createServerFeature({
  feature: {
    ClientFeature: '@/lexical/features/mark.client#MarkFeature',
    nodes: [
      // Use the createNode helper function to more easily create nodes with proper typing
      createNode({
        converters: {
          html: {
            converter: () => {
              return ''
            },
            nodeTypes: [MarkNode.getType()],
          },
        },
        // Here you can add your actual node. On the server, they will be
        // used to initialize a headless editor which can be used to perform
        // operations on the editor, like markdown / html conversion.
        node: MarkNode,
      }),
    ],
  },
  key: 'mark',
})
