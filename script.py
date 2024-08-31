import os
from pathlib import Path
from typing import Iterator, Set

def get_file_content(file_path: Path) -> str:
    """Read and return the content of a file."""
    try:
        with file_path.open('r', encoding='utf-8') as file:
            return file.read()
    except UnicodeDecodeError:
        print(f"Warning: Unable to read {file_path} with UTF-8 encoding. Skipping.")
        return ""

def find_target_files(root_dir: Path, skip_list: Set[str]) -> Iterator[Path]:
    """Generate paths of target files in the given directory and its subdirectories, excluding skipped items."""
    target_extensions = {'.jsx', '.js', '.html'}
    for path in root_dir.rglob('*'):
        if path.is_file() and path.suffix in target_extensions:
            relative_path = path.relative_to(root_dir)
            if not any(skip_item in relative_path.parts for skip_item in skip_list):
                yield path

def process_directory(root_dir: Path, output_file: Path, skip_list: Set[str]) -> None:
    """Process all target files in the given directory and write their content to the output file."""
    with output_file.open('w', encoding='utf-8') as out_file:
        for file_path in find_target_files(root_dir, skip_list):
            relative_path = file_path.relative_to(root_dir)
            content = get_file_content(file_path)
            if content:
                out_file.write(f"File: {relative_path}\n")
                out_file.write("=" * 50 + "\n")
                out_file.write(content)
                out_file.write("\n\n" + "=" * 50 + "\n\n")

def get_user_input(prompt: str) -> str:
    """Get user input with a prompt."""
    return input(prompt).strip()

def get_skip_list() -> Set[str]:
    """Interactively build a list of folders/files to skip."""
    skip_list = set()
    print("\nEnter folders or files to skip (press Enter without typing to finish):")
    while True:
        item = get_user_input("Skip (or Enter to finish): ")
        if not item:
            break
        skip_list.add(item)
    return skip_list

def main() -> None:
    script_dir = Path(__file__).parent
    
    print("=== File Processing Script ===")
    target_folder_name = get_user_input("Enter the name of the target folder: ")
    root_directory = script_dir / target_folder_name
    
    if not root_directory.is_dir():
        print(f"Error: {root_directory} is not a valid directory.")
        return
    
    skip_list = get_skip_list()
    output_file = script_dir / "output.txt"
    
    print("\nProcessing files...")
    try:
        process_directory(root_directory, output_file, skip_list)
        print(f"\nProcessing complete. Results saved to {output_file}")
        print(f"Skipped items: {', '.join(skip_list) if skip_list else 'None'}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()