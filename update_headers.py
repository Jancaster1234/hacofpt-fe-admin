import os
import re

# Define file extensions and comment styles
COMMENT_STYLES = {
    ".py": "# {path}\n",           # Python
    ".js": "// {path}\n",          # JavaScript
    ".jsx": "// {path}\n",         # JSX
    ".ts": "// {path}\n",          # TypeScript
    ".tsx": "// {path}\n",         # TSX
    ".css": "/* {path} */\n",      # CSS
    ".html": "<!-- {path} -->\n",  # HTML
    ".java": "// {path}\n",        # Java
    ".json": "// {path}\n"         # JSON (uses JavaScript-style comments)
}

SRC_FOLDER = "src"
HEADER_REGEX = re.compile(r"^(#|//|/\*|<!--)\s*.*?(\*/|-->)?$")

def get_relative_path(file_path):
    return os.path.relpath(file_path, os.getcwd()).replace("\\", "/")

def update_file(file_path):
    ext = os.path.splitext(file_path)[1]
    comment_format = COMMENT_STYLES.get(ext)
    
    if not comment_format:
        return  # Skip unsupported file types

    relative_path = get_relative_path(file_path)
    new_comment = comment_format.format(path=relative_path)

    with open(file_path, "r+", encoding="utf-8") as f:
        lines = f.readlines()
        if lines and HEADER_REGEX.match(lines[0]):
            lines = lines[1:]  # Remove old header

        f.seek(0)
        f.write(new_comment + "".join(lines))
        f.truncate()

def update_all_files():
    for root, _, files in os.walk(SRC_FOLDER):
        for file in files:
            update_file(os.path.join(root, file))

if __name__ == "__main__":
    update_all_files()
    print("Updated file headers successfully.")
