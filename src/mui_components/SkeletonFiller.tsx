import { Box, Skeleton } from "@mui/material";
import { memo, type NamedExoticComponent } from "react";
import CardWrapper from "./card/CardWrapper";

type JustifyContent =
   | "flex-start"
   | "flex-end"
   | "center"
   | "space-between"
   | "space-around"
   | "space-evenly"
   | "stretch"
   | "initial"
   | "inherit";

type SkeletonFillerProps = {
   variant?: "text" | "circular" | "rectangular" | "rounded";
   itemHeight: number;
   itemMargin: number;
   relations: string[][]; // [ ["80%", "20%"], ["10%"], ["30%", "20%"] ]
   pl?: number;
   pt?: number;
   jc?: JustifyContent;
   mrFirstColumn?: number;
   animation?: "wave" | "pulse";
   cardWrapWidth?: number; // pass if you use tabComponent for resultView in ApiSuspense
};

export const SkeletonFiller: NamedExoticComponent<SkeletonFillerProps> = memo(
   ({
      relations,
      itemHeight,
      itemMargin,
      pt,
      pl,
      jc = "space-between",
      mrFirstColumn = 0,
      variant = "rounded",
      animation = "pulse",
      cardWrapWidth,
   }) => {
      const content = (
         <Box
            width={"100%"}
            data-test-id={"skeleton-filler"}
            padding={theme => theme.spacing(2)}
            paddingLeft={`${pl}px`}
            paddingTop={`${pt}px`}>
            {relations.map((relation, index) => (
               <Box key={index} display={"flex"} justifyContent={jc}>
                  {relation.map((percent, index) => (
                     <Skeleton
                        variant={variant}
                        width={percent}
                        key={index}
                        height={`${itemHeight}px`}
                        sx={{
                           marginBottom: `${itemMargin}px`,
                           marginRight: `${mrFirstColumn}px`,
                        }}
                        animation={animation}
                     />
                  ))}
               </Box>
            ))}
         </Box>
      );
      return cardWrapWidth ? <CardWrapper width={cardWrapWidth}>{content}</CardWrapper> : content;
   },
);
