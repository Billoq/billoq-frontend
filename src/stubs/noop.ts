// Noop stub for packages that are not needed
const noopModule = {};
export default noopModule;

// Basic exports for @reown/appkit-wallet compatibility
export const W3mFrameStorage = {
  get: () => null,
  set: () => {},
  delete: () => {},
};

export const W3mFrameConstants = {
  SMART_ACCOUNT_ENABLED_NETWORKS: 'SMART_ACCOUNT_ENABLED_NETWORKS',
};