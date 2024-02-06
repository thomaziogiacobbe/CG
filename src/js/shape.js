class Shape {
  constructor() {
    this.gl = gl;
    //definitions of the possible forms to be generated
    this.cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(
      this.gl, 
      16
    );

    //array with all object buffer information
    this.shapesArray = [
      this.cubeBufferInfo
    ];
  }
  
  //function to select a shape
  getShape() {
    return this.shapesArray[0];
  }
}