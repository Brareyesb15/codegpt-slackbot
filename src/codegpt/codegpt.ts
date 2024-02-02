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

  console.log("llegó a completions", url)
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
    const response = await axios.post<CodeGPTResponse>(url, payload, {
      headers: {
        'Authorization': `Bearer ${codeGPTConfig.apiKey}`,
        // Agrega cualquier otro encabezado necesario para la solicitud
      },
    });

    console.log("response OK", response.data);
    return response.data;
  } catch (error: unknown) {
    // Verificamos si el error es una instancia de AxiosError
    if (axios.isAxiosError(error)) {
      // Ahora podemos acceder a la propiedad response y a los detalles específicos del error de Axios
      console.error("Error details:", error.response?.data.error[0]);
    } else {
      // Manejo de errores de red o desconocidos
      console.error("Error al enviar mensaje a CodeGPT:", error);
    }
    throw new Error(`HTTP error! status: ${(error as AxiosError).message}`);
  }
};