import React from 'react';
import { ATOMIC } from '../TypeOfBlock';
import { createBlock } from '../../operation/Block';

const AtomicBlockPlugins = {};

const defaultPluginProps = {
  editable: true,
};

function atomicRendererFn(type) {
  const plugin = AtomicBlockPlugins[type];

  if (plugin) {
    return plugin.renderer;
  }
}

function createBlockCreator(type, dataCreator) {
  return (...args) => {
    const withTypeData = {
      ...dataCreator(...args),
      $$AtomicType: type,
    };

    return createBlock({ type: ATOMIC, data: withTypeData });
  };
}

export function injectAtomicBlockPlugin(plugin) {
  plugin.createBlock = createBlockCreator(plugin.type, plugin.dataCreator);
  AtomicBlockPlugins[plugin.type] = {
    ...defaultPluginProps,
    ...plugin,
  };
}

function BlockAtomic(props) {
  const { block } = props;
  const data = block.getData();
  const type = data.get('$$AtomicType');
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
