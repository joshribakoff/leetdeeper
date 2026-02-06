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

/**
 * Given an m x n board of characters and a list of words, return all
 * words that can be found in the board. Each word must be constructed
 * from letters of sequentially adjacent cells (horizontally or
 * vertically). The same cell may not be used more than once per word.
 *
 * Example 1: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"] -> ["eat","oath"]
 * Example 2: board = [["a","b"],["c","d"]], words = ["abcb"] -> []
 */
export function findWords(board: string[][], words: string[]): string[] {
  // TODO: implement
  return []
}
