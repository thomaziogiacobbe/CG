let gui;

//Models Properties
const manageModel1 = {
	addModel: () => { addModBidet(); },
	deleteModel: () => { }
};

const manageModel2 = {
	addModel: () => { addModHandWasher(); },
	deleteModel: () => { }
};

const manageModel3 = {
	addModel: () => { addModShower(); },
	deleteModel: () => { }
};

const manageModel4 = {
	addModel: () => { addModToilet(); },
	deleteModel: () => { }
};

const loadScene = {
	loadFile: function () {
		document.getElementById('myInput').click();
	}
};

const saveScene = {
	saveFile: () => { saveFile(); }
}

//Cameras Properties
const cam = {
	zoom: 0,
	chooseCamera: 'Center Camera'
};

//Load Gui
const loadGUI = async () => {
	gui = new dat.GUI();

	gui
		.add(loadScene, 'loadFile')
		.name('Load Scene');

	gui
		.add(saveScene, 'saveFile')
		.name('Save Scene');

	// addModel button
	gui
		.add(manageModel1, 'addModel')
		.onChange(() => {
			setTimeout(addNewController, 50, gui, 'Bidet');
		})
		.name('Bidet');

	gui
		.add(manageModel2, 'addModel')
		.onChange(() => {
			setTimeout(addNewController, 50, gui, 'HandWasher');
		})
		.name('HandWasher');

	gui
		.add(manageModel3, 'addModel')
		.onChange(() => {
			setTimeout(addNewController, 50, gui, 'Shower');
		})
		.name('Shower');

	gui
		.add(manageModel4, 'addModel')
		.onChange(() => {
			setTimeout(addNewController, 50, gui, 'Toilet');
		})
		.name('Toilet');

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
	let shape;

	for (const m of modelsToLoad) {
		shape = shapes.getShapeByName(m.type);
		let model = Model.buildModelFromShape(shape, m.type);
		model.translation = m.translation;
		model.rotation = m.rotation;
		model.scale = m.scale;
		models.push(model);
		addNewController(gui, model.type)
	}
}

function download(data, filename) {
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

function saveFile() {
	let json = [];
	for (const m of models) {
		let type = m.type;
		let translation = m.translation;
		let rotation = m.rotation;
		let scale = m.scale;
		json.push({
			type: type,
			translation: translation,
			rotation: rotation,
			scale: scale
		})
	}

	download(JSON.stringify(json), 'scene.json');
}

//Models Controllers Configs
function addNewController(gui, m) {
	const index = modelsInstances.length - 1;
	let model = modelsInstances[index];
	var modelCountIndex = 0;
	var choosenModel = null;

	switch (m) {
		case 'Bidet':
			modelCountIndex = 0;
			choosenModel = manageModel1;
			break;

		case 'HandWasher':
			modelCountIndex = 1;
			choosenModel = manageModel2;
			break;

		case 'Shower':
			modelCountIndex = 2;
			choosenModel = manageModel3;
			break;

		case 'Toilet':
			modelCountIndex = 3;
			choosenModel = manageModel4;
			break;

		default:
			break;
	}

	modelCount[modelCountIndex] = modelCount[modelCountIndex] + 1;

	const modelFolder = gui.addFolder(m + modelCount[modelCountIndex]);

	//Delete model
	modelFolder
		.add(choosenModel, 'deleteModel')
		.onChange(() => {
			gui.removeFolder(modelFolder);
			removeMod(index);
		})
		.name('Delete Model');

	//Models folders
	const modelTranslateFolder = modelFolder.addFolder('Translation');
	const modelRotationFolder = modelFolder.addFolder('Rotation');
	const modelScaleFolder = modelFolder.addFolder('Scale');

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
