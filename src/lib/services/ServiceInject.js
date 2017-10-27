import * as ServiceType from './TypeOfServie';
import ServiceUploadImage from './ServiceUploadImage';
import ServiceHub from './ServiceHub';

ServiceHub.registerService(ServiceType.SERVICE_IMAGE_UPLOAD, ServiceUploadImage);
