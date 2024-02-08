import "./Spinner.scss";

const Spinner = () => (
   <div className="lds">
      <div className="lds-ellipsis">
         <div></div>
         <div></div>
         <div></div>
         <div></div>
      </div>
   </div>
);

export default Spinner;
