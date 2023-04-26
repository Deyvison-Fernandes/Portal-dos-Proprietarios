import { jsPDF } from 'jspdf';

export function downloadFile(filename, range, apto) {
  const doc = new jsPDF();

  const y = range.slice(0, 4);
  let m = range.slice(5, 7);

  const elementHTML = document.createElement('div');
  const title = document.createElement('h4');
  const table = document.getElementById('statement');
  title.style = 'display: flex; width: 100%; font-size: 24px; ';
  title.textContent = 'Extrato detalhado';
  const range_tag = document.createElement('h5');
  const apto_tag = document.createElement('h5');
  range_tag.textContent = `Período: ${`${m}/${y}`}`;
  apto_tag.textContent = `Apto: ${apto}`;
  elementHTML.append(title);
  elementHTML.append(range_tag);
  elementHTML.append(apto_tag);
  elementHTML.append(table);

  doc.html(elementHTML, {
    callback: function (doc) {
      doc.save(filename);
      return true
    },
    x: 15,
    y: 15,
    width: 250,
    windowWidth: 1250
  });
}
