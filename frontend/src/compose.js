export const provider = (provider, props = {}) => [provider, props];

//allows multiple context sources for state management
//refer to context file AssayContext, AuthContext, BatchContext, ReagentContext
export const ProviderComposer = ({providers, children}) => {
    for (let i = providers.length - 1; i >= 0; --i) {
        const [Provider, props] = providers[i];
        children = <Provider {...props}>{children}</Provider>
    }
    return children;
}