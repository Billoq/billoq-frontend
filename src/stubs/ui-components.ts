// Stub for @reown/appkit-ui components
const uiComponents = {};
export default uiComponents;

// Mock customElement decorator
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customElement = () => (target: any) => target;

// Mock UI component base class
export class WuiElement extends HTMLElement {
  constructor() {
    super();
  }
}