import { CodeGPTResponse } from "./interfaces";

export const processCodeGPTResponse = (response: CodeGPTResponse): string => {
    console.log("response on process", response)
    return response
  };