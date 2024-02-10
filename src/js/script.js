const { gl, meshProgramInfo } = initializeWorld();
// shapes object
const shapes = new Shape();
// models array
const models = [];
// instance models
const modelsInstances = [];
// count of each model in world
const modelCount = [0, 0, 0, 0];
// cameras array with default camera
const cameras = [new Camera('Center Camera', 0, 0, 15)];
// index of cameras array
var activeCamera = 0;
// active camera
var camera = cameras[activeCamera];
// create 2nd and 3rd cameras.
cameras.push(new Camera('Right Camera', 15, 0, 10));
cameras.push(new Camera('Left Camera', -15, 0, 10));

async function main() {

	await loadGUI();

	await shapes.loadAllObj();

	models.push(Model.buildModelFromShape(shapes.bidet, 'Bidet'));
	models.push(Model.buildModelFromShape(shapes.handWasher, 'HandWasher'));
	models.push(Model.buildModelFromShape(shapes.shower, 'Shower'));
	models.push(Model.buildModelFromShape(shapes.toilet, 'Toilet'));

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
