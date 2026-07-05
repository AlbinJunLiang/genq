import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    constructor() {
        (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
            new URL(
                'pdfjs-dist/build/pdf.worker.min.mjs',
                import.meta.url
            ).toString();
    }

    async extractText(file: File): Promise<string> {
        const arrayBuffer = await file.arrayBuffer();

        const pdf = await (pdfjsLib as any)
            .getDocument({ data: arrayBuffer })
            .promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');

            fullText += `${i}-${pageText}\n`;
        }

        return fullText;
    }
}