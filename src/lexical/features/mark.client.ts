'use client'

import {
  createClientFeature,
  toolbarFormatGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { FaHighlighter } from 'react-icons/fa'
import { $getSelection, $isRangeSelection, LexicalNode, $isElementNode, TextNode } from 'lexical'
import { $createMarkNode, $isMarkNode, MarkNode } from '../nodes/markNode'
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
            editor.update(() => {
              const selection = $getSelection()

              if (!$isRangeSelection(selection) || selection.isCollapsed()) {
                return
              }

              const anchor = selection.anchor
              const focus = selection.focus

              const isBackward = selection.isBackward()
              const start = isBackward ? focus : anchor
              const end = isBackward ? anchor : focus

              const startNode = start.getNode()
              const endNode = end.getNode()

              // Split text nodes at selection boundaries so only selected text is isolated
              if (startNode === endNode && startNode instanceof TextNode) {
                startNode.splitText(end.offset)
                startNode.splitText(start.offset)
              } else {
                if (startNode instanceof TextNode) {
                  startNode.splitText(start.offset)
                }
                if (endNode instanceof TextNode) {
                  endNode.splitText(end.offset)
                }
              }

              // get only the fully selected nodes
              const selectedNodes = selection.getNodes().filter((node) => node.isSelected())

              const isAlreadyMarked = selectedNodes.some((node) => {
                const parent = node.getParent()
                return $isMarkNode(parent)
              })

              if (isAlreadyMarked) {
                selectedNodes.forEach((node) => {
                  const parent = node.getParent()
                  if ($isMarkNode(parent) && $isElementNode(parent)) {
                    const children = parent.getChildren()
                    for (const child of children) {
                      parent.insertBefore(child)
                    }
                    parent.remove()
                  }
                })
                return
              }

              // Wrap: for each node, wrap in a new MarkNode
              selectedNodes.forEach((node) => {
                if (!node.isSelected()) return

                const markNode = $createMarkNode()
                node.insertBefore(markNode)
                markNode.append(node)
              })

              // Generate HTML
              const html = $generateHtmlFromNodes(editor)
              console.log(html)
            })
          },
          order: 5,
        },
      ]),
    ],
  },
})
