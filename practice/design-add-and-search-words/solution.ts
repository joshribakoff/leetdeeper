// LeetCode 211: Design Add and Search Words Data Structure

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
