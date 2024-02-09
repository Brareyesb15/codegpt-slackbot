import { App } from '@slack/bolt';
export interface SlackEvent {
    token: string;
    team_id: string;
    context_team_id: string;
    context_enterprise_id: string | null;
    api_app_id: string;
    event: {
      client_msg_id: string;
      type: string;
      text: string;
      user: string;
      ts: string;
      blocks: any[]; 
      team: string;
      channel: string;
      event_ts: string;
      channel_type: string;
    };
    type: string;
    event_id: string;
    event_time: number;
    authorizations: {
      enterprise_id: string | null;
      team_id: string;
      user_id: string;
      is_bot: boolean;
      is_enterprise_install: boolean;
    }[];
    is_ext_shared_channel: boolean;
    event_context: string;
  }
  
  export interface AuthResponse {
    ok: boolean;
    app_id: string;
    authed_user: {
      id: string;
      scope: string;
      access_token: string;
      token_type: string;
    };
    scope: string;
    token_type: string;
    access_token: string;
    bot_user_id: string;
    team: {
      id: string;
      name: string;
    };
    enterprise: any; // Puedes especificar el tipo correcto si lo conoces
    is_enterprise_install: boolean;
    incoming_webhook: {
      channel: string;
      channel_id: string;
      configuration_url: string;
      url: string;
    };
  }