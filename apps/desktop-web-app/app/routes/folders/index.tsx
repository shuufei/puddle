import { useCatch } from '@remix-run/react';
import type { CatchBoundaryComponent } from '@remix-run/react/dist/routeModules';
import type { FC } from 'react';

const FoldersPage: FC = () => {
  return (
    <div className="flex justify-center px-4 p-8 w-full">
      <p className="text-gray-500">フォルダが選択されていません</p>
    </div>
  );
};

export default FoldersPage;

// 仮実装
export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  return (
    <div>
      <h1>Loader Error</h1>
      <p>{caught.status}</p>
    </div>
  );
};
