import type { HttpError } from "@/types";
import type { ReactElement } from "react";

type ApiSuspenseProps = {
   loading: boolean;
   hasData: boolean;
   error?: any;
   loadingView: () => ReactElement;
   resultView: () => ReactElement;
   errorView?: (error: HttpError) => ReactElement;
};

const DefaultErrorMessage = ({ error }) => (
   <div style={{ width: "100%", textAlign: "center" }}>
      <h3>Произошла ошибка</h3> <br />
      <span>{error}</span>
   </div>
);

const ApiSuspense = ({
   loading,
   error = null,
   hasData,
   loadingView,
   resultView,
   errorView,
}: ApiSuspenseProps) => {
   const renderView = () => {
      if (error) {
         return errorView ? errorView(error) : <DefaultErrorMessage error={error.message} />;
      }
      if (hasData) {
         return resultView();
      }
      if (loading) {
         return loadingView();
      }
      return <div></div>;
   };

   return renderView();
};

export default ApiSuspense;


// <ApiSuspense
//   loading={protocolsLoading || sslStatusLoading || isFetching}
//   hasData={dataSuccess && sslSuccess && !isFetching && !!data?.httpsCfg}
//   resultView={CardContent}
//   loadingView={() => (
//     <SkeletonFiller
//       relations={[["100%"], ["100%"], ["100%"], ["100%"], ["100%"]]}
//       itemHeight={30}
//       itemMargin={15}
//       animation={"wave"}
//     />
//   )}
// />
