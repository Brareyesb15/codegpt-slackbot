import { updateAgent } from "../codegpt/codegpt";
import {
  assignAgentToUser,
  findUserWithAgent,
} from "../turso/users-repository";
import { SlackEvent } from "./interfaces";
import { WebClient, ViewsOpenArguments } from "@slack/web-api";

export async function handleModalSubmission(event: any, accessToken: string) {
  console.log("Event on handleModalSubmission", event);
  try {
    if (event.view.callback_id === "select_agent_modal") {
      assignAgentToUser(event);
    }
    if (event.view.callback_id === "configure_agent_modal") {
      console.log("selección", event.view.state.values, "user", event.user.id);
      const payload: any = {};

      // Verificar si existe name_block y agregarlo al payload si es así
      if (event.view.state.values.name_block.name_input.value) {
        payload.name = event.view.state.values.name_block.name_input.value;
      }

      // Verificar si existe prompt_block y agregarlo al payload si es así
      if (event.view.state.values.prompt_block.prompt_input.value) {
        payload.prompt =
          event.view.state.values.prompt_block.prompt_input.value;
      }
      console.log(payload);
      let agent = await findUserWithAgent(event.user.id);
      updateAgent(agent.agent_id, payload);
    }

    return {
      statusCode: 200,
      body: "Configuración actualizada con éxito",
    };
  } catch (error) {
    console.error("Error al procesar la configuración del modal:", error);
    return {
      statusCode: 500,
      body: "Error al procesar la configuración",
    };
  }
}
