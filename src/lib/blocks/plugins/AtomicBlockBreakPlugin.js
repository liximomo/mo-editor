import React from 'react';

const TYPE = 'BREAK';

function BlockBreak() {
  return <hr />;
}

export default {
  type: TYPE,
  renderer: {
    component: BlockBreak,
  },
};
