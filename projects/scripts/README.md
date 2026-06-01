# Website scaffold utility

Use `scaffold_website.ps1` to create organized website projects under the workspace `WEBSITES` folder.

Example usage (PowerShell):

```powershell
# create a new site named "My Site" and set domain and contact
.\scaffold_website.ps1 -Name "DMPR TRADERS" -Domain "dmprtraders.ai" -ContactEmail "adv.raghu.vaid@gmail.com"

# create and init a git repo
.\scaffold_website.ps1 -Name "MySite" -InitGit
```

The script creates a folder `WEBSITES/<Name>` with `INDEX.HTML`, `STYLE.CSS`, `SCRIPT.JS`, `assets/`, and optional `CNAME`/`DOMAIN_NOTE.txt`.
