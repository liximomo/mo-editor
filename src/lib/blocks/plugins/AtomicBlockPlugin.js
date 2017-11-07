import React from 'react';
import { ATOMIC } from '../TypeOfBlock';
import createEntityCreator from '../../entities/createEntityCreator';

const AtomicBlockPlugins = {};

const defaultPluginProps = {
  editable: true,
  dataCreator: a => a,
};

function atomicRendererFn(type) {
  const plugin = AtomicBlockPlugins[type];

  if (plugin) {
    return plugin.renderer;
  }
}

function injectCreateEntity(plugin) {
  const { type, dataCreator } = plugin;
  const entityCreator = createEntityCreator({
    type: type,
    mutatble: 'IMMUTABLE',
  });

  plugin.createEntity = (editorState, ...rest) => entityCreator(editorState, dataCreator(...rest));
}

export function injectAtomicBlockPlugin(plugin) {
  Object.assign(plugin, defaultPluginProps, plugin);
  injectCreateEntity(plugin);
  AtomicBlockPlugins[plugin.type] = plugin;
}

function BlockAtomic(props) {
  const { block, contentState } = props;

  const entity = contentState.getEntity(block.getEntityAt(0));
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
};
