import axios, { AxiosError } from "axios";
import {
  CodeGPTConfig,
  CodeGPTRequest,
  CodeGPTResponse,
  Message,
} from "./interfaces";
import fs from "fs/promises";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

const apiEndpoint = process.env.CODEGPT_API_ENDPOINT;
const apiKey = process.env.CODEGPT_API_KEY; // ToDo: Hardocodeado, preguntarle a JP si la función en deno necesita
//apikey o no. De necesitarlo necesitamos guardar en db o traerlo, si no, simplemente omitir.

export async function completions(
  message: Message[],
  agentId: string
): Promise<CodeGPTResponse> {
  console.log(message);
  const url = `${apiEndpoint}/chat/completions`;
  const payload: CodeGPTRequest = {
    agentId: agentId,
    messages: message,
    stream: false,
    format: "text",
  };

  try {
    console.log("payload", payload);
    const response = await axios.post<CodeGPTResponse>(url, payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log("response OK", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error capturado en el bloque catch:", error);
    if (axios.isAxiosError(error)) {
      console.error("Error details:", error.response?.data.error[0]);
    } else {
      console.error("Error al enviar mensaje a CodeGPT:", error);
    }
    console.error(`HTTP error! status: ${(error as AxiosError).message}`);
    throw new Error(`HTTP error! status: ${(error as AxiosError).message}`);
  }
}

export async function completion(message: Message[]): Promise<CodeGPTResponse> {
  console.log(message);
  const url = `${apiEndpoint}/chat/completion`;
  const payload: any = {
    messages: message,
    stream: false,
    format: "text",
  };

  try {
    console.log("payload", payload);
    const response = await axios.post<CodeGPTResponse>(url, payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log("response OK", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error capturado en el bloque catch:", error);
    if (axios.isAxiosError(error)) {
      console.error("Error details:", error.response?.data.error[0]);
    } else {
      console.error("Error al enviar mensaje a CodeGPT:", error);
    }
    console.error(`HTTP error! status: ${(error as AxiosError).message}`);
    throw new Error(`HTTP error! status: ${(error as AxiosError).message}`);
  }
}
// export async function createAgent(nameAgent: string): Promise<any> {
//   const url = `${apiEndpoint}/agent`;
//   const payload = { "name": nameAgent };

//   try {
//     const response = await axios.post(url, payload, {
//       headers: {
//         'Authorization': `Bearer ${codeGPTConfig.apiKey}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     return response.data;
//   } catch (error) {
//     handleAxiosError(error);
//   }
// }

// export async function getAgent(agentId: string): Promise<any> {
//   const url = `${apiEndpoint}/agent/${agentId}`;

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         'Authorization': `Bearer ${codeGPTConfig.apiKey}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     handleAxiosError(error);
//   }
// }

export async function listAgents(): Promise<any> {
  const url = `${apiEndpoint}/agent`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// export async function updateAgent(agentId: string, payload: any): Promise<any> {
//   const url = `${apiEndpoint}/agent/${agentId}`;

//   try {
//     const response = await axios.patch(url, payload, {
//       headers: {
//         'Authorization': `Bearer ${codeGPTConfig.apiKey}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     return response.data;
//   } catch (error) {
//     handleAxiosError(error);
//   }
// }

// export async function deleteAgent(agentId: string): Promise<any> {
//   const url = `${apiEndpoint}/agent/${agentId}`;

//   try {
//     const response = await axios.delete(url, {
//       headers: {
//         'Authorization': `Bearer ${codeGPTConfig.apiKey}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     handleAxiosError(error);
//   }
// }

// export async function usersMe(apiKey: string): Promise<any> {
//   const url = `${apiEndpoint}/users/me`;

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         'Authorization': `Bearer ${apiKey}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     handleAxiosError(error);
//   }
// }

// export async function loadDocuments(filename: string): Promise<any> {
//   const filePath = `./Data/Documents/${filename}`;
//   const fileContent = await fs.readFile(filePath);
//   const formData = new FormData();
//   formData.append('file', fileContent, { filename });
//   const headers = {
//     'Authorization': `Bearer ${codeGPTConfig.apiKey}`,
//     ...formData.getHeaders(),
//   };
//   const url = `${apiEndpoint}/document/load`;

//   try {
//     const response = await axios.post(url, formData, { headers });

//     return response.data;
//   } catch (error) {
//     handleAxiosError(error);
//   }
// }

// export async function userExists(email: string): Promise<any> {
//   const url = `${apiEndpoint}/users/exists`;
//   const payload = { email };

//   try {
//     const response = await axios.post(url, payload, {
//       headers: {
//         'Authorization': `Bearer ${codeGPTConfig.apiKey}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     return response.data;
//   } catch (error) {
//     handleAxiosError(error);
//   }
// }

function handleAxiosError(error: any): never {
  if (axios.isAxiosError(error)) {
    console.error("Error details:", error.response?.data.error[0]);
    throw new Error(error.response?.data.error[0]);
  } else {
    console.error("Error al enviar mensaje a CodeGPT:", error);
    throw new Error(error.message);
  }
}
