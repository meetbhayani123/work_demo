import VerifyForm from "@/components/forgot-password/VerifyForm";
import { Suspense } from 'react';

export default function VerifyPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <Suspense>
                <VerifyForm />
            </Suspense>
        </main>
    );
}
