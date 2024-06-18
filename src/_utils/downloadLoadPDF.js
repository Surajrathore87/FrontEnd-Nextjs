export function downLoadPdf(pdfFile, name) {
  return new Promise((resolve, reject) => {
    fetch(pdfFile).then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = name;
        alink.click();
        resolve("Downloaded");
      });
    });
  })
}