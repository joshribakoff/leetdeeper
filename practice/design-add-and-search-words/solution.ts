// LeetCode 211: Design Add and Search Words Data Structure

/**
 * Design a data structure that supports adding words and searching for words.
 * search(word) can contain '.' which matches any single letter.
 *
 * Example 1: addWord("bad"), addWord("dad"), addWord("mad")
 *   search("pad") -> false
 *   search("bad") -> true
 *   search(".ad") -> true
 *   search("b..") -> true
 *
 * Constraints:
 * - '.' matches exactly one character
 * - Words consist of lowercase English letters
 */

export class TrieNode {
  children: { [key: string]: TrieNode }
  isEndOfWord: boolean

  constructor() {
    this.children = {}
    this.isEndOfWord = false
  }
}

export class WordDictionary {
  root: TrieNode

  constructor() {
    this.root = new TrieNode()
  }

  addWord(word: string): void {
    // TODO: implement
  }

  search(word: string): boolean {
    // TODO: implement
    // '.' can match any letter
    return false
  }
}
