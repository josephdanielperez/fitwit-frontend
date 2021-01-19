document.addEventListener("DOMContentLoaded", () => {
    fetchSplits();
    fetchExercises();
    getWorkout();
})

const targetUrl = "http://localhost:3000"

document.addEventListener('submit', getFormData)

let user = {name: '', split: '', length: ''}
const filteredWorkoutSplit = []
const filteredWorkoutExercises = []
const generatedWorkout = []

// collects form data and makes usable throughout code //
function getFormData(event) {
    event.preventDefault();
    let name = document.getElementsByName('name')[0].value;
    user.name = name;
    let workoutSplit  = document.getElementsByName('split')[0].value;
    user.split = workoutSplit;
    let workoutLength = document.getElementsByName('length')[0].value;
    user.length = workoutLength;

    generateUserWorkout();
}

// this method takes the user's requested split and filters the exercise array with exercises that match the split.id //
function generateUserWorkout() {

    // change display from form to workout div //
    formDiv.classList.toggle("hide");
    workoutDiv.classList.toggle("hide");

    // grabs the user requested split element... //
    for (let i = 0; i < s.length; i++) {
        if (s[i].name === `${user.split}`) {
            filteredWorkoutSplit.push(s[i]);
        }
    }

    // grabs the exercise elements that match the user's requested split... //
    for (let i = 0; i < e.length; i++) {
        if (e[i].split_id === filteredWorkoutSplit[0].id) {
            filteredWorkoutExercises.push(e[i]);
        }
    }

    // takes the filtered exercises and user's requested amount of exercises to make a random, customized workout //
    generatedWorkout.push(getRandomExercises(filteredWorkoutExercises, Number(user.length)));
    // THE METHOD ABOVE GENERATES ENDLESS ARRAYS FILTERED INTO GENERATEDWORKOUT ARRAY, MIGHT NEED TO FIX, MIGHT NOT //

    // turns every exercise in the user's generated workout into a list item todo list //
    generatedWorkout[0].forEach(exercise => addWorkoutList(exercise));
    completeWorkout();
};

// this method takes the filtered exercise array, shuffles it, and returns the amount of exercises the user requested //
function getRandomExercises(list, size) {
    var currentIndex = list.length, temporaryValue, randomIndex;

    // while there remain elements to shuffle... //
    while (0 != currentIndex) {

        // pick remaining element... //
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // and swap it with the current element //
        temporaryValue = list[currentIndex];
        list[currentIndex] = list[randomIndex];
        list[randomIndex] = temporaryValue;
    }

    return list.slice(0, size);
};

const formDiv = document.getElementById("form-div");
const workoutDiv = document.getElementById("workout-div");
const workoutList = document.getElementById("workout-list");

workoutList.addEventListener("click", check);


function addWorkoutList(exercise) {
    
    // workout div //
    const workoutDiv = document.createElement("div");
    workoutDiv.classList.add("workout");
    
    // create list items //
    const newWorkout = document.createElement("li");
    newWorkout.innerText = `${exercise.name}`;
    newWorkout.classList.add("workout-item");
    workoutDiv.appendChild(newWorkout);

    // add exercise to local storage //
    saveLocalWorkout(`${exercise.name}`);

    // check mark button //
    const completedButton = document.createElement("button");
    
    //completedButton.innerText = "what it do booboo";
    completedButton.innerHTML = "<i class='fas fa-check'></i>";
    completedButton.classList.add("complete-btn");
    workoutDiv.appendChild(completedButton);
    
    // append to list //
    workoutList.appendChild(workoutDiv);

    completedButton.addEventListener('click', first);
}

function check(e) {
    const checkmark = e.target;

    // allows user to visually show exercise has been completed //
    if (checkmark.classList[0] === "complete-btn") {
        const workout = checkmark.parentElement;
        workout.classList.toggle("completed");
    }
}

// save local exercises //
function saveLocalWorkout(exercise) {
    // CHECK IF I ALREADY HAVE THINGS IN THERE? //
    let workout;
    if (localStorage.getItem("workout") === null) {
        workout = [];
    } else {
        workout = JSON.parse(localStorage.getItem("workout"));
    }
    workout.push(exercise);
    localStorage.setItem("workout", JSON.stringify(workout));
}

const finishButton = document.getElementById("finish-workout");
finishButton.addEventListener("click", reset);

function getWorkout() {
    // CHECK IF I ALREADY HAVE THINGS IN THERE? //
    let workout;
    if (localStorage.getItem("workout") === null) {
        workout = [];
    } else {
        workout = JSON.parse(localStorage.getItem("workout"));
        formDiv.classList.toggle("hide");
        workoutDiv.classList.toggle("hide");
    }
    workout.forEach(function(exercise) {
        // workout div //
        const workoutDiv = document.createElement("div");
        workoutDiv.classList.add("workout");

        // create list items //
        const newWorkout = document.createElement("li");
        newWorkout.innerText = exercise;
        newWorkout.classList.add("workout-item");
        workoutDiv.appendChild(newWorkout);

        // check mark button //
        const completedButton = document.createElement("button");

        //completedButton.innerText = "what it do booboo";
        completedButton.innerHTML = "<i class='fas fa-check'></i>";
        completedButton.classList.add("complete-btn");
        workoutDiv.appendChild(completedButton);

        // append to list //
        workoutList.appendChild(workoutDiv);


        completedButton.addEventListener('click', first);
    });
}


// allows button event listener to be registered on click //
function first() {
    document.addEventListener("click", completeWorkout)
}

// wraps up the app, shows a complete button when everything is crossed out and resets the app afterwards //
function completeWorkout() {
    if ($("#workout-list .workout.completed").length === $("#workout-list .workout").length) {
        finishButton.classList.remove("hide");
    }
}

function reset(e) {
    if (user.name != '') {
        alert(`Great job today, ${user.name}! See you for another workout soon!`);
    } else {
        alert(`Great job today! See you for another workout soon!`);
    }
    localStorage.clear();
    location.reload();
}

// methods to bridge backend database and frontend development //
const s = []
const e = []

function fetchSplits() {
    fetch(`${targetUrl}/splits`)
    .then(resp => resp.json())
    .then(splits => {
        for (const split of splits){
            let x = new Split(split.id, split.name)
            console.log(x)
            s.push(x);
        }
    })
}

function fetchExercises() {
    fetch(`${targetUrl}/exercises`)
    .then(resp => resp.json())
    .then(exercises => {
        for (const exercise of exercises){
            let y = new Exercise(exercise.id, exercise.name, exercise.split_id)
            console.log(y)
            e.push(y);
        }
    })
}