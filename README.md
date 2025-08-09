Quick mental model
Your code lives on GitHub.

When you push changes to the main branch, GitHub Actions builds the app and publishes it to GitHub Pages.

You can always test locally first.

0) Open the project locally
Windows → Command Prompt:

cmd
Copy
Edit
cd C:\Users\sam.butler\Documents\wellbeing-tracker
1) Make a change
Typical edit spots:

UI text or styles → src/App.tsx, src/styles.css

Fields or record types → src/App.tsx → the big SCHEMAS object

Storage helpers → src/lib/storage.ts

Form / table behavior → src/components/RecordForm.tsx, src/components/RecordList.tsx

Change fields (example)
Open src/App.tsx, find SCHEMAS.food.fields, add:

ts
Copy
Edit
{ name: 'sodiumMg', label: 'Sodium (mg)', type: 'number' },
Save.

Add a brand‑new record type (example)
In src/App.tsx:

Add to the EntityKey union, e.g. | 'supplements'.

Add a SCHEMAS.supplements = { ... } block (copy another schema and tweak).
It will automatically get a menu badge, form, and list.

2) Test locally
cmd
Copy
Edit
npm install
npm run dev
Open the local URL it prints (usually http://localhost:5173).
Happy? Close it with Ctrl + C.

3) Commit the change
cmd
Copy
Edit
git add .
git commit -m "Describe your change briefly"
4) Ship it (builds on GitHub automatically)
cmd
Copy
Edit
git push
Then:

Go to your repo’s Actions tab → watch “Deploy Vite app to GitHub Pages”.

When it’s green, your live site updates at:

cpp
Copy
Edit
https://YOUR_USERNAME.github.io/YOUR-REPO-NAME/
5) Roll back if something breaks
Fastest way:

On GitHub → Actions → open the last good green run.

Click the “Deploy to GitHub Pages” job → grab the page_url (that’s the same live URL). If you need to truly revert code:

In Command Prompt:

cmd
Copy
Edit
git log --oneline
git revert <bad_commit_hash>
git push
Or use GitHub → Code → Commits → Revert on the bad commit.

6) Change the repo name or move it
If you rename the repo, update this line in vite.config.ts:

ts
Copy
Edit
base: '/YOUR-NEW-REPO-NAME/'
Commit + push. Give Pages a minute to republish.

7) Keep dependencies healthy (optional maintenance)
Occasionally:

cmd
Copy
Edit
npm outdated
npm update
git add package*.json
git commit -m "chore: update deps"
git push
If a major update breaks, revert as above.

8) Back up your data
Data is stored in the browser (local). Use the app’s Export button to download a .json file.

Keep copies in OneDrive/Google Drive.

To restore: Import in the app.

9) Making bigger changes safely (branch flow—optional)
For experiments:

cmd
Copy
Edit
git checkout -b feature/new-idea
# edit + test locally
git add .
git commit -m "feat: try new idea"
git push -u origin feature/new-idea
Open a Pull Request on GitHub → merge when ready. The merge to main triggers deploy.

10) Troubleshooting quickies
Site shows a blank page or missing styles after a deploy

vite.config.ts must have base: '/YOUR-REPO-NAME/'.

Commit and push again, then hard refresh (Ctrl+F5).

Actions fails on “Install deps” or “Build”

Open the red run in Actions → read the failing step’s logs.

If it says a package is missing:

cmd
Copy
Edit
npm install @vitejs/plugin-react --save-dev
git add package*.json
git commit -m "fix: add missing plugin"
git push
PowerShell blocks npm

Use Command Prompt (what you’re already doing), or in PowerShell:

powershell
Copy
Edit
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
Git says “Repository not found”

Check the remote:

cmd
Copy
Edit
git remote -v
If wrong:

cmd
Copy
Edit
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
11) Your “edit anything” checklist (tl;dr)
Open folder in Command Prompt.

npm run dev → test locally.

git add . && git commit -m "message" && git push.

Watch Actions go green.

Refresh your Pages URL.