//Models Properties
const manageModel1 = {
  addModel: () => { addMod(); },
  deleteModel: () => { }
};

const manageModel2 = {
  addModel: () => { addMod(); },
  deleteModel: () => { }
};

const manageModel3 = {
  addModel: () => { addMod(); },
  deleteModel: () => { }
};

const manageModel4 = {
  addModel: () => { addMod(); },
  deleteModel: () => { }
};

//Cameras Properties
const cam = {
  zoom: 0,
  chooseCamera: 'Center Camera'
};

//Load Gui
const loadGUI = () => {
  let gui = new dat.GUI();

  // addModel button
  gui
    .add(manageModel1, 'addModel')
    .onChange(() => {
      setTimeout(addNewController, 50, gui, 'Bidet');
    })
    .name('Bidet');

  gui
    .add(manageModel2, 'addModel')
    .onChange(() => {
      setTimeout(addNewController, 50, gui, 'HandWasher');
    })
    .name('HandWasher');

  gui
    .add(manageModel3, 'addModel')
    .onChange(() => {
      setTimeout(addNewController, 50, gui, 'Shower');
    })
    .name('Shower');

  gui
    .add(manageModel4, 'addModel')
    .onChange(() => {
      setTimeout(addNewController, 50, gui, 'Toilet');
    })
    .name('Toilet');

  // camera controllers
  gui = configureCameraGui(gui);
};

//Camera controllers configs
function configureCameraGui(gui) {
  const cameraFolder = gui.addFolder('Camera');

  // choose camera
  cameraFolder
    .add(cam, 'chooseCamera')
    .options(['Right Camera', 'Center Camera', 'Left Camera'])
    .onChange(() => {
      changeCamera(cam.chooseCamera);
      updateCameraControllers();
    })
    .name('Change Camera');

  //Camera operations folders
  const cameraTranslateFolder = cameraFolder.addFolder('Translation');
  const cameraRotationFolder = cameraFolder.addFolder('Rotation');

  //Camera control options
  var cameraControls = [];
  addCameraControls();

  function updateCameraControllers() {
    cameraControls.forEach((control) => {
      control.remove();
    });
    cameraControls = [];
    addCameraControls();
  }

  //function to add camera controls
  function addCameraControls() {
    //Zoom
    cameraControls.push(
      cameraFolder.add(cam, 'zoom', 0, 59, 1).onChange(() => {
        cameraZoom(cam.zoom);
      })
    );

    //Translation
    cameraControls.push(
      cameraTranslateFolder.add(camera.position, 'x', -360, 360, 1)
    );
    cameraControls.push(
      cameraTranslateFolder.add(camera.position, 'y', -360, 360, 1)
    );
    cameraControls.push(
      cameraTranslateFolder.add(camera.position, 'z', -360, 360, 5)
    );

    //Rotation
    cameraControls.push(
      cameraRotationFolder.add(camera.rotation, 'x', -20, 20, 0.1)
    );
    cameraControls.push(
      cameraRotationFolder.add(camera.rotation, 'y', -20, 20, 0.1)
    );
    cameraControls.push(
      cameraRotationFolder.add(camera.rotation, 'z', -20, 20, 0.1)
    );
  }

  return gui;
}

//Models Controllers Configs
function addNewController(gui, m) {
  const index = models.length - 1;
  let model = models[index];
  var modelCountIndex = 0;
  var choosenModel = null;

  switch (m) {
    case 'Bidet':
      modelCountIndex = 0;
      choosenModel = manageModel1;
      break;

    case 'HandWasher':
      modelCountIndex = 1;
      choosenModel = manageModel2;
      break;

    case 'Toilet':
      modelCountIndex = 2;
      choosenModel = manageModel3;
      break;

    case 'Shower':
      modelCountIndex = 3
      choosenModel = manageModel4;
      break;

    default:
      break;
  }

  modelCount[modelCountIndex] = modelCount[modelCountIndex] + 1;

  const modelFolder = gui.addFolder(m + modelCount[modelCountIndex]);

  //Delete model
  modelFolder
    .add(choosenModel, 'deleteModel')
    .onChange(() => {
      gui.removeFolder(modelFolder);
      removeMod(index);
    })
    .name('Delete Model');

  //Models folders
  const modelTranslateFolder = modelFolder.addFolder('Translation');
  const modelRotationFolder = modelFolder.addFolder('Rotation');
  const modelScaleFolder = modelFolder.addFolder('Scale');

  //Translation
  modelTranslateFolder.add(model.translation, 'x', -200, 200, 5);
  modelTranslateFolder.add(model.translation, 'y', -200, 200, 5);
  modelTranslateFolder.add(model.translation, 'z', -200, 200, 5);

  //Rotation
  modelRotationFolder.add(model.rotation, 'x', -20, 20, 0.5);
  modelRotationFolder.add(model.rotation, 'y', -20, 20, 0.5);
  modelRotationFolder.add(model.rotation, 'z', -20, 20, 0.5);

  //Scale
  modelScaleFolder.add(model.scale, 'x', 0, 10, 0.1);
  modelScaleFolder.add(model.scale, 'y', 0, 10, 0.1);
  modelScaleFolder.add(model.scale, 'z', 0, 10, 0.1);
  modelScaleFolder.add(model.scale, 'factor', 0, 10, 0.01).name('Keep aspect ratio');
}
