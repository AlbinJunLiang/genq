
export const groqCompletion = async ({
    content,
    instruction,
    context = '',
    system = false,
    model = 'llama-3.3-70b-versatile',
    isJson = false
}) => {
    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(createBody({ content, instruction, context, system, model, isJson }))
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const mensajeError = errorData?.error?.message || `HTTP Error: ${response.status}`;
            throw new Error(`[Groq Error] ${mensajeError}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        throw error;
    }
};

export const createBody = ({
    content,
    instruction,
    context = '',
    system = false,
    model = 'llama-3.3-70b-versatile',
    isJson = false
}) => {
    const validModel = typeof model === 'string' ? model : 'llama-3.3-70b-versatile';

    const messages = [];

    if (system && instruction) {

        const finalInstruction = isJson
            ? `${instruction} You must output the response strictly as a valid JSON object.`
            : instruction;

        messages.push({ role: "system", content: finalInstruction });
    }

    if (context && context.trim() !== '') {
        messages.push({
            role: "system",
            content: `Background Conversation History:\n${context}`
        });
    }

    messages.push({ role: "user", content: content });

    const body = {
        model: validModel,
        messages: messages,
        max_tokens: 4600,
        temperature: isJson ? 0 : 0.7
    };

    if (isJson) {
        body.response_format = {
            type: "json_object"
        };
    }

    return body;
};