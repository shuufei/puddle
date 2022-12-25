import type { FC } from 'react';

const ServiceSuspendedPage: FC = () => {
  return (
    <main className="flex justify-center p-8">
      <p className="text-lg font-semibold text-gray-900">
        Service is currently suspended
      </p>
    </main>
  );
};

export default ServiceSuspendedPage;
