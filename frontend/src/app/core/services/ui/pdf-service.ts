import { Injectable } from "@angular/core";

import * as pdfjsLib from 'pdfjs-dist';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;


@Injectable({
    providedIn: 'root'
})


export class PdfService {

    async extractText(file: File): Promise<string> {
        const arrayBuffer = await file.arrayBuffer();

        const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');

            fullText += `Página ${i}\n${pageText}\n\n`;
        }

        return fullText;
    }
}

