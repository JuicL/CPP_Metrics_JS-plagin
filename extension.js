// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require("fs/promises");
const path = require("path");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
async function getNewestDirectory(dirName) {
	let dirs = await fs.readdir(dirName, {
	  withFileTypes: true,
	});
	dirs = dirs.filter((file) => file.isDirectory()).map((dirent) => dirent.name);
	let newestFolder = await fs.stat(path.join(dirName, dirs[0]));
	let newestFolderName = dirs[0];
	for (let directory of dirs) {
	  const stats = await fs.stat(path.join(dirName, directory));
	  if (stats.ctimeMs > newestFolder.ctimeMs) {
		newestFolder = stats;
		newestFolderName = directory;
	  }
	}
	//console.log("newestFolder", newestFolder);
	//console.log("newestFolderName", newestFolderName);
	return path.resolve(path.join(dirName, newestFolderName));
  }
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
	
	var projectPath;
	var outPath;
	let disposable = vscode.commands.registerCommand('cppmetrics.helloWorld', function () {
		//const os = require("os");
		//let osVersion = os.platform();
		//console.log("OS Version:", osVersion);
		
		// Текущая папка

		if(vscode.workspace.workspaceFolders !== undefined) {
			projectPath = vscode.workspace.workspaceFolders[0].uri.fsPath ; 
		} 
		else {
			let message = "Working folder not found, open a folder an try again" ;
			vscode.window.showErrorMessage(message);
			return;
		}
		
		var cppMetricCorePath = "C:\\Users/User/source/repos/AntlrTreeVisualization/AntlrTreeVisualization/bin/Debug";
		const exec = require('child_process').exec;
		try {
			exec(`cd ${cppMetricCorePath}`
			+ `& start AntlrTreeVisualization.exe`
			+`-i ${projectPath}`
			+`-o ${outPath}`
			, { encoding: 'utf-8' });
		} catch (error) {
			vscode.window.showInformationMessage('Error!');
			return;
		}
		
		vscode.window.showInformationMessage('Reports done!','View Report').then(selection =>{
			if(selection === 'View Report')
			{
				let outPutChannel = vscode.window.createOutputChannel("Cpp-metrics","Cpp-metrics-id");
				var folder = getNewestDirectory(projectPath);
				folder.then(function(res){
					console.log("newestFolderName", res);
					//let fileName = path.join(res, "index.html")
					const exec = require('child_process').exec;
					exec(`cd ${res} & start index.html`, { encoding: 'utf-8' });
				});
				outPutChannel.appendLine(folder);
			}
			//console.log(selection);
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
