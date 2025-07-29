import { Document, Packer, Paragraph, TextRun } from 'docx';

function downloadOnboardingDoc({ title, info, welcomeMessage }) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: title, bold: true, size: 36, color: "2E74B5" }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: welcomeMessage,
                italics: true,
                size: 28,
                color: "444444",
              }),
            ],
            spacing: { after: 400 },
          }),
          ...info.map(line =>
            new Paragraph({
              children: [new TextRun({ text: line, size: 24 })],
              spacing: { after: 200 },
            })
          ),
          new Paragraph({
            children: [
              new TextRun({
                text: "Please keep this document safe. If you have any questions, contact your school administrator.",
                size: 22,
                color: "888888",
              }),
            ],
            spacing: { before: 400 },
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_onboarding.docx`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

export default downloadOnboardingDoc;