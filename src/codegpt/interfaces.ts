// Define la estructura de la solicitud a la API de CodeGPT
export interface Message {
    role: string;
    content: string;
  }
  
  // Usar la interfaz 'Message' para definir el tipo de elementos en 'messages'
  export interface CodeGPTRequest {
    agentId: string;
    messages: Array<Message>; // Aquí especificamos que 'messages' es un array de 'Message'
    stream: boolean;
    format: string;
  }
  export type CodeGPTResponse = string;
  
  // Define la estructura de la configuración de la API de CodeGPT
 export interface CodeGPTConfig {
    apiEndpoint: string;
    apiKey: string;
    agentId: string;
  }