//convert from degrees to radians 
const degToRad = (d) => (d * Math.PI) / 180;

//convert from radians to degrees
const radToDeg = (r) => (r * 180) / Math.PI;

//function to add a new model in the world
function addModBidet() {
	obj = shapes.getBidet();
	modelsInstances.push(new Model(obj.baseHref, obj.geometries, obj.mtl, 'Bidet'));
}

function addModHandWasher() {
	obj = shapes.getHandWasher()
	modelsInstances.push(new Model(obj.baseHref, obj.geometries, obj.mtl, 'HandWasher'));
}

function addModShower() {
	obj = shapes.getShower()
	modelsInstances.push(new Model(obj.baseHref, obj.geometries, obj.mtl, 'Shower'));
}

function addModToilet() {
	obj = shapes.getToilet()
	modelsInstances.push(new Model(obj.baseHref, obj.geometries, obj.mtl, 'Toilet'));
}

//function to remove a model in the world
function removeMod(modelIndex) {
	let t = modelsInstances[modelIndex].type;
	switch (t) {
		case 'Bidet':
			modelCount[0] -= 1;
			break;

		case 'HandWasher':
			modelCount[1] -= 1;
			break;

		case 'Shower':
			modelCount[2] -= 1;
			break;

		case 'Toilet':
			modelCount[3] -= 1;
			break;

		default:
			break;
	}
	modelsInstances.splice(modelIndex, 1, false);
}

function saveWorld() {

	//save file
}

function loadWorld(file) {

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