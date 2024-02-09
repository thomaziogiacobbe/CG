//convert from degrees to radians 
const degToRad = (d) => (d * Math.PI) / 180;

//convert from radians to degrees
const radToDeg = (r) => (r * 180) / Math.PI;

//function to add a new model in the world
function addModBidet() {
	obj = shapes.getBidet();
	models.push(new Model(obj.baseHref, obj.geometries, obj.mtl));
}

function addModHandWasher() {
	obj = shapes.getHandWasher()
	models.push(new Model(obj.baseHref, obj.geometries, obj.mtl));
}

function addModShower() {
	obj = shapes.getShower()
	models.push(new Model(obj.baseHref, obj.geometries, obj.mtl));
}

function addModToilet() {
	obj = shapes.getToilet()
	models.push(new Model(obj.baseHref, obj.geometries, obj.mtl));
}

//function to remove a model in the world
function removeMod(modelIndex) {
	models.splice(modelIndex, 1, false);
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