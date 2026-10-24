const welcomePage = document.getElementById("welcomePage");
const trackerPage = document.getElementById("trackerPage");
const nameForm = document.getElementById("nameForm");
const userNameInput = document.getElementById("userName");

const STORAGE_KEY = "stepupSimpleFitnessData";

function getToday() {
    return new Date().toLocaleDateString("en-CA");
}

function loadData() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

let data = loadData();

if (!data.name) data.name = "";
if (!data.goal) data.goal = 10000;

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function showTracker() {
    welcomePage.hidden = true;
    trackerPage.hidden = false;

    document.getElementById("greeting").textContent =
        "Hello, " + data.name + "! Let's stay active today 💪";

    document.getElementById("todayDate").textContent =
        "Today's date: " + new Date().toLocaleDateString();

    renderTracker();
}

function showWelcome() {
    welcomePage.hidden = false;
    trackerPage.hidden = true;
    userNameInput.value = data.name || "";
}

function resetDailyDataIfNeeded() {
    const today = getToday();

    if (data.date !== today) {
        data.date = today;
        data.steps = 0;
        data.calories = 0;
        data.water = 0;
    }

    if (typeof data.steps !== "number") data.steps = 0;
    if (typeof data.calories !== "number") data.calories = 0;
    if (typeof data.water !== "number") data.water = 0;
}

function renderTracker() {
    resetDailyDataIfNeeded();

    document.getElementById("stepsDisplay").textContent = data.steps;
    document.getElementById("caloriesDisplay").textContent = data.calories;
    document.getElementById("waterDisplay").textContent = data.water;
    document.getElementById("goalDisplay").textContent = data.goal;
    document.getElementById("goalInput").value = data.goal;

    const percentage = Math.min(
        100,
        Math.round((data.steps / data.goal) * 100)
    );

    document.getElementById("stepsProgress").style.width = percentage + "%";
    document.getElementById("stepsCaption").textContent =
        percentage + "% of your goal";

    saveData();
}

nameForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = userNameInput.value.trim();

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    data.name = name;
    resetDailyDataIfNeeded();
    saveData();
    showTracker();
});

document.getElementById("changeNameButton").addEventListener("click", function () {
    showWelcome();
});

document.getElementById("activityForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const steps = Number(document.getElementById("stepsInput").value);
    const calories = Number(document.getElementById("caloriesInput").value);

    if (!Number.isFinite(steps) || !Number.isFinite(calories) ||
        steps < 0 || calories < 0) {
        alert("Please enter valid, non-negative numbers.");
        return;
    }

    data.steps = steps;
    data.calories = calories;

    saveData();
    renderTracker();

    document.getElementById("activityMessage").textContent =
        "Activity saved successfully! 🎉";

    document.getElementById("activityForm").reset();
});

document.getElementById("goalForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const goal = Number(document.getElementById("goalInput").value);

    if (!Number.isFinite(goal) || goal < 1) {
        alert("Please enter a goal greater than zero.");
        return;
    }

    data.goal = goal;
    saveData();
    renderTracker();

    alert("Your daily step goal has been updated!");
});

document.getElementById("addWater").addEventListener("click", function () {
    data.water++;
    saveData();
    renderTracker();
});

document.getElementById("removeWater").addEventListener("click", function () {
    if (data.water > 0) {
        data.water--;
        saveData();
        renderTracker();
    }
});

document.getElementById("resetButton").addEventListener("click", function () {
    if (confirm("Reset today's steps, calories, and water?")) {
        data.steps = 0;
        data.calories = 0;
        data.water = 0;

        saveData();
        renderTracker();
    }
});

// Open the welcome page first unless a name has already been saved.
resetDailyDataIfNeeded();
saveData();

if (data.name) {
    showTracker();
} else {
    showWelcome();
}