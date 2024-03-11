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
// lights
const lights = [];

//load menu and index
for (let index = 0; index < modelsAvailable.length; index++) {
	modelsIndex[modelsAvailable[index]] = index;
	modelsMenu.push({
		type: modelsAvailable[index],
		...Transformations.transformationForMenu(index),
		element: undefined
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

function createElem(type, parent, className) {
	const elem = document.createElement(type);
	parent.appendChild(elem);
	if (className) {
		elem.className = className;
	}
	return elem;
}

function drawScene(model) {
	// Clear the canvas AND the depth buffer.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	let cam = new Camera('Menu Camera', -15, 4, 15);
	cam.setFieldOfViews(40);

	// Make a view matrix from the camera matrix.
	var projectionMatrix = cam.computeProjectionMatrix();
	var viewMatrix = m4.inverse(cam.computeCameraMatrix());

	const sharedUniforms = {
		u_lightDirection: m4.normalize([-1, 3, 5]),
		u_view: viewMatrix,
		u_projection: projectionMatrix,
		u_viewWorldPosition: m4.identity(),
		shading: 20.0,
	};

	let index = modelsIndex[model.type];
	twgl.setUniforms(meshProgramInfo, sharedUniforms);
	Model.drawModel(models[index].parts, model, 1);
}

function fillMenuItens() {
	const contentElem = document.querySelector('#menu');
	for (const m of modelsMenu) {
		const outerElem = createElem('div', contentElem, 'item');
		const viewElem = createElem('div', outerElem, 'view');
		m.element = viewElem;
	}
}

async function main() {

	await loadGUI();

	for (const m of modelsAvailable) {
		models.push(Model.buildModelFromShape(await Shape.getShapeByName(m), m));
	}

	fillMenuItens();

	function render() {
		twgl.resizeCanvasToDisplaySize(gl.canvas);

		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.SCISSOR_TEST);

		var projectionMatrix = camera.computeProjectionMatrix();
		var viewMatrix = m4.inverse(camera.computeCameraMatrix());

		const lightsPositions = lights.map(l => [l.x, l.y, l.z]);
		const lightsColors = lights.map(l => l.color);

		const sharedUniforms = {
			u_lightDirection: m4.normalize([-1, 3, 5]),
			u_view: viewMatrix,
			u_projection: projectionMatrix,
			u_viewWorldPosition: m4.identity(),
			u_lightsPositions: lightsPositions,
			u_lightsColors: lightsColors
		};

		const {width, h} = gl.canvas;
		let height = h;

		let leftWidth;

		gl.useProgram(meshProgramInfo.program);

		for (const model of modelsMenu) {
			const rect = model.element.getBoundingClientRect();
			if (rect.bottom < 0 || rect.top > gl.canvas.clientHeight ||
				rect.right < 0 || rect.left > gl.canvas.clientWidth) {
				continue;  // it's off screen
			}

			leftWidth = rect.right - rect.left;
			height = rect.bottom - rect.top;
			const left = rect.left;
			const bottom = gl.canvas.clientHeight - rect.bottom - 1;

			gl.viewport(left, bottom, leftWidth, height);
			gl.scissor(left, bottom, leftWidth, height);
			gl.clearColor(100, 101, 102, 1);

			drawScene(model);
		}

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const rightWidth = width - leftWidth;
		gl.viewport(leftWidth, 0, rightWidth, gl.canvas.clientHeight);
		gl.scissor(leftWidth, 0, rightWidth, gl.canvas.clientHeight);

		gl.useProgram(meshProgramInfo.program);

		modelsInstances.forEach((model) => {
			if (model) {
				let index = modelsIndex[model.type];
				sharedUniforms['shading'] = model.shading;
				twgl.setUniforms(meshProgramInfo, sharedUniforms);
				Model.drawModel(models[index].parts, model, modelCount[index]);
			}
		});
		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}

main();
