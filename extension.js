// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cppmetrics" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	
	let disposable = vscode.commands.registerCommand('cppmetrics.helloWorld', function () {
		//const os = require("os");
		//let osVersion = os.platform();
		//console.log("OS Version:", osVersion);
		
		// Текущая папка
		var projectPath;
		var outPath;

		if(vscode.workspace.workspaceFolders !== undefined) {
			projectPath = vscode.workspace.workspaceFolders[0].uri.fsPath ; 
		} 
		else {
			let message = "YOUR-EXTENSION: Working folder not found, open a folder an try again" ;
			vscode.window.showErrorMessage(message);
		}
		
		var cppMetricCorePath = "C:/Users/User/source/repos/AntlrTreeVisualization/AntlrTreeVisualization/bin/Debug";
		const exec = require('child_process').exec;
		exec(`cd ${cppMetricCorePath}`
		+ `& start AntlrTreeVisualization.exe`
		+`-i ${projectPath}`
		+`-o ${outPath}`
		, { encoding: 'utf-8' });
		


		vscode.window.showInformationMessage('Hello World from CPPMetrics!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
