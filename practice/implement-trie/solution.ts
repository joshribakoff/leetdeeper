// LeetCode 208: Implement Trie (Prefix Tree)

/**
 * Implement a trie (prefix tree) with insert, search, and startsWith methods.
 *
 * Example 1: insert("apple"), search("apple") -> true, search("app") -> false,
 *   startsWith("app") -> true, insert("app"), search("app") -> true
 *
 * Constraints:
 * - All inputs consist of lowercase English letters
 * - search returns true only if the exact word was previously inserted
 * - startsWith returns true if any inserted word has the given prefix
 */

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
