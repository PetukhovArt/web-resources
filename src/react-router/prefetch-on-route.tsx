import { createHashRouter, redirect } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

export const router = createHashRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary fallbackRender={({ error }) => <></>}>
        <Suspense
          fallback={
            <div className={"flex h-full w-full items-center justify-center"}>
              {/* some spinner*/}
            </div>
          }
        >
          <App />
        </Suspense>
      </ErrorBoundary>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, loader: () => redirect("") },
      {
        path: "",
        element: <></>,
        // todo: this feature
        loader: async () => {
          await queryClient.prefetchQuery(getGetObjectsTreeQueryOptions());
          return null;
        },
        // errorElement: <RouteError />
      },
      {
        path: RoutePath.notFound,
        element: <NotFound />,
      },
    ],
  },
]);
