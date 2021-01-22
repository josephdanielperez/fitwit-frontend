class Exercise {
    constructor(id, name, split_id) {
        this.id = id;
        this.name = name;
        this.split_id = split_id;
    }

    filterExercise() {
        selectedExercises.push(this.name)
    }

    static get name() { return document.getElementsById('exercise-name')[0] };
    static get split() { return document.getElementsById('split-id')[0] };

}