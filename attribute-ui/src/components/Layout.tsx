import React, { ReactNode } from 'react';
import PoweredBy from './PoweredBy';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="id-contact">
            <div className="content">
                {children}
            </div>
            <PoweredBy />
        </div>
    );
}
