import os
import re
import urllib.request
import urllib.parse
import time

data_file = 'src/data.ts'
img_dir = 'public/images/organisms'

if not os.path.exists(img_dir):
    os.makedirs(img_dir)

with open(data_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find imageUrls
pattern = r"(imageUrl:\s*)'(https?://[^']+)'"

def replacer(match):
    prefix = match.group(1)
    url = match.group(2)
    
    # generate filename
    parsed_url = urllib.parse.urlparse(url)
    filename = os.path.basename(parsed_url.path)
    
    # decode URL-encoded filename (like %28PSF%29.png -> (PSF).png)
    filename = urllib.parse.unquote(filename)
    # clean up filename to be safe
    filename = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', filename)
    
    local_path = os.path.join(img_dir, filename)
    
    # Download the file
    print(f"Downloading {url} to {local_path}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req) as response, open(local_path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print("Success.")
        time.sleep(1) # sleep to avoid 429
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return match.group(0) # Keep original if failed
    
    new_url = f"/images/organisms/{filename}"
    return f"{prefix}'{new_url}'"

new_content = re.sub(pattern, replacer, content)

with open(data_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done updating src/data.ts")
