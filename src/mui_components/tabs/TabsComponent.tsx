import CardWrapper from "@/components/card/CardWrapper";
import { useTo } from "@/hooks/useTo";
import AppService from "@/service/AppService";
import type { FeatureKeyType } from "@/types";
import { Box, Tab, Tabs } from "@mui/material";
import { type SyntheticEvent, useEffect, useState } from "react";

import { Outlet } from "react-router";
import s from "./tabs.module.scss";

export type TabItem = {
   tabName: string;
   path: string;
   key?: FeatureKeyType;
};

type TabsContentPropsType = {
   items: TabItem[];
   cardWidth?: number;
};

export const TabsComponent = ({ items, cardWidth }: TabsContentPropsType) => {
   const { to, pathname } = useTo();
   const [value, setValue] = useState(items[0].path);
   const handleChange = (event: SyntheticEvent, newValue: string) => {
      to(newValue);
      setValue(newValue);
   };
   useEffect(() => {
      const item = items.find(item => item.path === pathname);
      if (item) {
         setValue(item.path);
      }
   }, [pathname]);

   return (
      <div className={s.wrapper}>
         <Box className={s.tabsBox}>
            <Tabs
               value={value}
               onChange={handleChange}
               className={s.root}
               variant={"scrollable"}
               scrollButtons="auto"
               allowScrollButtonsMobile>
               {items?.map(item =>
                  item.key && !AppService.features[item.key] ? null : (
                     <Tab key={item.path} label={item.tabName} value={item.path} className={s.item} />
                  ),
               )}
               {/* if key is in item , check if exist in features , if not - don't show */}
            </Tabs>
         </Box>
         <Box className={s.pageBox}>
            <CardWrapper width={cardWidth}>
               <Outlet />
            </CardWrapper>
         </Box>
      </div>
   );
};
