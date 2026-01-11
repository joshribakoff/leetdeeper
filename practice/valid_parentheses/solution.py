class Solution:

    # case 1
    # "()"
    #   ^
    # s = ['(']


    # Time: O(?)
    # Space: O(?)
    def is_valid(self, s: str) -> bool:
        stack = []
        m = {
            '}': '{',
            ')': '(',
            ']': '['
        }
        for c in s:
            # handle closing
            if c in m:
                if stack and stack[-1] == m[c]:
                    stack.pop()
                else:
                    return False
            # handle opening
            else:
                stack.append(c)

        return not stack
