import { assignAgentToUser } from "../turso/users-repository";
import { SlackEvent } from "./interfaces";
import { WebClient, ViewsOpenArguments } from "@slack/web-api";

export async function handleModalSubmission(
  event: ViewSubmissionEvent,
  accessToken: string
) {
  console.log("Event on handleModalSubmission", event);
  try {
    if (event.view.callback_id === "select_agent_modal") {
      assignAgentToUser(event);
    }
    // // Aquí procesarías la información enviada por el usuario a través del modal
    // // Por ejemplo, guardar las configuraciones en una base de datos o aplicarlas al bot
    // const { prompt, name, welcome } = event.view.state.values;
    //   console.log("FIN DE HANDLE MODAL",
    //   event.view.state.values)// agregarle los tipos al evento cuando los tengas aquí
    // // Lógica para procesar y almacenar las configuraciones
    // // ...

    // // Devuelve una respuesta para indicar que la configuración fue exitosa
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
