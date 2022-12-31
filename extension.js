// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { default: axios } = require('axios');
const vscode = require('vscode');
var fs = require('fs');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

	// list of all the languages
	const res = await axios.get('https://www.toptal.com/developers/gitignore/api/list')

	options = res.data.split(',').filter(item => !item.includes('\n'))
	temp = res.data.split(',').filter(item => item.includes('\n'))
	temp.forEach(item => {
		temp2 = item.split('\n')
		temp2.forEach(item2 => {
			options.push(item2)
		})
	})

	console.log(options)

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gitignoregenerator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('gitignoregenerator.create', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from gitignoregenerator!');


		let selectOptions = async () => {
			const selected = await vscode.window.showQuickPick(options, {
				canPickMany: true
			})
			selections = selected.join(',')
			console.log(selections)
			const res = await axios.get(`https://www.toptal.com/developers/gitignore/api/${selections}`)
			console.log(res.data)
			// vscode.ExtensionContext.storagePath
			// fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
			// 	if (err) throw err;
			// 	console.log('Saved!');
			// });

			const wsedit = new vscode.WorkspaceEdit();
			const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
			const filePath = vscode.Uri.file(wsPath + '/.gitignore');
			wsedit.createFile(filePath, { ignoreIfExists: true });
			wsedit.insert(filePath, new vscode.Position(0, 0), res.data);
			vscode.workspace.applyEdit(wsedit);

			console.log(filePath)
		}
		selectOptions()


	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}