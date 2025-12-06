# Climate Solutions Hub  
**A full-stack web application to explore, add, edit, and showcase real-world climate change solutions**  
Inspired by Project Drawdown

[![Vercel Deploy](https://vercel.com/button)](https://climate-solutions-hub-with-postgre-sql.vercel.app/)  
**Live Demo:** https://climate-solutions-hub-with-postgre-sql.vercel.app/

---

### Features
- Browse all climate solutions with sector filtering (Electricity, Industry, Transportation, Land Sinks, etc.)
- Detailed project pages with images, impact analysis, and original source links
- Full CRUD functionality:
  - Add new climate solutions
  - Edit existing entries
  - Delete projects
- Responsive, modern UI built with Tailwind CSS + DaisyUI
- Random inspirational quote on every project detail page
- Clean 404 error page and navigation
- Deployed instantly on Vercel (serverless Node.js)

---

### Tech Stack

| Layer             | Technology                                 |
|-------------------|--------------------------------------------|
| Runtime           | Node.js + Express                          |
| Templating        | EJS                                        |
| Styling           | Tailwind CSS + DaisyUI (via CDN) + custom CSS |
| Database          | PostgreSQL (via `modules/projects.js` – uses `pg` client) |
| Data Seeding      | JSON seed files (`projectData.json`, `sectorData.json`) |
| Deployment        | Vercel (Serverless Functions)              |
| Environment Vars  | `.env` (managed by `dotenv`)               |

---

### Project Structure

```
├── .vercel/                   # Vercel internal files (auto-generated)
├── data/
│   ├── projectData.json       # Seed data for initial projects
│   └── sectorData.json        # list of sectors
├── modules/
│   └── projects.js            # PostgreSQL data layer – all CRUD operations & DB init
├── public/
│   └── css/
│       ├── main.css           # custom styles + Tailwind overrides
│       └── tailwind.css         # optional extra Tailwind utilities
├── views/
│   ├── partials/
│   │   └── navbar.ejs         # shared navigation bar
│   ├── 404.ejs
│   ├── 500.ejs
│   ├── about.ejs
│   ├── addProject.ejs
│   ├── editProject.ejs
│   ├── home.ejs
│   ├── projectDetail.ejs
│   └── viewProjects.ejs
├── .gitignore
├── package.json
├── package-lock.json
├── server.js                  # Main Express server & routes
├── tailwind.config.js         # Tailwind configuration
└── vercel.json                # Vercel project settings 
```
