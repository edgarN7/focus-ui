// src/utils/noop.js

// ----------------------------------------------------------------------
// MOCK DO REACT FAST REFRESH
// ----------------------------------------------------------------------
// Este arquivo existe para satisfazer as importações do Vite/Pigment CSS
// e evitar que a aplicação quebre no Windows devido a conflitos de plugin.

export const createSignatureFunctionForTransform = () => () => { };
export const register = () => { };
export const injectIntoGlobalHook = () => { };
export const performReactRefresh = () => { };
export const isLikelyComponentType = () => false;
export const hasUnrecoverableErrors = () => false;

// Função necessária para importações dinâmicas do Vite
export const __hmr_import = () => Promise.resolve({});

export const registerExportsForReactRefresh = () => { };

export default {
    createSignatureFunctionForTransform,
    register,
    injectIntoGlobalHook,
    performReactRefresh,
    isLikelyComponentType,
    hasUnrecoverableErrors,
    __hmr_import,
    registerExportsForReactRefresh,
};