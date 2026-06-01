
## Deploy to Netlify (recommended)

Easiest options (no Git required):

1) Drag & drop
- Zip or open the `site/` folder and go to https://app.netlify.com/drop. Drag the `site/` folder to deploy.

2) Netlify CLI (repeatable deployments)
- Install Netlify CLI: `npm install -g netlify-cli`.
- From the project root run:

```powershell
cd "C:\MY AI\projects\WEBSITES\DMPR_TRADERS\site"
netlify deploy --dir=./ --prod
```

Custom domain (`dmprtraders.ai`):
- Add the domain in Netlify UI → Domain management → Custom domains.
- Follow Netlify's DNS instructions (they issue SSL automatically once DNS is verified).

Notes:
- I cannot register domains or change DNS from here. After you register `dmprtraders.ai`, add it in Netlify and follow the DNS steps Netlify shows.
- If you'd like automated CI, Netlify can connect to a Git provider, but it's optional.

