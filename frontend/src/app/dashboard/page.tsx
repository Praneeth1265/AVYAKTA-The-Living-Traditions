'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const adminHash = process.env.NEXT_PUBLIC_ADMIN_HASH || 'secret123';
    router.replace(`/avyakta-control/${adminHash}/dashboard`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
