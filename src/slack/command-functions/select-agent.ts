import { WebClient, ViewsOpenArguments } from "@slack/web-api";
import { SlackCommandEvent } from "../interfaces";
import { listAgents } from "../../codegpt/codegpt";

export async function selectAgent(
  event: SlackCommandEvent,
  accessToken: string
) {
  try {
    let agents: any = await listAgents();
    console.log("agents", agents);
    const slackClient = new WebClient(accessToken);
    let modal: ViewsOpenArguments;

    // Define el modal para seleccionar un agente de un menú desplegable dentro de un bloque de entrada
    modal = {
      trigger_id: event.trigger_id,
      view: {
        type: "modal",
        callback_id: "select_agent_modal",
        title: {
          type: "plain_text",
          text: "Selecciona un Agente",
        },
        blocks: [
          {
            type: "input",
            block_id: "agent_selection_block",
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Selecciona un agente",
              },
              options: agents.map((agent: any) => ({
                text: {
                  type: "plain_text",
                  text: agent.name,
                },
                value: agent.id.toString(),
              })),
              action_id: "agent_selection",
            },
            label: {
              type: "plain_text",
              text: "Agentes disponibles",
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Confirmar",
        },
      },
    };

    // Abre el modal
    await slackClient.views.open(modal);
  } catch (error) {
    console.error("Error al abrir el modal de selección:", error);
    throw error;
  }
}
