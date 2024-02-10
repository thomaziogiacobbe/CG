const { gl, meshProgramInfo } = initializeWorld();
// models array
const models = [];
// instance models
const modelsInstances = [];
// count of each model in world
const modelCount = [0, 0, 0, 0];
// instances for menu
const modelsMenu = [];
//Index of each model
const modelsIndex = {};

//load menu and index
for (let index = 0; index < modelsAvailable.length; index++) {
	modelsIndex[modelsAvailable[index]] = index;
	modelsMenu.push({
		type: modelsAvailable[index],
		...new Transformations()
	});
}

// cameras array with default camera
const cameras = [new Camera('Center Camera', 0, 0, 15)];
// index of cameras array
var activeCamera = 0;
// active camera
var camera = cameras[activeCamera];
// create 2nd and 3rd cameras.
cameras.push(new Camera('Right Camera', 15, 0, 10));
cameras.push(new Camera('Left Camera', -15, 0, 10));

function drawScene() {
	// Clear the canvas AND the depth buffer.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	let cam = new Camera('Menu Camera', 0, 4, 15);

	// Make a view matrix from the camera matrix.
	var projectionMatrix = cam.computeProjectionMatrix();
	var viewMatrix = m4.inverse(cam.computeCameraMatrix());

	gl.useProgram(meshProgramInfo.program);

	const sharedUniforms = {
		u_lightDirection: m4.normalize([-1, 3, 5]),
		u_view: viewMatrix,
		u_projection: projectionMatrix,
		u_viewWorldPosition: m4.identity(),
	};

	// modelsMenu.forEach((model) => {
	// 	if (model) {
	// 		let index = modelsIndex[model.type];
	// 		twgl.setUniforms(meshProgramInfo, sharedUniforms);
	// 		Model.drawModel(models[index].parts, model, modelCount[index]);
	// 	}
	// });
	let model = modelsMenu[0];
	if (model) {
		model.rotation.y = -5;
		let index = modelsIndex[model.type];
		twgl.setUniforms(meshProgramInfo, sharedUniforms);
		Model.drawModel(models[index].parts, model, 1);
	}
}

async function main() {

	await loadGUI();

	for (const m of modelsAvailable) {
		models.push(Model.buildModelFromShape(await Shape.getShapeByName(m), m));
	}

	function render() {
		twgl.resizeCanvasToDisplaySize(gl.canvas);

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.enable(gl.DEPTH_TEST);

		var projectionMatrix = camera.computeProjectionMatrix();
		var viewMatrix = m4.inverse(camera.computeCameraMatrix());

		const sharedUniforms = {
			u_lightDirection: m4.normalize([-1, 3, 5]),
			u_view: viewMatrix,
			u_projection: projectionMatrix,
			u_viewWorldPosition: m4.identity(),
		};

		gl.useProgram(meshProgramInfo.program);

		modelsInstances.forEach((model) => {
			if (model) {
				let index = modelsIndex[model.type];
				twgl.setUniforms(meshProgramInfo, sharedUniforms);
				Model.drawModel(models[index].parts, model, modelCount[index]);
			}
		});
		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}

main();
