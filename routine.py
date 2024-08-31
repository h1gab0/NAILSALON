import os

def remove_all_spaces(filename):
    try:
        # Read the content of the file
        with open(filename, 'r') as file:
            content = file.read()

        # Remove all spaces
        updated_content = content.replace(' ', '')

        # Write the updated content back to the file
        with open(filename, 'w') as file:
            file.write(updated_content)

        print(f"All spaces removed from {filename}")
    except Exception as e:
        print(f"Error processing {filename}: {str(e)}")

def main():
    # Get the current directory
    current_dir = os.getcwd()

    # Ask for the filename
    filename = input(f"Enter the filename in the current directory ({current_dir}): ")

    # Construct the full file path
    file_path = os.path.join(current_dir, filename)

    # Check if the file exists
    if not os.path.isfile(file_path):
        print(f"Error: File '{filename}' not found in the current directory.")
        return

    # Process the file
    remove_all_spaces(file_path)

if __name__ == "__main__":
    main()