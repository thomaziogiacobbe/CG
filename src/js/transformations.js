class Transformations {
    constructor() {
        this.translation = {
            x: 0,
            y: 0,
            z: 0
        };
    
        this.rotation = {
            x: degToRad(0),
            y: degToRad(0),
            z: degToRad(0),
            r: degToRad(0)
        };
    
        this.scale = {
            x: 1,
            y: 1,
            z: 1,
            factor: 1,
        };
    }
}