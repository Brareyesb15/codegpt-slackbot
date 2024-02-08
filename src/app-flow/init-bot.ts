import axios from "axios";
import dotenv from 'dotenv';
import { SlackEvent, dbWorkspace } from "../slack/interfaces";
import { readWorkspaces } from "../turso/turso-repository";

dotenv.config();

const selectWorkspace = async (slackEvent: SlackEvent): Promise<void> => { 
    // select the workspace from the slack event
    const workspace_id : string = slackEvent.team_id
    // find the workspace in db 
    const workspace : dbWorkspace | null = await readWorkspaces(workspace_id)
    
    
    // llamar a la función de slack respectiva 


    }   

export { selectWorkspace};
