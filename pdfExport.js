const pdfjsLib = require("pdfjs-dist");

async function getTextFromPDF(path) {
  const doc = await pdfjsLib.getDocument(path).promise;
  const numPages = doc.numPages;
  let textContent = '';

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    textContent += strings.join(' ');
  }

  return textContent;
}

module.exports = { getTextFromPDF };
