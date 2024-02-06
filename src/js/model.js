class Model {
  constructor() {
    this.gl = gl;
    this.meshProgramInfo = meshProgramInfo;
    this.bufferInfo = shapes.getShape();
    this.setVao(this.gl, this.meshProgramInfo);
    this.setUniforms();

    this.translation = {
      x: 0,
      y: 0,
      z: 0
    };

    this.rotation = {
      x: degToRad(0),
      y: degToRad(0),
      z: degToRad(0),
      r: degToRad(0)
    };

    this.scale = {
      x: 1,
      y: 1,
      z: 1,
      factor: 1,
    };
    
    this.target = -1
  }

  //function to set a vertex array object and attributes
  setVao() {
    this.vao = twgl.createVAOFromBufferInfo(
      this.gl,
      meshProgramInfo,
      this.bufferInfo
    );
  }

  //function to set the collors attributes of model
  setUniforms() {
    //placeholder colors for testing
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();

    this.uniforms = {
      u_colorMult: [r, g, b, 1],
      u_matrix: m4.identity,
    };
  }

  //Function to draw a model
  drawModel(viewProjectionMatrix) {
    this.gl.bindVertexArray(this.vao);
    this.computeMatrix(viewProjectionMatrix);
    twgl.setUniforms(this.meshProgramInfo, this.uniforms);
    twgl.drawBufferInfo(this.gl, this.bufferInfo);
  }

  //Compute model matrix
  computeMatrix(viewProjectionMatrix) {

    //Scale the model keep aspect
    const scaleVectorProportional = [
      this.scale.factor,
      this.scale.factor,
      this.scale.factor,
    ];

    //Scale the model
    const scaleVector = [
      this.scale.x,
      this.scale.y,
      this.scale.z,
    ];

    //Translate the model
    let matrix = m4.translate(
      viewProjectionMatrix,
      this.translation.x,
      this.translation.y,
      this.translation.z
    );

    //Rotate the model
    matrix = m4.axisRotate(matrix, [1, 0, 0], this.rotation.x);
    matrix = m4.axisRotate(matrix, [0, 1, 0], this.rotation.y);
    matrix = m4.axisRotate(matrix, [0, 0, 1], this.rotation.z);

    //Scale the model
    matrix = twgl.m4.scale(matrix, scaleVectorProportional);
    matrix = twgl.m4.scale(matrix, scaleVector);

    this.uniforms.u_matrix = matrix;
  }
}
