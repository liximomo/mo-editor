import React from 'react';

const TYPE = 'BREAK';

function BlockBreak() {
  return <hr />;
}

function dataCreator() {
  return {};
}

export default {
  type: TYPE,
  renderer: {
    component: BlockBreak,
  },
  dataCreator,
  // inject later
  createBlock: null,
};
