//convert from degrees to radians 
const degToRad = (d) => (d * Math.PI) / 180;

//convert from radians to degrees
const radToDeg = (r) => (r * 180) / Math.PI;

// const textures = [
// 	'default.png',
// 	'lulutexture.jpg',
// 	'supermax.png',
// 	'chadlonso.png',
// 	'kimi.jpg'
// ];

//function to add a new model in the world
function addMod(model) {
	modelsInstances.push({
		type: model,
		...new Transformations()
	});
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

function getExtents(positions) {
	const min = positions.slice(0, 3);
	const max = positions.slice(0, 3);
	for (let i = 3; i < positions.length; i += 3) {
		for (let j = 0; j < 3; ++j) {
			const v = positions[i + j];
			min[j] = Math.min(v, min[j]);
			max[j] = Math.max(v, max[j]);
		}
	}
	return { min, max };
}

function getGeometriesExtents(geometries) {
	return geometries.reduce(({ min, max }, { data }) => {
		const minMax = getExtents(data.position);
		return {
			min: min.map((min, ndx) => Math.min(minMax.min[ndx], min)),
			max: max.map((max, ndx) => Math.max(minMax.max[ndx], max)),
		};
	}, {
		min: Array(3).fill(Number.POSITIVE_INFINITY),
		max: Array(3).fill(Number.NEGATIVE_INFINITY),
	});
}