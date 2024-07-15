import NavigationSidebar from '@/components/navigation/navigation-sidebar';
import { FC, ReactNode } from 'react';

interface authLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<authLayoutProps> = ({ children }) => {
    return (
        <div className="h-full">
            <main className="md:pl-[72px] h-full">{children}</main>
        </div>
    );
};

export default AuthLayout;