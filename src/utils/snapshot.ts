function saveFrame(canvas: any) {
   const dataURL = canvas.toDataURL("image/jpeg", 1.0);
   const a = document.createElement("a");
   a.href = dataURL;
   a.download = `${Date.now()}.jpg`;
   document.body.appendChild(a);
   a.click();
   a.remove();
}

function capture(video: any, scaleFactor: number) {
   if (scaleFactor === null) {
      scaleFactor = 1;
   }
   const w = video.videoWidth * scaleFactor;
   const h = video.videoHeight * scaleFactor;
   const canvas = document.createElement("canvas");
   canvas.width = w;
   canvas.height = h;
   const ctx = canvas.getContext("2d");
   ctx.drawImage(video, 0, 0, w, h);
   return canvas;
}

function createSnapshot(videoId: string) {
   let result = false;
   const scaleFactor = 1;
   const video = document.getElementById(videoId);
   // const output = document.getElementById('output');
   const canvas = capture(video, scaleFactor);
   if (canvas.width === 0) {
      // eslint-disable-next-line no-alert
      alert("Нет изображения");
   } else {
      saveFrame(canvas);
      result = true;
   }
   canvas.remove();
   return result;
}

export { saveFrame, capture, createSnapshot };
