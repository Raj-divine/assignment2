'use client'

import {
  createClientFeature,
  toolbarFormatGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { FaHighlighter } from 'react-icons/fa'
import { $getSelection, $isRangeSelection, LexicalNode } from 'lexical'
import { MarkNode } from '../nodes/markNode'
import markWrap from '@/utils/MarkWrap'

import { $generateHtmlFromNodes } from '@payloadcms/richtext-lexical/lexical/html'

export const MarkFeature = createClientFeature({
  nodes: [MarkNode],
  toolbarInline: {
    groups: [
      toolbarFormatGroupWithItems([
        {
          ChildComponent: FaHighlighter,
          isActive: ({ selection, editor }) => {
            let isMarkActive = false
            editor.getEditorState().read(() => {
              const selection = $getSelection()
              if ($isRangeSelection(selection)) {
                const nodes = selection.getNodes()
                isMarkActive = nodes.every((node) => {
                  let current: null | LexicalNode = node
                  while (current) {
                    if (current.getType && current.getType() === 'mark') {
                      return true
                    }
                    current = current.getParent && current.getParent()
                  }
                  return false
                })
              }
            })
            return isMarkActive
          },
          key: 'mark',
          label: ({ i18n }) => {
            return i18n.t('lexical:myFeature:label')
          },
          onSelect: ({ editor }) => {
            markWrap(editor)

            // Generate HTML (Testing)

            const html = $generateHtmlFromNodes(editor)
            console.log(html)
          },
          order: 5,
        },
      ]),
    ],
  },
})
