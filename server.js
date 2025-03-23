require("dotenv").config();
const express = require("express");
const path = require('path');
const projectData = require("./modules/projects");
const app = express();
const port = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

async function startServer() {
    try {
        await projectData.initialize();
        console.log("Data initialized successfully!");

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error during initialization:", error.message);
    }
}

// Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/solutions/projects", async (req, res) => {
    try {
        const sector = req.query.sector;
        let projects;

        if (sector) {
            projects = await projectData.getProjectsBySector(sector);
        } else {
            projects = await projectData.getAllProjects();
        }

        res.render("viewProjects", { data: projects });

    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(404).render("404", { message: error });
    }
});

app.get("/solutions/projects/:idDemo", async (req, res) => {
    const projectId = parseInt(req.params['idDemo']);
    try {
        const project = await projectData.getProjectById(projectId);
        res.render("projectDetail", { project: project });
    } catch (error) {
        console.error("Error fetching project by ID:", error.message);
        res.status(404).render("404", { message: "Unable to find requested project." });
    }
});

app.get("/solutions/addProject", async (req, res) => {
    try {
        const sectors = await projectData.getAllSectors();
        res.render("addProject", { sectors: sectors });
    } catch (error) {
        console.error("Error fetching sectors:", error.message);
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
    }
});

app.post("/solutions/addProject", async (req, res) => {
    try {
        console.log("Received form data:", req.body);
        await projectData.addProject(req.body);
        console.log("Project added, redirecting...");
        res.redirect("/solutions/projects");
    } catch (error) {
        console.error("Error adding project:", error.stack);
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${error.message || error}` });
    }
});

app.get("/solutions/editProject/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    try {
        const project = await projectData.getProjectById(projectId);
        const sectors = await projectData.getAllSectors();
        res.render("editProject", { sectors: sectors, project: project });
    } catch (error) {
        console.error("Error fetching project or sectors:", error.message);
        res.status(404).render("404", { message: error });
    }
});

app.post("/solutions/editProject", async (req, res) => {
    try {
        await projectData.editProject(req.body.id, req.body);
        res.redirect("/solutions/projects");
    } catch (error) {
        console.error("Error editing project:", error);
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
    }
});

app.get("/solutions/deleteProject/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    try {
        await projectData.deleteProject(projectId);
        res.redirect("/solutions/projects");
    } catch (error) {
        console.error("Error deleting project:", error);
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
    }
});

// 404 Error Handling Middleware
app.use((req, res) => {
    res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for" });
});

// Start the server
startServer();