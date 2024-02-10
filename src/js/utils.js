//convert from degrees to radians 
const degToRad = (d) => (d * Math.PI) / 180;

//convert from radians to degrees
const radToDeg = (r) => (r * 180) / Math.PI;

const modelsIndex = {
	'Bidet': 0,
	'HandWasher': 1,
	'Shower': 2,
	'Toilet': 3
};

// const textures = [
// 	'default.png',
// 	'lulutexture.jpg',
// 	'supermax.png',
// 	'chadlonso.png',
// 	'kimi.jpg'
// ];

//function to add a new model in the world
function addModBidet() {
	modelsInstances.push(Model.buildModelFromShape(shapes.getBidet(), 'Bidet'));
}

function addModHandWasher() {
	modelsInstances.push(Model.buildModelFromShape(shapes.getHandWasher(), 'HandWasher'));
}

function addModShower() {
	modelsInstances.push(Model.buildModelFromShape(shapes.getShower(), 'Shower'));
}

function addModToilet() {
	modelsInstances.push(Model.buildModelFromShape(shapes.getToilet(), 'Toilet'));
}

//function to remove a model in the world
function removeMod(modelIndex) {
	let type = modelsInstances[modelIndex].type;
	let idx = modelsIndex[type];
	modelCount[idx] -= 1;
	modelsInstances.splice(modelIndex, 1, false);
}

//function to update the active camera 
function changeCamera(cameraName) {
	const index = cameras.map((camera) => camera.name).indexOf(cameraName);
	activeCamera = index;
	camera = cameras[activeCamera];
}

//function to update the zoom of camera 
function cameraZoom(zoomAmount) {
	const deg = 60 - zoomAmount;
	camera.setFieldOfViews(deg);
}