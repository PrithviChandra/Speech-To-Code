
import * as vscode from 'vscode';
require ('dotenv').config();
export function activate(context: vscode.ExtensionContext) {

	const { Configuration, OpenAIApi } = require("openai");

	const configuration = new Configuration({
  		apiKey: "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",
	});
	const openai = new OpenAIApi(configuration);

	let disposable = vscode.commands.registerCommand('speechtocode.extensionMaker', async () => {
		//read line from cursor
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor != null) {
			let lineNumber:number = activeEditor.selection.active.line;
			let line:string = activeEditor.document.lineAt(lineNumber).text;
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
					editBuilder.replace(activeEditor.selection.start,"#"+comment);
					editBuilder.insert(activeEditor.selection.active, "\n" + response.data.choices[0].text + "\n");
				});
			}	
		}
	});
	
	//insert your code here
	//read from selection
	//make api call 
	//display output

	context.subscriptions.push(disposable);
	
	//dispose the function

}

// this method is called when your extension is deactivated
export function deactivate() {}



