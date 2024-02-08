import _ from "underscore";

export class ColorConverter {
   static convertToHex = _.memoize((uint: number): string => {
      if (!uint) {
         return "";
      }
      const hex = uint.toString(16);
      return `#${hex.slice(-6)}${hex.slice(0, 2)}`;
   });

   static convertToUint = _.memoize((hex: string): number => {
      const alpha = hex.length === 7 ? "ff" : hex.slice(-2);
      const resultHex = alpha + hex.slice(1, 7);
      return parseInt(`0x${resultHex}`);
   });
}
