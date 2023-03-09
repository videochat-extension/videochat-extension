import os
import subprocess
path = 'public/resources/dark'
os.chdir(path)
for filename in os.listdir():
    if filename.endswith("css"):
        cmd_str = f"csso -i {filename} -o {filename}"
        subprocess.run(cmd_str, shell=True)
