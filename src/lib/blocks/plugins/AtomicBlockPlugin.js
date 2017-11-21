import React from 'react';
import { ATOMIC } from '../TypeOfBlock';
import { setupPlugin } from '../BlockHub';

const AtomicBlockPlugins = {};

const defaultPluginProps = {
  entityDataCreator: a => a,
};

function atomicRendererFn(type) {
  const plugin = AtomicBlockPlugins[type];

  if (plugin) {
    return plugin.renderer;
  }
}

export function injectAtomicBlockPlugin(plugin) {
  const withDefault = Object.assign({}, defaultPluginProps, plugin);
  setupPlugin(withDefault);
  AtomicBlockPlugins[withDefault.type] = withDefault;
}

function BlockAtomic(props) {
  const { block, contentState } = props;

  const entityKey = block.getEntityAt(0);
  if (!entityKey) {
    return null;
  }

  const entity = contentState.getEntity(entityKey);
  const data = entity.getData();
  const type = entity.getType();
  const renderer = atomicRendererFn(type);
  if (renderer && renderer.component) {
    const Comp = renderer.component;
    const props = renderer.props || {};
    return (
      <div className="MoAtomic">
        <Comp {...props} data={data} />
      </div>
    );
  }

  return null;
}

export default {
  type: ATOMIC,
  renderer: {
    component: BlockAtomic,
    editable: false,
  },
  getPlugin(type) {
    return AtomicBlockPlugins[type];
  },
};
