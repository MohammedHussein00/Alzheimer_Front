import random

# Task 1: Swap two arrays
array1 = [1, 2, 3, 4, 5]
array2 = [6, 7, 8, 9, 10]
print("Original array1:", array1)
print("Original array2:", array2)
array1, array2 = array2, array1
print("Swapped array1:", array1)
print("Swapped array2:", array2)

# Task 2: Insert element in a specified position
index_to_insert = 2
element_to_insert = 99
array1.insert(index_to_insert, element_to_insert)
print("After insertion in array1:", array1)

# Task 3: Delete element from a specified position
index_to_delete = 2
del array1[index_to_delete]
print("After deletion from array1:", array1)

# Task 4: Count occurrence of elements
array1 = [1, 7, 9, 5, 3]
array2 = [2, 5, 7, 6, 7]
combined_array = array1 + array2
count_dict = {}
for element in combined_array:
    if element not in count_dict:
        count_dict[element] = 1
    else:
        count_dict[element] += 1
print("Element occurrence:", count_dict)

# Task 5: Random array with user-specified range
lower_bound = int(input("Enter the lower bound: "))
upper_bound = int(input("Enter the upper bound: "))
random_array = [random.randint(lower_bound, upper_bound) for _ in range(5)]
print("Random array:", random_array)

# Task 6: Slice array into odd and even arrays
original_array = [1, 2, 71, 3, 115]
odds = [x for x in original_array if x % 2 != 0]
evens = [x for x in original_array if x % 2 == 0]
print("Odds:", odds)
print("Evens:", evens)

# Task 7: Concatenate two arrays with a space between them
concatenated_array = array1 + [' '] + array2
print("Concatenated array with space:", concatenated_array)

# Task 8: User inputs for a 3x3 array
print("Enter elements for a 3x3 array (9 numbers total):")
array_of_arrays = []
for _ in range(3):
    row = list(map(int, input().split()))
    while len(row) != 3:
        print("Please enter exactly 3 numbers:")
        row = list(map(int, input().split()))
    array_of_arrays.append(row)
print("2D Array:")
for row in array_of_arrays:
    print(row)

# Task 9: Copy array to another array
copy_of_array1 = array1[:]
print("Original array:", array1)
print("Copied array:", copy_of_array1)

# Task 10: Copy inverted array
inverted_array = array1[::-1]
print("Inverted array:", inverted_array)
