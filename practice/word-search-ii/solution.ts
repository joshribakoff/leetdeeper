// LeetCode 212: Word Search II

export class TrieNode {
  children: { [key: string]: TrieNode }
  isWord: boolean

  constructor() {
    this.children = {}
    this.isWord = false
  }
}

export class Trie {
  root: TrieNode

  constructor() {
    this.root = new TrieNode()
  }

  insert(word: string): void {
    let node = this.root
    for (const c of word) {
      if (!node.children[c]) {
        node.children[c] = new TrieNode()
      }
      node = node.children[c]
    }
    node.isWord = true
  }
}

export function findWords(board: string[][], words: string[]): string[] {
  // TODO: implement
  return []
}
