class PackBits {
   toHex(s: string) {
      return Array.from(s, c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
   }

   pack(s) {
      return s
         .match(/(.)\1{1,127}|(?:(.)(?!\2)){1,128}/gs)
         .map(s =>
            s[0] === s[1]
               ? String.fromCharCode(257 - s.length) + s[0]
               : String.fromCharCode(s.length - 1) + s,
         )
         .join("");
   }

   unpack(s) {
      let res = "";
      let i = 0;
      while (i < s.length) {
         const hdr = s.charCodeAt(i++);
         // eslint-disable-next-line no-nested-ternary
         res += hdr > 128 ? s[i++].repeat(257 - hdr) : hdr < 128 ? s.slice(i, (i += hdr + 1)) : "";
      }
      return res;
   }

   unpackFromBase64(base64: string) {
      const decodedBase64 = atob(base64);
      return this.unpack(decodedBase64);
   }

   toBinary(data: string) {
      const arr = this.toHex(data).split(" ");
      const intArr = arr.map(ia => parseInt(ia, 16));
      const binaryArr = intArr.map(ba => ba.toString(2).padStart(8, "0"));
      const result = binaryArr.flat().join("");
      return result;
   }

   splitByByte(arr: number[]) {
      const byte = 8;
      const arrLength = arr.length / byte;

      const result = new Array(arrLength);
      for (let i = 0; i < arrLength; i++) {
         result[i] = new Array(byte);
         for (let j = 0; j < byte; j++) {
            result[i][j] = +arr[i * byte + j] || 0;
         }
      }
      return result;
   }

   toByteString(arr: number[]) {
      const splittedArr = this.splitByByte(arr);
      const intArr = splittedArr.map(a => parseInt(a.join(""), 2));
      const str = String.fromCharCode(...intArr);
      return str;
   }
}

export default new PackBits();
