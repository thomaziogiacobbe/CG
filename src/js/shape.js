class Shape {
	static #objFolder = '/src/assets/';

	constructor() {
	}

	static async getShapeByName(name) {
		return this.getShape(name + '.obj')
	}

	//function to select a shape
	static async getShape(objFile) {
		const objHref = this.#objFolder + objFile;
		const response = await fetch(objHref);
		const text = await response.text();
		const obj = parseOBJ(text);
		const baseHref = new URL(objHref, window.location.href);
		const matTexts = await Promise.all(obj.materialLibs.map(async filename => {
			const matHref = new URL(filename, baseHref).href;
			const response = await fetch(matHref);
			return await response.text();
		}));
		const materials = parseMTL(matTexts.join('\n'));
		return {
			baseHref: baseHref,
			geometries: obj.geometries,
			mtl: materials,
		}
	}
}