import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'post',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText', // Make sure Lexical is enabled
      required: true,
    },
  ],
  upload: true,
}
