import { useLocation, useNavigate } from "react-router";

export function useTo() {
   const navigate = useNavigate();
   const location = useLocation();

   const to = (path: string) => {
      const currentPath = location.pathname;
      if (currentPath === path) return;
      navigate(path);
   };

   const isActive = (val: string) => location.pathname.includes(val);

   return { to, isActive, pathname: location.pathname };
}
