import re
from collections import defaultdict

def find_duplicates(file_path, min_length=10):
    # Read the file content
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Create a dictionary to store substrings and their positions
    substring_positions = defaultdict(list)

    # Iterate through all possible substrings
    for i in range(len(content)):
        for j in range(i + min_length, len(content) + 1):
            substring = content[i:j]
            substring_positions[substring].append(i)

    # Filter out unique substrings and sort by length (descending)
    duplicates = sorted(
        [(s, positions) for s, positions in substring_positions.items() if len(positions) > 1],
        key=lambda x: len(x[0]),
        reverse=True
    )

    return duplicates

def print_duplicates(duplicates, context=20):
    for substring, positions in duplicates:
        print(f"Duplicate found ({len(positions)} occurrences):")
        print(f"Length: {len(substring)}")
        print("Content:")
        print(substring)
        print("\nPositions:")
        for pos in positions:
            print(f"- {pos}")
        print("\nContext:")
        for pos in positions:
            start = max(0, pos - context)
            end = min(pos + len(substring) + context, len(content))
            context_str = content[start:end]
            context_str = re.sub(r'\s+', ' ', context_str)  # Replace multiple whitespaces with a single space
            print(f"...{context_str}...")
        print("\n" + "="*50 + "\n")

if __name__ == "__main__":h
    file_name = input("Enter the name of the text file to scan: ")
    min_length = int(input("Enter the minimum lengt of duplicate substrings to detect: "))

    try:
        duplicates = find_duplicates(file_name, min_length)
        print_duplicates(duplicates)
    except FileNotFoundError:
        print(f"Error: File '{file_name}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")
