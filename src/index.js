document.addEventListener('DOMContentLoaded', () => {
    getLocalWorkout();
})

const targetUrl = 'http://localhost:3000'

// dom elements //
const formDiv = document.getElementById('form-div');
const workoutDiv = document.getElementById('workout-div');
const workoutList = document.getElementById('workout-list');
const finishButton = document.getElementById('finish-workout');

// buttons event listeners //
document.addEventListener('submit', getFormData);
workoutList.addEventListener('click', check);
finishButton.addEventListener('click', reset);

// objects & arrays //
let user;
let selectedSplit;
const selectedExercises = []
const generatedWorkout = []

// methods //
function getFormData(event) {
    event.preventDefault();

    let name = User.name.value;
    let split  = User.split.value;
    let length = User.length.value;

    user = new User(name, split, length);

    selectSplit();
    setTimeout(selectExercises, 100);
    setTimeout(setupWorkout, 200);
}

function selectSplit() {
    fetch(`${targetUrl}/splits`)
    .then(resp => resp.json())
    .then(splits => {
        for (const split of splits){
            if (split.name === user.split) {
                let x = new Split(split.id, split.name);
                x.filterId();
            }
        }
    })
}

function selectExercises() {
    fetch(`${targetUrl}/exercises`)
    .then(resp => resp.json())
    .then(exercises => {
        for (const exercise of exercises){
            if (exercise.split_id === selectedSplit) {
                let x = new Exercise(exercise.id, exercise.name, exercise.split_id);
                x.filterExercise();
            }
        }
    })
}

function setupWorkout() {
    // change display from form to workout div //
    formDiv.classList.toggle('hide');
    workoutDiv.classList.toggle('hide');

    // creates a workout based off selected exercises and the user's requested length //
    generateWorkout(selectedExercises, Number(user.length));

    // displays exercise in the user's workout to form a todo list //
    setTimeout(generatedWorkout.forEach(exercise => displayWorkoutList(exercise)), 100)
    finishWorkout();
};

function generateWorkout(list, size) {
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

    let x = list.slice(0, size)
    x.forEach(exercise => generatedWorkout.push(exercise));
};


function displayWorkoutList(exercise) {
    // workout div //
    const workoutDiv = document.createElement('div');
    workoutDiv.classList.add('workout');
    
    // create list items //
    const newWorkout = document.createElement('li');
    newWorkout.innerText = `${exercise}`;
    newWorkout.classList.add('workout-item');
    workoutDiv.appendChild(newWorkout);

    // add exercise to local storage //
    saveLocalWorkout(`${exercise}`);

    // check mark button //
    const completedButton = document.createElement('button');
    
    //completedButton.innerText = "what it do booboo";
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add('complete-btn');
    workoutDiv.appendChild(completedButton);
    
    // append to list //
    workoutList.appendChild(workoutDiv);

    completedButton.addEventListener('click', finishBuffer);
}

function check(x) {
    const checkmark = x.target;

    // allows user to visually show exercise has been completed //
    if (checkmark.classList[0] === 'complete-btn') {
        const workout = checkmark.parentElement;
        workout.classList.toggle('completed');
    }
}

// save local exercises //
function saveLocalWorkout(exercise) {
    // CHECK IF I ALREADY HAVE THINGS IN THERE? //
    let workout;
    if (localStorage.getItem('workout') === null) {
        workout = [];
    } else {
        workout = JSON.parse(localStorage.getItem('workout'));
    }
    workout.push(exercise);
    localStorage.setItem('workout', JSON.stringify(workout));
}

function getLocalWorkout() {
    // CHECK IF I ALREADY HAVE THINGS IN THERE? //
    let workout;
    if (localStorage.getItem('workout') === null) {
        workout = [];
    } else {
        workout = JSON.parse(localStorage.getItem('workout'));
        formDiv.classList.toggle('hide');
        workoutDiv.classList.toggle('hide');
    }
    workout.forEach(function(exercise) {
        // workout div //
        const workoutDiv = document.createElement('div');
        workoutDiv.classList.add('workout');

        // create list items //
        const newWorkout = document.createElement('li');
        newWorkout.innerText = exercise;
        newWorkout.classList.add('workout-item');
        workoutDiv.appendChild(newWorkout);

        // check mark button //
        const completedButton = document.createElement('button');

        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add('complete-btn');
        workoutDiv.appendChild(completedButton);

        // append to list //
        workoutList.appendChild(workoutDiv);

        completedButton.addEventListener('click', finishBuffer);
    });
}

// allows app to recognize the last clicked element //
function finishBuffer() {
    setTimeout(finishWorkout, 0);
}

// displays the finish wokrout button only when everything is crossed out //
function finishWorkout() {
    if ($('#workout-list .workout.completed').length === $('#workout-list .workout').length) {
        finishButton.classList.remove('hide');
    } else {
        finishButton.classList.add('hide');
    }
}

// resets app //
function reset() {
    if (user) {
        alert(`Great job today, ${user.name}! See you for another workout soon!`);
    } else {
        alert(`Great job today! See you for another workout soon!`);
    }
    localStorage.clear();
    location.reload();
}