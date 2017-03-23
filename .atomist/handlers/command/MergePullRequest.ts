import {HandleResponse, Execute, Respondable, HandleCommand, MappedParameters, Respond, Instruction, Response, HandlerContext , Plan, Message} from '@atomist/rug/operations/Handlers'
import {ResponseHandler, ParseJson, CommandHandler, Secrets, MappedParameter, Parameter, Tags, Intent} from '@atomist/rug/operations/Decorators'

@CommandHandler("merge-github-pull-request", "Merge a GitHub pull request")
@Tags("github", "pr")
@Secrets("github://user_token?scopes=repo")
@Intent("merge pr", "merge pullrequest", "merge github pull request")
class MergePullRequestCommand implements HandleCommand {
    
    @Parameter({description: "The pull request number", pattern: "^.*$"})
    issue: number

    @MappedParameter(MappedParameters.GITHUB_REPOSITORY)
    repo: string

    @MappedParameter(MappedParameters.GITHUB_REPO_OWNER)
    owner: string

    handle(ctx: HandlerContext): Plan {
        let plan = new Plan();
        let execute: Respondable<Execute> = {instruction:
        {kind: "execute", name: "merge-github-pull-request", parameters: this},
        onSuccess: {kind: "respond", name: "generic-success-handler", parameters: {msg: `${this.owner}/${this.repo}#${this.issue} successfully merged`}},
        onError: {kind: "respond", name: "generic-error-handler", parameters: {msg: "Failed to merge pr: "}}}
        plan.add(execute)
        return plan;
    }
}

export let command = new MergePullRequestCommand()