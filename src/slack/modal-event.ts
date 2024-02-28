import { updateAgent } from "../codegpt/codegpt";

export async function handleModalSubmission(event: any, accessToken: string) {
  try {
    if (event.view.callback_id === "configure_agent_modal") {
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
      let agentId = process.env.CODEGPT_AGENT_ID;
      agentId ? updateAgent(agentId as string, payload) : null;
      return {
        statusCode: 200,
        body: "Configuración actualizada con éxito",
      };
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
