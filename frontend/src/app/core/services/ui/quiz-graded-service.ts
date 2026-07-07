import { Injectable } from "@angular/core";
import { QuizAttemptResponse } from "../../interfaces/attempt-interface";

@Injectable({ providedIn: 'root' })
export class QuizGradedService {

    private data?: QuizAttemptResponse; 

    // Mantenemos el tipado fuerte para mayor seguridad
    setData(data: QuizAttemptResponse) { 
        this.data = data; 
    }
    
    getData(): QuizAttemptResponse | undefined { 
        return this.data; 
    }
}