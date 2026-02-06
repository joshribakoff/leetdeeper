// Longest Substring Without Repeating Characters - Leetcode 3
// Given a string s, find the length of the longest substring without repeating characters.
/**
 * Given a string s, find the length of the longest substring without
 * repeating characters.
 *
 * Example 1: s = "abcabcbb" -> 3 ("abc")
 * Example 2: s = "bbbbb" -> 1 ("b")
 * Example 3: s = "pwwkew" -> 3 ("wke")
 */
export function lengthOfLongestSubstring(s: string): number {
  let i = 0;
  let j = 0;
  const chars = new Set();
  let res = 0;
  for (i = 0; i < s.length; i++) {
    while (chars.has(s[i])) {
      chars.delete(s[j]);
      j++;
    }
    chars.add(s[i]);
    res = Math.max(res, i - j + 1);
  }
  return res;
}
