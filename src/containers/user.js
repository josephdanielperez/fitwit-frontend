class User{
    static get name() { return document.getElementsByName('name')[0] };
    static get split() { return document.getElementsByName('split')[0] };
    static get length() { return document.getElementsByName('length')[0] };

    constructor(name, split, length){
        this.name = name;
        this.split = split;
        this.length = length;
    }    
}