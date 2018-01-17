import AtomicBlockPlugin, { injectAtomicBlockPlugin } from './plugins/AtomicBlockPlugin';
import { ATOMIC } from './TypeOfBlock';
import createEntityCreator from '../entities/createEntityCreator';

const BlockPlugins = {
  [AtomicBlockPlugin.type]: AtomicBlockPlugin,
};

const defaultPluginProps = {
  entityDataCreator: a => a,
};

function injectBlockPlugin(plugin) {
  if (plugin.type === ATOMIC) {
    new Error(`不能覆盖内部类型: ${ATOMIC}`);
  }

  const withDefault = {
    ...defaultPluginProps,
    ...plugin,
  };

  setupPlugin(withDefault);
  BlockPlugins[withDefault.type] = withDefault;
}

function getBlockRendererFn(setEditorState, getEditorState) {
  return contentBlock => {
    const type = contentBlock.getType();
    const plugin = BlockPlugins[type];
    if (plugin) {
      const props = plugin.props || {};
      
      return {
        ...plugin.renderer,
        props: {
          ...props,
          setEditorState,
          getEditorState,
        }
      };
    }

    return null;
  };
}

function getBlock(type) {
  return BlockPlugins[type];
}

function getAtomicBlock(type) {
  return AtomicBlockPlugin.getPlugin(type);
}

function withCreateEntity(plugin) {
  const { type, entityDataCreator } = plugin;
  const entityCreator = createEntityCreator({
    type: type,
    mutatble: 'IMMUTABLE',
  });

  plugin.createEntity = (editorState, ...rest) =>
    entityCreator(editorState, entityDataCreator(...rest));
}

const BlockHub = {
  injectBlockPlugin,
  injectAtomicBlockPlugin,
  getBlockRendererFn,
  getBlock,
  getAtomicBlock,
};

export default BlockHub;

export function setupPlugin(plugin) {
  withCreateEntity(plugin);
}
