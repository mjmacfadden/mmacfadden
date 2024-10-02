#!/bin/bash

# Directory where PHP files are located (you can modify this)
directory="."

# Output directory for static HTML files
output_directory="./html_output"

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "PHP is not installed. Please install PHP to run this script."
    exit 1
fi

# Create the output directory if it doesn't exist
if [ ! -d "$output_directory" ]; then
    mkdir -p "$output_directory"
    echo "Created output directory: $output_directory"
fi

# Loop through all PHP files in the specified directory
for php_file in "$directory"/*.php; do
    if [ -f "$php_file" ]; then
        # Create the corresponding HTML filename in the output directory
        html_file="$output_directory/$(basename "${php_file%.php}.html")"
        
        # Execute the PHP file and get the output, catching any errors
        if php_output=$(php "$php_file" 2>&1); then
            # Replace .php links with .html links in the PHP output
            html_content="${php_output//.php/.html}"

            # Save the output to the new HTML file
            echo "$html_content" > "$html_file"
            echo "Converted $php_file to $html_file"
        else
            # If there's an error, output it and skip the file
            echo "Error processing $php_file: $php_output"
        fi
    else
        echo "No PHP files found in $directory."
    fi
done
