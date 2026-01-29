'use client';

import { ReactNode } from 'react';
import { useAbility } from '../hooks/use-ability';
import { Action, Subject } from './define-ability';

interface CanProps {
  I: Action;
  a: Subject;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ I, a, children, fallback = null }: CanProps) {
  const { ability, loading } = useAbility();
  
  if (loading) {
    return null;
  }
  
  if (!ability || !ability.can(I, a)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
