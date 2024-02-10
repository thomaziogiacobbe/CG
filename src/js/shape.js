class Shape {
	#objFolder = '/src/assets/';
	//definitions of the possible forms to be generated
	bidet;
	handWasher;
	shower;
	toilet;

	constructor() {
	}

	getShapeByName(name) {
		switch (name) {
			case 'Bidet':
				return this.getBidet();

			case 'HandWasher':
				return this.getHandWasher();

			case 'Shower':
				return this.getShower();

			case 'Toilet':
				return this.getToilet();

			default:
				break;
		}
	}

	getBidet() {
		return this.bidet;
	}

	getHandWasher() {
		return this.handWasher;
	}

	getShower() {
		return this.shower;
	}

	getToilet() {
		return this.toilet;
	}

	async loadAllObj() {
		this.bidet = await this.#getShape('Bidet.obj');
		this.handWasher = await this.#getShape('HandWasher.obj');
		this.shower = await this.#getShape('Shower.obj');
		this.toilet = await this.#getShape('Toilet.obj');
	}

	async #getWindmill() {
		const objHref = 'https://webgl2fundamentals.org/webgl/resources/models/windmill/windmill.obj';
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

	//function to select a shape
	async #getShape(objFile) {
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