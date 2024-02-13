import { WebClient, ViewsOpenArguments } from '@slack/web-api';
import { SlackCommandEvent } from '../interfaces';

export async function configureAgent(event: SlackCommandEvent, accessToken: string){
    try{
const slackClient = new WebClient(accessToken);
      // Define el modal para configurar el agente
      const modal: ViewsOpenArguments = {
        trigger_id: event.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'configure_agent_modal',
          title: {
            type: 'plain_text',
            text: 'Configurar Agente'
          },
          submit: {
            type: 'plain_text',
            text: 'Guardar'
          },
          blocks: [
            {
              type: 'input',
              block_id: 'prompt_block',
              element: {
                type: 'plain_text_input',
                action_id: 'prompt_input',
                placeholder: {
                  type: 'plain_text',
                  text: 'Ingrese el prompt del agente'
                }
              },
              label: {
                type: 'plain_text',
                text: 'Prompt'
              }
            },
            {
              type: 'input',
              block_id: 'name_block',
              element: {
                type: 'plain_text_input',
                action_id: 'name_input',
                placeholder: {
                  type: 'plain_text',
                  text: 'Ingrese el nombre del agente'
                }
              },
              label: {
                type: 'plain_text',
                text: 'Nombre'
              }
            },
            {
              type: 'input',
              block_id: 'welcome_block',
              element: {
                type: 'plain_text_input',
                action_id: 'welcome_input',
                placeholder: {
                  type: 'plain_text',
                  text: 'Ingrese el mensaje de bienvenida'
                }
              },
              label: {
                type: 'plain_text',
                text: 'Mensaje de Bienvenida'
              }
            }
          ]
        }
    }
      // Abre el modal para configurar el agente
      await slackClient.views.open(modal);
}catch(error){
        console.error('Error al abrir el modal de configuración:', error);
        throw error;
    }
}
