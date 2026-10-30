import type { ReactNode } from 'react';
import { Container } from '../components/Container/Container.tsx';
import { Logo } from '../components/Logo/Logo.tsx';

interface PageFrameProps {
  readonly children: ReactNode;
}

// A block as an app shows it: under a header with the logo, in the reading column.
export function PageFrame({ children }: PageFrameProps) {
  return (
    <div className="-m-space-5 flex flex-col">
      <header className="border-b-hair border-line px-space-4 py-space-4 md:px-space-6">
        <Logo />
      </header>
      <Container render={<main />} className="py-space-7 md:py-space-8">
        {children}
      </Container>
    </div>
  );
}
