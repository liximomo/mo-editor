import { CompositeDecorator } from 'draft-js';
import LinkDecorator from './cells/LinkDecorator';

export default new CompositeDecorator([
  LinkDecorator,
]);
