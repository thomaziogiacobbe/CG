let gui;

const manageModel = {
	deleteModel: () => { },
}

for (const m of modelsAvailable) {
	manageModel['addModel' + m] = () => { addMod(m); }
}

const scene = {
	loadFile: function () {
		document.getElementById('myInput').click();
	},
	saveFile: () => { saveFile(); }
};

// const changeTex = {
// 	changeTex: () => { changeTexture(); }
// }

//Cameras Properties
const cam = {
	zoom: 0,
	chooseCamera: 'Center Camera'
};

//Load Gui
const loadGUI = async () => {
	gui = new dat.GUI();

	gui
		.add(scene, 'loadFile')
		.name('Load Scene');

	gui
		.add(scene, 'saveFile')
		.name('Save Scene');

	const lightsFolder = gui
		.addFolder('Lights');

	for (let i = 0; i < 5; i++) {
		let light = new Light();
		let lightFolder = lightsFolder.addFolder('Light ' + (i + 1));
		lightFolder.addColor(light, 'color')
		lightFolder.add(light, 'x', -100, 100, 1)
		lightFolder.add(light, 'y', -100, 100, 1)
		lightFolder.add(light, 'z', -100, 100, 1);
		lights.push(light);
	}

	for (const m of modelsAvailable) {
		gui
		.add(manageModel, 'addModel' + m)
		.onChange(() => {
			setTimeout(addNewController, 50, gui, m);
		})
		.name(m);
	}

	// camera controllers
	gui = configureCameraGui(gui);
};

//Camera controllers configs
function configureCameraGui(gui) {
	const cameraFolder = gui.addFolder('Camera');

	// choose camera
	cameraFolder
		.add(cam, 'chooseCamera')
		.options(['Right Camera', 'Center Camera', 'Left Camera'])
		.onChange(() => {
			changeCamera(cam.chooseCamera);
			updateCameraControllers();
		})
		.name('Change Camera');

	//Camera operations folders
	const cameraTranslateFolder = cameraFolder.addFolder('Translation');
	const cameraRotationFolder = cameraFolder.addFolder('Rotation');

	//Camera control options
	var cameraControls = [];
	addCameraControls();

	function updateCameraControllers() {
		cameraControls.forEach((control) => {
			control.remove();
		});
		cameraControls = [];
		addCameraControls();
	}

	//function to add camera controls
	function addCameraControls() {
		//Zoom
		cameraControls.push(
			cameraFolder.add(cam, 'zoom', 0, 59, 1).onChange(() => {
				cameraZoom(cam.zoom);
			})
		);

		//Translation
		cameraControls.push(
			cameraTranslateFolder.add(camera.position, 'x', -360, 360, 1)
		);
		cameraControls.push(
			cameraTranslateFolder.add(camera.position, 'y', -360, 360, 1)
		);
		cameraControls.push(
			cameraTranslateFolder.add(camera.position, 'z', -360, 360, 5)
		);

		//Rotation
		cameraControls.push(
			cameraRotationFolder.add(camera.rotation, 'x', -20, 20, 0.1)
		);
		cameraControls.push(
			cameraRotationFolder.add(camera.rotation, 'y', -20, 20, 0.1)
		);
		cameraControls.push(
			cameraRotationFolder.add(camera.rotation, 'z', -20, 20, 0.1)
		);
	}

	return gui;
}

async function readFile(event) {
	const file = event.target.files.item(0)
	const text = await file.text();

	modelsToLoad = JSON.parse(text);

	for (const m of modelsToLoad) {
		modelsInstances.push(m);
		addNewController(gui, m.type);
	}
}

function saveFile() {
	let data = JSON.stringify(modelsInstances);
	let filename = 'scene.json';
	var file = new Blob([data], { type: "text/json" });
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else {
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

// function changeTexture(model) {
// 	const minCeiled = Math.ceil(0);
// 	const maxFloored = Math.floor(4);
// 	let num = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
// 	let randomTex = textures[num];
// 	model.loadTextureFromTex(randomTex);
// 	model.buildObject();
// }

//Models Controllers Configs
function addNewController(gui, m) {
	const index = modelsInstances.length - 1;
	let model = modelsInstances[index];
	var modelCountIndex = modelsIndex[m];

	modelCount[modelCountIndex] += 1;

	const modelFolder = gui.addFolder(m + modelCount[modelCountIndex]);

	//Delete model
	modelFolder
		.add(manageModel, 'deleteModel')
		.onChange(() => {
			gui.removeFolder(modelFolder);
			removeMod(index);
		})
		.name('Delete Model');

	// modelFolder
	// 	.add(changeTex, 'changeTex')
	// 	.onChange(() => {
	// 		setTimeout(changeTexture, 50, model);
	// 	})
	// 	.name('Change Texture');

	//Models folders
	const modelTranslateFolder = modelFolder.addFolder('Translation');
	const modelRotationFolder = modelFolder.addFolder('Rotation');
	const modelScaleFolder = modelFolder.addFolder('Scale');

	modelFolder.add(model, 'shading', 1, 20, 1);

	//Translation
	modelTranslateFolder.add(model.translation, 'x', -200, 200, 1);
	modelTranslateFolder.add(model.translation, 'y', -200, 200, 1);
	modelTranslateFolder.add(model.translation, 'z', -200, 200, 1);

	//Rotation
	modelRotationFolder.add(model.rotation, 'x', -20, 20, 0.1);
	modelRotationFolder.add(model.rotation, 'y', -20, 20, 0.1);
	modelRotationFolder.add(model.rotation, 'z', -20, 20, 0.1);

	//Scale
	modelScaleFolder.add(model.scale, 'x', 0, 100, 0.1);
	modelScaleFolder.add(model.scale, 'y', 0, 100, 0.1);
	modelScaleFolder.add(model.scale, 'z', 0, 100, 0.1);
	modelScaleFolder.add(model.scale, 'factor', 0, 100, 0.01).name('Keep aspect ratio');
}
