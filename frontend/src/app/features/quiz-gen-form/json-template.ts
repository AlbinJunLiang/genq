
  export const jsontemplate  = `Estructura requerida:
{
  "title": "string",
  "description": "string",
  "visibility": "PUBLIC | PRIVATE | ACCESS_ONLY_VIA_LINK | INACTIVE",
  "attemptsLimit": 3,
  "questions": [
    {
      "content": "string",
      "type": "UNIQUE | MULTIPLE",
      "feedback": "string",
      "answers": [
        {
          "content": "string",
          "isCorrect": boolean
        }
      ]
    }
  ]
}
`;