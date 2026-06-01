## Deploy to Netlify (preferred)
This site is prepared for static hosting and Netlify is the recommended option for easy deployment and free HTTPS.

Quick deploy (drag & drop):
1. Zip the `ORION SITES` folder or open the `ORION SITES` folder.
2. Go to https://app.netlify.com/drop and drag the folder into the page.
3. Netlify will upload and provision HTTPS automatically.

Deploy with Netlify CLI (recommended for repeatable deploys):
1. Install Netlify CLI: `npm install -g netlify-cli`.
2. From this folder run:

```powershell
cd "C:\MY AI\projects\WEBSITES\ORION SITES"
netlify deploy --dir=. --prod
```

Custom domain (`orion.ai`):
- Add the domain in the Netlify Site settings → Domain management → Custom domains.
- Netlify provides DNS records to add at your registrar. After DNS propagation, Netlify issues an SSL certificate automatically.

Notes:
- I cannot register domains or change DNS from this environment. After you register `orion.ai`, add it in Netlify and follow the DNS steps Netlify shows.
- If you later want CI from a Git provider, Netlify integrates with GitHub/GitLab/Bitbucket, but it's not required.
