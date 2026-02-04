import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="my-4">
      <ol className="flex list-none p-0 text-sm text-gray-600">
        <li className="flex items-center">
          <Link to="/" className="hover:text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none">
            Inicio
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return (
            <li key={to} className="flex items-center">
              <span className="mx-2">/</span>
              {last ? (
                <span className="font-bold text-black" aria-current="page">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              ) : (
                <Link to={to} className="hover:text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;