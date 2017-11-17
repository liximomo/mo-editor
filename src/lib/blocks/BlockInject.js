import BlockHub from './BlockHub';
import BlockImagePlugin from './plugins/BlockImagePlugin';
import AtomicBlockBreakPlugin from './plugins/AtomicBlockBreakPlugin';

BlockHub.injectBlockPlugin(BlockImagePlugin);
BlockHub.injectAtomicBlockPlugin(AtomicBlockBreakPlugin);
