"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
require('dotenv').config();
function activate(context) {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
        apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);
    let disposable = vscode.commands.registerCommand('speechtocode.extensionMaker', async () => {
        //read line from cursor
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor != null) {
            let lineNumber = activeEditor.selection.active.line;
            let line = activeEditor.document.lineAt(lineNumber).text;
            //display line to user
            let comment = (" \"\"\" " + line + " \"\"\" ");
            const response = await openai.createCompletion("code-davinci-001", {
                prompt: comment,
                temperature: 0,
                max_tokens: 150,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            //make an api call to openai with the line
            if (activeEditor) {
                activeEditor.edit(editBuilder => {
                    editBuilder.replace(activeEditor.selection.start, "#" + comment);
                    editBuilder.insert(activeEditor.selection.active, "\n" + response.data.choices[0].text + "\n");
                });
            }
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map