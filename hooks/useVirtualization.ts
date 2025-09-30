import { useMemo } from 'react';

interface VirtualizationConfig {
  enabled: boolean;
  itemHeight: number;
  containerHeight: number;
  threshold?: number;
}

export const useVirtualization = <T>(
  items: T[],
  config: VirtualizationConfig
): VirtualizationConfig => {
  return useMemo(() => {
    const { threshold = 10 } = config;

    // Enable virtualization if we have many items
    const shouldVirtualize = items.length > threshold;

    return {
      ...config,
      enabled: shouldVirtualize,
    };
  }, [items.length, config.threshold, config.itemHeight, config.containerHeight]);
};
