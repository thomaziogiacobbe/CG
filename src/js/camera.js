class Camera {
	constructor(name, positionX, positionY, positionZ) {
		this.name = name;
		this.fieldOfViewRadians = degToRad(60);
		this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		this.zNear = 1;
		this.zFar = 1000;

		this.position = {
			x: positionX,
			y: positionY,
			z: positionZ,
		};

		this.rotation = {
			x: degToRad(0),
			y: degToRad(0),
			z: degToRad(0),
		};

		this.zoom = {
			factor: 1,
		};
	}

	computeCameraMatrix() {
		//Camera position
		this.cameraPosition = [this.position.x, this.position.y, this.position.z];

		//Camera target
		this.target = [0, 0, 0];

		//Up vector
		this.up = [0, 1, 0];
		let cameraMatrix = m4.lookAt(this.cameraPosition, this.target, this.up);

		//Compute x, y and z rotation
		cameraMatrix = m4.axisRotate(cameraMatrix, [1, 0, 0], degToRad(this.rotation.x * 3.6));
		cameraMatrix = m4.axisRotate(cameraMatrix, [0, 1, 0], degToRad(this.rotation.y * 3.6));
		cameraMatrix = m4.axisRotate(cameraMatrix, [0, 0, 1], degToRad(this.rotation.z * 3.6));

		return cameraMatrix;
	}

	computeProjectionMatrix() {
		this.projectionMatrix = m4.perspective(
			this.fieldOfViewRadians,
			this.aspect,
			this.zNear,
			this.zFar
		);
		return this.projectionMatrix;
	}

	setFieldOfViews(value) {
		this.fieldOfViewRadians = degToRad(value);
	}
}
