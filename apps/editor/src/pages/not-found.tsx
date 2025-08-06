import React from 'react';
import { ButtonBase as Button } from '@mlw-packages/react-components';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center text-center px-5">
      <div className="mb-6">
        <h1 className="text-7xl font-bold m-0 text-purple-500 mb-4">404</h1>
        <h2 className="text-2xl font-medium mx-0 my-4 text-marine-blue">Página não encontrada</h2>
        <p className="text-base text-gray-500 m-0 mb-8 max-w-md">Desculpe, a página que você visitou não existe.</p>
      </div>
      <Link to="/">
        <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white">
          Voltar ao Início
        </Button>
      </Link>
    </div>
  );
};
