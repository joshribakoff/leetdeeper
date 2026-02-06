// LeetCode 208: Implement Trie (Prefix Tree)

export class TrieNode {
  children: { [key: string]: TrieNode }
  isEndOfWord: boolean

  constructor() {
    this.children = {}
    this.isEndOfWord = false
  }
}

export class Trie {
  root: TrieNode

  constructor() {
    this.root = new TrieNode()
  }

  insert(word: string): void {
    // TODO: implement
  }

  search(word: string): boolean {
    // TODO: implement
    return false
  }

  startsWith(prefix: string): boolean {
    // TODO: implement
    return false
  }
}
