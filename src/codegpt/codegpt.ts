import axios, { AxiosError } from 'axios';
import { CodeGPTConfig,CodeGPTRequest,CodeGPTResponse, Message} from './interfaces';
import dotenv from 'dotenv';
dotenv.config();

// Suponiendo que codeGPTConfig ya está definido en alguna parte del código
const codeGPTConfig: CodeGPTConfig = {
  apiEndpoint: process.env.CODEGPT_API_ENDPOINT || '',
  apiKey: process.env.CODEGPT_API_KEY || '',
  agentId: process.env.CODEGPT_AGENT_ID || '',
};

export const completions = async (prompt: string |  undefined): Promise<CodeGPTResponse> => {
  
  const url = `${codeGPTConfig.apiEndpoint}/chat/completions`;

  console.log("llegó a completions", prompt)
  let message: Message= {
    role: "user",
    content : prompt ?? "sin prompt"
  }
  const payload: CodeGPTRequest = {
    agentId: codeGPTConfig.agentId,
    messages: [message],
    stream: false,
    format: "text",
  };


  try {
    console.log("payload", payload, "apikey", codeGPTConfig.apiKey)
    const response = await axios.post<CodeGPTResponse>(url, payload, {
      headers: {
        'Authorization': `Bearer ${codeGPTConfig.apiKey}`,
        // Agrega cualquier otro encabezado necesario para la solicitud
      },
    });

    console.log("response OK", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error capturado en el bloque catch:", error);
    // Verificamos si el error es una instancia de AxiosError
    if (axios.isAxiosError(error)) {
      // Ahora podemos acceder a la propiedad response y a los detalles específicos del error de Axios
      console.error("Error details:", error.response?.data.error[0]);
    } else {
      // Manejo de errores de red o desconocidos
      console.error("Error al enviar mensaje a CodeGPT:", error);
    }
    console.error(`HTTP error! status: ${(error as AxiosError).message}`);
    throw new Error(`HTTP error! status: ${(error as AxiosError).message}`);
  }
};