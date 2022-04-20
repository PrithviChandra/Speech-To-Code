import * as vscode from "vscode";
require("dotenv").config();
export function activate(context: vscode.ExtensionContext) {
  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  let code_gen = vscode.commands.registerCommand(
    "speechtocode.extensionMaker",
    async () => {
      //read line from cursor
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor != null) {
        let lineNumber: number = activeEditor.selection.active.line;
        let line: string = activeEditor.document.lineAt(lineNumber).text;
        //display line to user
        let comment = ' """ ' + line + ' """ ';

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
          activeEditor.edit((editBuilder) => {
            editBuilder.insert(
              activeEditor.selection.active,
              "\n" + response.data.choices[0].text + "\n"
            );
          });
        }
      }
    }
  );

  //To calculate time complexity of generated code
  let complexity = vscode.commands.registerCommand(
    "speechtocode.time_complexity",
    async () => {
      //read line from selection
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor != null) {
        let line = activeEditor.selection;
        let text = activeEditor.document.getText(line);

        const response = await openai.createCompletion("text-davinci-002", {
          prompt: text + "\nThe time complexity of this function is",
          temperature: 0,
          max_tokens: 100,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          stop: ["\n"],
        });

        if (activeEditor) {
          activeEditor.edit((editBuilder) => {
            editBuilder.insert(
              activeEditor.selection.active,
              "\n" +
                " The time complexity is " +
                response.data.choices[0].text +
                "\n"
            );
          });
        }
      }
    }
  );

  //Python Bug Fixer
  let bug_fixer = vscode.commands.registerCommand(
    "speechtocode.bug_fixer",
    async () => {
      //read selected code
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor != null) {
        let line = activeEditor.selection;
        let text = activeEditor.document.getText(line);

        //api call
        const response = await openai.createCompletion("code-davinci-002", {
          prompt:
            "##### Fix bugs in the below function\n \n### Buggy Python\n\n" +
            text +
            "\n ### Fixed Python",
          temperature: 0,
          max_tokens: 182,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          stop: ["###"],
        });

        //displaying response
        if (activeEditor) {
          activeEditor.edit((editBuilder) => {
            editBuilder.insert(
              activeEditor.selection.active,
              "\n" + response.data.choices[0].text
            );
          });
        }
      }
    }
  );

  //Explain Code
  let code_explanation = vscode.commands.registerCommand(
    "speechtocode.explain_code",
    async () => {
      //read selected code
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor != null) {
        let line = activeEditor.selection;
        let text = activeEditor.document.getText(line);

        //api call
        const response = await openai.createCompletion("code-davinci-002", {
          prompt: text + "\n\n\"\"\"\nHere's what the above class is doing:\n",
          temperature: 0,
          max_tokens: 64,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          stop: ["\"\"\""],
        });

        //displaying response
        if (activeEditor) {
          activeEditor.edit((editBuilder) => {
            editBuilder.insert(
              activeEditor.selection.active,
              "\n" + response.data.choices[0].text
            );
          });
        }
      }
    }
  );

  // Translate from Python to other languages
  let translated = vscode.commands.registerCommand(
    "speechtocode.translate_code",
    async () => {
      //read selected code
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor != null) {
        let line = activeEditor.selection;
        let text = activeEditor.document.getText(line);

        //api call

        const response = await openai.createCompletion("code-davinci-002", {
          prompt:
            "##### Translate this function  from Python into Haskell\n### Python\n" +
            text +
            "\n ### Haskell",
          temperature: 0,
          max_tokens: 54,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          stop: ["###"],
        });

        //displaying response
        if (activeEditor) {
          activeEditor.edit((editBuilder) => {
            editBuilder.insert(
              activeEditor.selection.active,
              "\n" + response.data.choices[0].text
            );
          });
        }
      }
    }
  );

  context.subscriptions.push(code_gen);
  context.subscriptions.push(complexity);
  context.subscriptions.push(bug_fixer);
  context.subscriptions.push(code_explanation);
  context.subscriptions.push(translated);
}

// this method is called when your extension is deactivated
export function deactivate() {}
