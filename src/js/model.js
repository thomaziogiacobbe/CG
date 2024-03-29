class Model {
	constructor(hRef, geometry, mtl, type) {
		this.gl = gl;
		this.meshProgramInfo = meshProgramInfo;
		this.baseHref = hRef;
		this.geometry = geometry;
		this.materials = mtl;
		this.type = type;

		this.textures = {
			defaultWhite: twgl.createTexture(gl, { src: [255, 255, 255, 255] }),
			defaultNormal: twgl.createTexture(gl, { src: [127, 127, 255, 0] }),
		};

		this.buildObject();
	}

	static buildModelFromShape(shape, type) {
		return new Model(shape.baseHref, shape.geometries, shape.mtl, type);
	}

	setBaseHRef(hRef) {
		this.baseHref = hRef;
	}

	setGeometry(geometry) {
		this.geometry = geometry;
	}

	setMaterial(mtl) {
		this.materials = mtl;
	}

	//Function to draw a model
	static drawModel(parts, model, count) {
		let u_world = Transformations.computeTransformations(model.translation, model.rotation, model.scale);
		for (const {bufferInfo, vao, materials} of parts) {
			gl.bindVertexArray(vao);
			twgl.setUniforms(meshProgramInfo, {
				u_world,
			}, materials);
			twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES, bufferInfo.numElements, 0, count);
		}
	}

	// loadTextureFromTex(filename) {
	// 	for (const material of Object.values(this.materials)) {
	// 		Object.entries(material)
	// 			.filter(([key]) => key.endsWith('Map'))
	// 			.forEach(([key, _]) => {
	// 				const textureHref = new URL(filename, this.baseHref).href;
	// 				let texture = twgl.createTexture(gl, { src: textureHref, flipY: true });
	// 				this.textures[filename] = texture;
	// 				material[key] = texture;
	// 			});
	// 	}
	// }

	loadTexture() {
		for (const material of Object.values(this.materials)) {
			Object.entries(material)
				.filter(([key]) => key.endsWith('Map'))
				.forEach(([key, filename]) => {
					let texture = this.textures[filename];
					if (!texture) {
						const textureHref = new URL(filename, this.baseHref).href;
						texture = twgl.createTexture(gl, { src: textureHref, flipY: true });
						this.textures[filename] = texture;
					}
					material[key] = texture;
				});
		}
	}

	specularMap() {
		const updatedMaterials = {};
		for (const [key, material] of Object.entries(this.materials)) {
			updatedMaterials[key] = { ...material };
			updatedMaterials[key].shininess = 25;
			updatedMaterials[key].specular = [3, 2, 1];
		}
		this.materials = updatedMaterials;
	}

	buildObject() {
		const defaultMaterial = {
			diffuse: [1, 1, 1],
			diffuseMap: this.textures.defaultWhite,
			normalMap: this.textures.defaultNormal,
			ambient: [0, 0, 0],
			specular: [1, 1, 1],
			specularMap: this.textures.defaultWhite,
			shininess: 400,
			opacity: 1,
		};

		this.loadTexture();
		this.specularMap();

		this.parts = this.geometry.map(({ material, data }) => {
			// Because data is just named arrays like this
			//
			// {
			//   position: [...],
			//   texcoord: [...],
			//   normal: [...],
			// }
			//
			// and because those names match the attributes in our vertex
			// shader we can pass it directly into `createBufferInfoFromArrays`
			// from the article "less code more fun".

			if (data.color) {
				if (data.position.length === data.color.length) {
					// it's 3. The our helper library assumes 4 so we need
					// to tell it there are only 3.
					data.color = { numComponents: 3, data: data.color };
				}
			} else {
				// there are no vertex colors so just use constant white
				data.color = { value: [1, 1, 1, 1] };
			}

			// generate tangents if we have the data to do so.
			if (data.texcoord && data.normal) {
				data.tangent = generateTangents(data.position, data.texcoord);
			} else {
				// There are no tangents
				data.tangent = { value: [1, 0, 0] };
			}

			if (!data.texcoord) {
				data.texcoord = { value: [0, 0] };
			}

			if (!data.normal) {
				// we probably want to generate normals if there are none
				data.normal = { value: [0, 0, 1] };
			}

			// create a buffer for each array by calling
			// gl.createBuffer, gl.bindBuffer, gl.bufferData
			let bufferInfo = twgl.createBufferInfoFromArrays(gl, data);
			let vao = twgl.createVAOFromBufferInfo(gl, meshProgramInfo, bufferInfo);
			return {
				materials: {
					...defaultMaterial,
					...this.materials[material],
				},
				bufferInfo,
				vao
			}
		})
	}
}
