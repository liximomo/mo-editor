const sniffTransition = (el) => {
  let ret = {};
  const trans = ['webkitTransition', 'mozTransition', 'oTransition', 'transition'];
  const tform = ['webkitTransform', 'mozTransform', 'msTransform', 'oTransform', 'transform'];
  const end = {
    webkitTransition: 'webkitTransitionEnd',
    mozTransition: 'transitionend',
    oTransition: 'oTransitionEnd',
    transition: 'transitionend',
  };

  trans.some((prop) => {
    if (el.style[prop] !== undefined) {
      ret.transitionProp = prop;
      ret.transEndEvent = end[prop];
      return true;
    }

    return false;
  });

  tform.some((prop) => {
    if (el.style[prop] !== undefined) {
      ret.transformProp = prop;
      ret.transformCssProp = prop.replace(/(.*)Transform/, '-$1-transform');
      return true;
    }

    return false;
  });

  return ret;
};

const el = document.createElement('div');

export const styleTrans = sniffTransition(el);
