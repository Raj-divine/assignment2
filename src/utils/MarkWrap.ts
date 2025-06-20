import { LexicalEditor } from 'node_modules/lexical/LexicalEditor'
import { $createMarkNode, $isMarkNode } from '../lexical/nodes/markNode'
import { $getSelection, $isRangeSelection, $isElementNode, TextNode } from 'lexical'

export default function markWrap(editor: LexicalEditor) {
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
  })
}
