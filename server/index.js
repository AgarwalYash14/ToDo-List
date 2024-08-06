const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

//Using middleware
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "tasks.json");
const CATEGORIES_FILE = path.join(__dirname, "categories.json");

async function updateCategoriesWithTaskCount() {
    const tasksData = await fs.readFile(DATA_FILE, "utf8");
    const categoriesData = await fs.readFile(CATEGORIES_FILE, "utf8");

    const tasks = JSON.parse(tasksData);
    const categories = JSON.parse(categoriesData);

    const categoryCounts = tasks.reduce((counts, task) => {
        if (task.categoryTitle) {
            counts[task.categoryTitle] = (counts[task.categoryTitle] || 0) + 1;
        }
        return counts;
    }, {});

    const updatedCategories = categories.map((category) => ({
        ...category,
        tasksCount: categoryCounts[category.categoryTitle] || 0,
    }));

    await fs.writeFile(
        CATEGORIES_FILE,
        JSON.stringify(updatedCategories, null, 2)
    );

    return updatedCategories;
}


async function updateAndEmitCategoryCounts() {
    const updatedCategories = await updateCategoriesWithTaskCount();
    io.emit("categoriesUpdated", updatedCategories);
}

io.on("connection", (socket) => {
    socket.on("addTask", async (task) => {
        try {
            let tasks = [];
            const data = await fs.readFile(DATA_FILE, "utf8");
            tasks = JSON.parse(data);
            task.isChecked = false;
            tasks.push(task);
            await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));

            // const updatedCategories = await updateCategoriesWithTaskCount();
            io.emit("taskAdded", task);
            await updateAndEmitCategoryCounts();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    });

    socket.on("getTasks", async () => {
        try {
            const taskData = await fs.readFile(DATA_FILE, "utf8");
            const categoriesData = await fs.readFile(CATEGORIES_FILE, "utf8");
            const tasks = JSON.parse(taskData);
            const categories = JSON.parse(categoriesData);
            socket.emit("tasksAndCategories", { tasks, categories });
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    });

    socket.on("updateTask", async (updatedTask) => {
        try {
            const data = await fs.readFile(DATA_FILE, "utf8");
            let tasks = JSON.parse(data);

            const index = tasks.findIndex((task) => task.id === updatedTask.id);
            if (index !== -1) {
                tasks[index] = updatedTask;
                await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
                io.emit("taskUpdated", updatedTask);
                await updateAndEmitCategoryCounts();
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    });

    socket.on("deleteTask", async (taskId) => {
        try {
            const data = await fs.readFile(DATA_FILE, "utf8");
            let tasks = JSON.parse(data);

            tasks = tasks.filter((task) => task.id !== taskId);

            await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
            // const updatedCategories = await updateCategoriesWithTaskCount();
            io.emit("taskDeleted", taskId);
            // io.emit("categoriesUpdated", updatedCategories);
            await updateAndEmitCategoryCounts();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    });

    socket.on("updateTaskCheckedState", async (taskId, isChecked) => {
        try {
            const data = await fs.readFile(DATA_FILE, "utf8");
            let tasks = JSON.parse(data);

            const index = tasks.findIndex((task) => task.id === taskId);
            if (index !== -1) {
                tasks[index].isChecked = isChecked;
                await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
                io.emit("taskCheckedStateUpdated", { taskId, isChecked });
            }
        } catch (error) {
            console.error("Error updating task checked state:", error);
        }
    });

    socket.on("createCategory", async (category) => {
        try {
            let categories = [];
            const category_data = await fs.readFile(CATEGORIES_FILE, "utf8");
            categories = JSON.parse(category_data);
            categories.push(category);
            await fs.writeFile(
                CATEGORIES_FILE,
                JSON.stringify(categories, null, 2)
            );
            io.emit("categoryCreated", category);
        } catch (error) {
            console.error("Error creating category:", error);
        }
    });

    socket.on("getCategories", async () => {
        try {
            const updatedCategories = await updateCategoriesWithTaskCount();
            socket.emit("categories", updatedCategories);
        } catch (error) {
            console.error("Error fetching and updating categories:", error);
            socket.emit("error", "Failed to fetch categories");
        }
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
