require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

// Sequelize connection using connection string from .env
const sequelize = new Sequelize(process.env.PG_CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

// Define Sector model
const Sector = sequelize.define('Sector', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sector_name: Sequelize.STRING
}, {
    timestamps: false
});

// Define Project model
const Project = sequelize.define('Project', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    feature_img_url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    summary_short: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    intro_short: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    impact: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    original_source_url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sector_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

// Define association
Project.belongsTo(Sector, { foreignKey: 'sector_id' });

async function initialize() {
    try {
        await sequelize.authenticate();
        console.log("Database connection successful");
        await sequelize.sync();

        // Reset the sequence to the maximum id + 1
        const [maxIdResult] = await sequelize.query('SELECT MAX(id) as max_id FROM "Projects"');
        const maxId = maxIdResult[0].max_id || 0;
        await sequelize.query(`ALTER SEQUENCE "Projects_id_seq" RESTART WITH ${maxId + 1}`);
        console.log(`Reset Projects_id_seq to start at ${maxId + 1}`);

        return Promise.resolve();
    } catch (err) {
        return Promise.reject("Initialization failed: " + err.message);
    }
}

function getAllProjects() {
    return Project.findAll({ include: [Sector] })
        .then(projects => Promise.resolve(projects))
        .catch(err => Promise.reject("Unable to fetch projects: " + err.message));
}

function getProjectById(projectId) {
    return Project.findAll({ 
        where: { id: projectId }, 
        include: [Sector] 
    })
        .then(projects => {
            if (projects.length > 0) {
                return Promise.resolve(projects[0]);
            } else {
                return Promise.reject(`No projects found for ID: ${projectId}`);
            }
        })
        .catch(err => Promise.reject("Unable to find requested project: " + err.message));
}

function getProjectsBySector(sector) {
    return Project.findAll({
        include: [Sector],
        where: {
            '$Sector.sector_name$': {
                [Sequelize.Op.iLike]: `%${sector}%`
            }
        }
    })
        .then(projects => {
            if (projects.length > 0) {
                return Promise.resolve(projects);
            } else {
                return Promise.reject(`No projects found for sector: ${sector}`);
            }
        })
        .catch(err => Promise.reject("Unable to find requested projects: " + err.message));
}

function addProject(projectData) {
    const { id, ...cleanedData } = projectData;
    cleanedData.sector_id = parseInt(cleanedData.sector_id, 10);
    console.log("Cleaned project data for creation:", cleanedData);

    return Project.create(cleanedData)
        .then(() => {
            console.log("Project added successfully");
            return Promise.resolve();
        })
        .catch(err => {
            console.error("Error in addProject:", err);
            return Promise.reject(err.errors ? err.errors[0].message : err.message);
        });
}

function getAllSectors() {
    return Sector.findAll()
        .then(sectors => Promise.resolve(sectors))
        .catch(err => Promise.reject("Unable to fetch sectors: " + err.message));
}

function editProject(id, projectData) {
    return Project.update(projectData, { where: { id: id } })
        .then(() => Promise.resolve())
        .catch(err => Promise.reject(err.errors[0].message));
}

function deleteProject(id) {
    return Project.destroy({ where: { id: id } })
        .then(() => Promise.resolve())
        .catch(err => Promise.reject(err.errors[0].message));
}

module.exports = { 
    initialize, 
    getAllProjects, 
    getProjectById, 
    getProjectsBySector, 
    addProject, 
    getAllSectors, 
    editProject, 
    deleteProject 
};