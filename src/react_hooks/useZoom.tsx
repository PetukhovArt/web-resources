import { useState, useRef, useCallback } from "react";
import { bound } from "../utils/bound/bound";

type ZoomSettings = {
   maxZoom: number;
   minZoom: number;
   step: number;
};

export type ZoomOptions = {
   zoom: number;
   translateX: number;
   translateY: number;
};

export function useZoom(settings: ZoomSettings, options?: ZoomOptions, enable = false) {
   const [scale, setScale] = useState<number>(options?.zoom || 1);

   const [translate, setTranslate] = useState<{ x: number; y: number }>({
      x: options?.translateX || 0,
      y: options?.translateY || 0,
   });

   const startPanX = useRef<number>(0);

   const startPanY = useRef<number>(0);

   const panning = useRef<boolean>(false);

   const [handlingEnable, setHandlingEnable] = useState<boolean>(enable);

   const onWheel = useCallback(
      (currentTarget: HTMLElement, deltaY: number, clientX: number, clientY: number) => {
         if (!handlingEnable) {
            return;
         }

         const currentScale = scale;
         const nextScale = Number(
            (deltaY > 0 ? currentScale - settings.step : currentScale + settings.step).toFixed(2),
         );

         if (nextScale > settings.maxZoom || nextScale < settings.minZoom) {
            return;
         }

         const parentRect = (currentTarget as HTMLElement).parentElement.getBoundingClientRect();

         // X, Y относительно родительского контейнера
         const relativeX = clientX - parentRect.x;
         const relativeY = clientY - parentRect.y;

         // X, Y на контейнере, который зумим
         const onZoomX = (relativeX - translate.x) / currentScale;
         const onZoomY = (relativeY - translate.y) / currentScale;

         // Будущие X, Y на контейнере, который зумим
         const nextOnZoomX = onZoomX * nextScale;
         const nextOnZoomY = onZoomY * nextScale;

         // Т.к. transform-origin в точке (0, 0), значения translate должны быть отрицательными,
         // для того, чтобы сдвинуть контейнер, который зумим, влево/вверх
         const nextTranslateX = relativeX - nextOnZoomX;
         const nextTranslateY = relativeY - nextOnZoomY;

         // Для того, чтобы контейнер, который зумим, визуально не выходил за пределы родительского,
         // берём разницу, между шириной/высотой родителя и будущей шириной/высотой зума
         const diffWidth = parentRect.width * nextScale - parentRect.width;
         const diffHeight = parentRect.height * nextScale - parentRect.height;

         // Т.к. значения translate отрицательные, левый предел diffWidth/diffHeight должен быть отрицательным.
         // Правый предел должен быть равен нулю, т.к. значения translate больше нуля сдвигают контейнер, который зумим, вправо
         setTranslate({
            x: bound(-diffWidth, 0, nextTranslateX),
            y: bound(-diffHeight, 0, nextTranslateY),
         });
         setScale(bound(settings.minZoom, settings.maxZoom, nextScale));
      },
      [scale, translate, handlingEnable, setTranslate, setScale],
   );

   const onMouseDown = useCallback(
      (currentTarget: HTMLElement, clientX: number, clientY: number, button: number) => {
         if (button === 1) {
            setHandlingEnable(!handlingEnable);
         }

         if (!handlingEnable) {
            return;
         }

         if (scale === settings.minZoom) {
            return;
         }

         const parentRect = currentTarget.parentElement.getBoundingClientRect();

         const relativeX = clientX - parentRect.x;
         const relativeY = clientY - parentRect.y;

         startPanX.current = relativeX - translate.x;
         startPanY.current = relativeY - translate.y;
         panning.current = true;
      },
      [handlingEnable, startPanX, startPanY, translate, panning, scale],
   );

   const onMouseUp = useCallback(() => {
      if (!handlingEnable) {
         return;
      }
      panning.current = false;
   }, [handlingEnable, panning]);

   const onMouseMove = useCallback(
      (currentTarget: HTMLElement, clientX: number, clientY: number) => {
         if (!handlingEnable) {
            return;
         }
         if (!panning.current) {
            return;
         }

         const parentRect = currentTarget.parentElement.getBoundingClientRect();

         const relativeX = clientX - parentRect.x;
         const relativeY = clientY - parentRect.y;

         const nextTranslateX = relativeX - startPanX.current;
         const nextTranslateY = relativeY - startPanY.current;

         const diffWidth = parentRect.width * scale - parentRect.width;
         const diffHeight = parentRect.height * scale - parentRect.height;

         setTranslate({
            x: bound(-diffWidth, 0, nextTranslateX),
            y: bound(-diffHeight, 0, nextTranslateY),
         });
      },
      [handlingEnable, startPanX, startPanY, setTranslate, panning, scale],
   );

   const onMouseLeave = useCallback(() => {
      if (!handlingEnable) {
         return;
      }
      panning.current = false;
   }, [handlingEnable, panning]);

   const reset = () => {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
   };

   const setEnable = (value: boolean) => {
      setHandlingEnable(value);
   };

   return {
      onWheel,
      onMouseDown,
      onMouseUp,
      onMouseMove,
      onMouseLeave,
      scale,
      translate,
      reset,
      setEnable,
      zoomEnabled: handlingEnable,
   };
}
