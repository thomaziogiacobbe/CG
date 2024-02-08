//convert from degrees to radians 
const degToRad = (d) => (d * Math.PI) / 180;

//convert from radians to degrees
const radToDeg = (r) => (r * 180) / Math.PI;

//function to add a new model in the world
async function addModBidet() {
	obj = shapes.getBidet();
	var m = new Model();
	m.setGeometry(obj.geometries);
	m.setMaterial(obj.mtl);
	m.setBaseHRef(obj.baseHref);
	models.push(m);
}

async function addModHandWasher() {
	obj = shapes.getHandWasher()
	var m = new Model();
	m.setGeometry(obj.geometries);
	m.setMaterial(obj.mtl);
	m.setBaseHRef(obj.baseHref);
	models.push(m);
}

async function addModShower() {
	obj = shapes.getShower()
	var m = new Model();
	m.setGeometry(obj.geometries);
	m.setMaterial(obj.mtl);
	m.setBaseHRef(obj.baseHref);
	models.push(m);
}

async function addModToilet() {
	obj = shapes.getToilet()
	var m = new Model();
	m.setGeometry(obj.geometries);
	m.setMaterial(obj.mtl);
	m.setBaseHRef(obj.baseHref);
	models.push(m);
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