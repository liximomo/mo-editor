import { SERVICE_IMAGE_UPLOAD } from './TypeOfServie';

const serviceHandleMap = {};

function registerImageUploadService(handle) {
  serviceHandleMap[SERVICE_IMAGE_UPLOAD] = handle;
}

function registerService(name, handle) {
  serviceHandleMap[name] = handle;
}

const serviceHub = {
  registerService,

  registerImageUploadService,

  uploadImage(file) {
    const handle = serviceHandleMap[SERVICE_IMAGE_UPLOAD];
    return handle(file);
  },
};

export default serviceHub;
