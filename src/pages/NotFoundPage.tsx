import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="text-center mt-16">
      <h1 className="text-4xl font-extrabold text-rose-600">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-2">Page Not Found</h2>
      <Link to="/" className="mt-4 inline-block text-emerald-600 font-semibold hover:underline">
        Go Back Home
      </Link>
    </div>
  );
};
//Link> component intercepts the user's click. It tells React Router to instantly swap out the component on the screen