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
            x: 2,
            y: 2,
            z: 2,
            factor: 2,
        };
    }

    static computeTransformations(translation, rotation, scale) {

		//Scale the model keep aspect
		const scaleVectorProportional = [
			scale.factor,
			scale.factor,
			scale.factor,
		];

		//Scale the model
		const scaleVector = [
			scale.x,
			scale.y,
			scale.z,
		];

		//Translate the model
		let matrix = m4.translate(
			m4.identity(),
			translation.x,
			translation.y,
			translation.z
		);

		//Rotate the model
		matrix = m4.axisRotate(matrix, [1, 0, 0], rotation.x);
		matrix = m4.axisRotate(matrix, [0, 1, 0], rotation.y);
		matrix = m4.axisRotate(matrix, [0, 0, 1], rotation.z);

		//Scale the model
		matrix = twgl.m4.scale(matrix, scaleVectorProportional);
		matrix = twgl.m4.scale(matrix, scaleVector);

		return matrix;
	}
}