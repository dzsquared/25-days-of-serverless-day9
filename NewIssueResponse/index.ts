import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as request from 'request-promise-native';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    // set API key
    const key_var = 'GITHUB_KEY';
    if (!process.env[key_var]) {
        throw new Error('please set/export the following environment variable: ' + key_var);
    }
    const access_key = process.env[key_var];

    let baseUrl = "";
    let apitoken = 'token ' + access_key;

    // someone has opened an issue
    if (req.body.action == "opened") {
        // thank them
        // let issueNumber: string = req.body.issue.number.toString();
        let baseUrl : string = req.body.issue.comments_url;
        let newComment: string = `**Thank you for raising an issue for the Azure Data Studio extension for the First Responder Kit!**

This is a volunteer project, but I hope to get back to you soon. I really appreciate feedback on issues and new feature requests!
        
If your question involves the First Responder Kit directly, you may find help in the [#FirstResponderKit Slack Channel](https://sqlcommunity.slack.com/messages/firstresponderkit/). 
`;

        //get live most recent version from github
        var options = {
            uri: baseUrl,
            headers: {
                'Authorization': apitoken,
                'User-Agent': 'FRK-Monitor'
            },
            json: true,
            simple: false,
            body: { "body": newComment }
        };
        var scriptText = await request.post(options);

        // respond to webhook
        context.res = {
            body: "issue response sent"
        }
    } else {
        context.res = {
            body: "no action needed"
        }
    }


};

export default httpTrigger;
