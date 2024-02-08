const { gl, meshProgramInfo } = initializeWorld();
// shapes object
const shapes = new Shape();
// models array
const models = [];
// count of each model in world
const modelCount = [0, 0, 0, 0];
// cameras array with default camera
const cameras = [new Camera('Center Camera', 0, 0, 100)];
// index of cameras array
var activeCamera = 0;
// active camera
var camera = cameras[activeCamera];
// create 2nd and 3rd cameras.
cameras.push(new Camera('Right Camera', 100, 0, 25));
cameras.push(new Camera('Left Camera', -100, 0, 25));

async function main() {

	await loadGUI();

	await shapes.loadAllObj();

	function render() {
		twgl.resizeCanvasToDisplaySize(gl.canvas);

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);

		var projectionMatrix = camera.computeProjectionMatrix();
		var viewMatrix = m4.inverse(camera.computeCameraMatrix());

		const sharedUniforms = {
			u_lightDirection: m4.normalize([-1, 3, 5]),
			u_view: viewMatrix,
			u_projection: projectionMatrix,
			u_viewWorldPosition: m4.identity(),
		};

		gl.useProgram(meshProgramInfo.program);

		models.forEach((model) => {
			if (model) {
				model.setUniforms(sharedUniforms);
				model.drawModel();
			}
		});
		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}

main();
