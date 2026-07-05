export const cerebrasCompletion = async ({
    content,
    instruction,
    context = '',
    system = false,
    model = 'gpt-oss-120b',
    isJson = false
}) => {
    try {
        const response = await fetch(
            "https://api.cerebras.ai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
                },
                body: JSON.stringify(createBody({ content, instruction, context, system, model, isJson })),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const mensajeError = errorData?.error?.message || `HTTP Error: ${response.status}`;
            throw new Error(`[Cerebras Error] ${mensajeError}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    } catch (error) {
        throw error;
    }
};

export const createBody = ({
    content,
    instruction,
    context = '',
    model = 'gpt-oss-120b',
    system = false,
    isJson = false
}) => {
    const messages = [];


    let finalInstruction = instruction;
    if (system && instruction && isJson) {
        finalInstruction = `${instruction} You must output the response strictly as a valid JSON object.`;
    }

    if (system && finalInstruction) {
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
        model: model,
        stream: false,
        messages: messages,
        temperature: isJson ? 0 : 0.7,
        max_tokens: 4600,
        top_p: 1,
        seed: 0,
    };

    if (isJson) {
        body.response_format = { type: "json_object" };
    }

    return body;
};