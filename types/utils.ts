// Utility types for better type safety
import React from 'react';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type NonEmptyArray<T> = [T, ...T[]];

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
  [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
}[Keys];

// Validation types
export type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  errors: string[];
};

// API Response types
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type ApiError = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};

// Component prop types
export type ComponentWithChildren<P = {}> = P & {
  children?: React.ReactNode;
};

export type ComponentWithClassName<P = {}> = P & {
  className?: string;
};

// Form types
export type FieldError = {
  field: string;
  message: string;
};

export type FormState<T> = {
  data: T;
  errors: FieldError[];
  isSubmitting: boolean;
  isDirty: boolean;
};

// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto';

export type ColorScheme = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
};

// Animation types
export type AnimationType = 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'bounce' | 'pulse';

export type AnimationConfig = {
  type: AnimationType;
  duration?: number;
  delay?: number;
  easing?: string;
};

// Layout types
export type LayoutMode = 'scroll' | 'tab' | 'slide' | 'grid';

export type ViewMode = 'simple' | 'enhanced' | 'minimal';

// Storage types
export type StorageType = 'localStorage' | 'sessionStorage' | 'memory';

export type StorageConfig = {
  type: StorageType;
  key: string;
  serialize?: (data: unknown) => string;
  deserialize?: (data: string) => unknown;
};

// Export utility type helpers
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithId<T> = T & { id: string };

export type WithoutId<T> = Omit<T, 'id'>;
