interface Team {
  id: string;
  domain: string;
}

interface User {
  id: string;
  username: string;
  name: string;
  team_id: string;
}

interface Option {
  text: {
    type: string;
    text: string;
    emoji: boolean;
  };
  value: string;
}

interface Element {
  type: string;
  action_id: string;
  placeholder: {
    type: string;
    text: string;
    emoji: boolean;
  };
  options: Option[];
}

interface Block {
  type: string;
  block_id: string;
  label: {
    type: string;
    text: string;
    emoji: boolean;
  };
  optional: boolean;
  dispatch_action: boolean;
  element: Element;
}

interface Title {
  type: string;
  text: string;
  emoji: boolean;
}

interface Submit {
  type: string;
  text: string;
  emoji: boolean;
}

interface StateValues {
  agent_selection_block: {
    agent_selection: {
      type: string;
      selected_option: {
        text: {
          type: string;
          text: string;
          emoji: boolean;
        };
        value: string;
      };
    };
  };
}

interface ViewState {
  id: string;
  team_id: string;
  type: string;
  blocks: Block[];
  private_metadata: string;
  callback_id: string;
  state: {
    values: StateValues;
  };
  hash: string;
  title: Title;
  clear_on_close: boolean;
  notify_on_close: boolean;
  submit: Submit;
  root_view_id: string;
}

interface ViewSubmissionEvent {
  type: string;
  team: Team;
  user: User;
  api_app_id: string;
  token: string;
  trigger_id: string;
  view: ViewState;
  response_urls: string[];
  is_enterprise_install: boolean;
  enterprise: any;
}
