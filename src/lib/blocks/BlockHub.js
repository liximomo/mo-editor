import AtomicBlockPlugin, { injectAtomicBlockPlugin } from './plugins/AtomicBlockPlugin';
import { ATOMIC } from './TypeOfBlock';

const BlockPlugins = {
  [AtomicBlockPlugin.type]: AtomicBlockPlugin,
};

const defaultPluginProps = {
  editable: true,
};

function injectBlockPlugin(plugin) {
  if (plugin.type === ATOMIC) {
    new Error(`不能覆盖内部 rendererFn: ${ATOMIC}`);
  }

  BlockPlugins[plugin.type] = {
    ...defaultPluginProps,
    ...plugin,
  };
}

function getBlockRendererFn() {
  return contentBlock => {
    const type = contentBlock.getType();
    const plugin = BlockPlugins[type];

    if (plugin) {
      return plugin.renderer;
    }

    return null;
  };
}

const BlockHub = {
  injectBlockPlugin,
  injectAtomicBlockPlugin,
  getBlockRendererFn,
};

export default BlockHub;
