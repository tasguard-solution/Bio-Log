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

# Pattern to find blocks that still have an http imageUrl
pattern = r"(imageUrl:\s*)'(https?://upload.wikimedia.org/[^']+)'(.*?)url:\s*'(https://commons.wikimedia.org/wiki/File:[^']+)'"

def replacer(match):
    prefix = match.group(1)
    original_url = match.group(2)
    in_between = match.group(3)
    wiki_url = match.group(4)
    
    print(f"Processing {wiki_url}...")
    try:
        # 1. Fetch wiki page
        req = urllib.request.Request(wiki_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
        # 2. Extract og:image
        og_match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
        if not og_match:
            print(f"Could not find og:image for {wiki_url}")
            return match.group(0)
            
        real_url = og_match.group(1)
        
        # 3. Generate filename
        parsed_url = urllib.parse.urlparse(real_url)
        filename = os.path.basename(parsed_url.path)
        filename = urllib.parse.unquote(filename)
        filename = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', filename)
        
        local_path = os.path.join(img_dir, filename)
        
        # 4. Download image
        print(f"Downloading {real_url} to {local_path}...")
        req_img = urllib.request.Request(real_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_img) as response, open(local_path, 'wb') as out_file:
            out_file.write(response.read())
            
        print("Success.")
        time.sleep(1)
        
        new_url = f"/images/organisms/{filename}"
        return f"{prefix}'{new_url}'{in_between}url: '{wiki_url}'"
    except Exception as e:
        print(f"Error processing {wiki_url}: {e}")
        return match.group(0)

new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open(data_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done updating src/data.ts")
