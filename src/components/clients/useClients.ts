
// This file re-exports all client-related hooks from the hooks directory
// to maintain backward compatibility while having a more maintainable structure

export { useClientsList as useClients } from './hooks/useClientsList';
export { useSingleClient } from './hooks/useSingleClient';
export { useClientMutations } from './hooks/useClientMutations';

// Re-export types
export type { Client, NewClientData } from './types';
