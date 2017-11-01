import React from 'react';
import atomicRendererFn from './atomicRendererFn';

export default function BlockAtomic(props) {
  const { block } = props;
  const renderer = atomicRendererFn(block);
  if (renderer && renderer.component) {
    const Comp = renderer.component;
    const props = renderer.props || {};
    return (
      <div className="MoAtomic">
        <Comp {...props} />
      </div>
    );
  }

  return null;
}
