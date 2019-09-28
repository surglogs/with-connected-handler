interface WithConnectedHandlerOptions {
  handler: (...connectedProps: any[]) => (...args: any[]) => any
  name: string
  actions?: { [actionName: string]: (...args: any[]) => any }
  args?: { [connectedProp: string]: string | ((state, props) => any) }
}

declare const withConnectedHandler: (options: WithConnectedHandlerOptions) => (component: any) => any

export = withConnectedHandler
