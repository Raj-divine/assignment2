import {
  ElementNode,
  LexicalEditor,
  DOMExportOutput,
  DOMConversionMap,
  DOMConversionOutput,
  SerializedElementNode,
  Spread,
} from 'lexical'

export type SerializedMarkNode = Spread<
  {
    type: 'mark'
    version: 1
  },
  SerializedElementNode
>

export class MarkNode extends ElementNode {
  static getType(): string {
    return 'mark'
  }

  static clone(node: MarkNode): MarkNode {
    return new MarkNode(node.__key)
  }

  createDOM(_config: any, _editor: LexicalEditor): HTMLElement {
    return document.createElement('mark')
  }

  updateDOM(_prevNode: MarkNode, _dom: HTMLElement): boolean {
    return false
  }

  static importDOM(): DOMConversionMap | null {
    return {
      mark: () => ({
        conversion: (domNode: Node): DOMConversionOutput => ({
          node: new MarkNode(),
        }),
        priority: 1,
      }),
    }
  }

  static importJSON(serializedNode: SerializedMarkNode): MarkNode {
    return new MarkNode()
  }

  exportJSON(): SerializedMarkNode {
    return {
      ...super.exportJSON(),
      type: 'mark',
      version: 1,
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('mark')
    return { element }
  }

  isInline(): boolean {
    return true
  }
}

export function $createMarkNode(): MarkNode {
  return new MarkNode()
}

export function $isMarkNode(node: unknown): node is MarkNode {
  return node instanceof MarkNode
}
