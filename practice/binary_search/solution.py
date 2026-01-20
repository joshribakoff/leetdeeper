class Solution:

    # Time: O(?)
    # Space: O(?)
    def search(self, nums: list[int], target: int) -> int:
        def bs(left, right):
            if(left > right):
                return -1
            mid = len(nums)// 2
            if nums[mid] == target:
                return mid 
            if mid < target:
                return bs(target+1, right)
            else:
                return bs(left,target-1) 

                
        return bs(0, len(nums))

