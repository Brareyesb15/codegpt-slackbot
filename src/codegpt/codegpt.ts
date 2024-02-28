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
import { Agent } from "./interfaces";
dotenv.config();

const apiEndpoint = process.env.CODEGPT_API_ENDPOINT;
const apiKey = process.env.CODEGPT_API_KEY;

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

export async function getAgent(agentId: string): Promise<Agent> {
  const url = `${apiEndpoint}/agent/${agentId}`;

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

export async function updateAgent(agentId: string, payload: any): Promise<any> {
  const url = `${apiEndpoint}/agent/${agentId}`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

function handleAxiosError(error: any): never {
  if (axios.isAxiosError(error)) {
    console.error("Error details:", error.response?.data.error[0]);
    throw new Error(error.response?.data.error[0]);
  } else {
    console.error("Error al enviar mensaje a CodeGPT:", error);
    throw new Error(error.message);
  }
}
