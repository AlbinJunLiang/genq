import { Answer } from "./answer-interface";
import { Question } from "./question-interface";

export interface AnswerDialogData {
  question?: Question;
  answer?: Answer;
  mode:AnswerDialogDataType
}

export type AnswerDialogDataType = 'CREATE' | 'EDIT';

