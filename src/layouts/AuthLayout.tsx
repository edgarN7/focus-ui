import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <main className="w-full min-h-screen p-0 m-0 overflow-hidden">
            <Outlet />
        </main>
    );
}