// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require("fs/promises");
const fs2 = require("fs");

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
const exec = require('child_process').exec;
function os_func() {
    this.execCommand = function(cmd, callback) {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            callback(stdout);
        });
    }
}
var os2 = new os_func();

/**
 * @param {vscode.ExtensionContext} context
 */
const PathConfigFile = __dirname + '/CPPMetric_config.json';

function CreateConfigFile()
{
	const wsedit = new vscode.WorkspaceEdit();
	wsedit.createFile(PathConfigFile, { ignoreIfExists: true });
	vscode.workspace.applyEdit(wsedit);
	const obj = {
		projectName: "", 
		pathToCore: ""
	};
	const writeStr = JSON.stringify(obj);
	const writeData = Buffer.from(writeStr, 'utf8')
	fs2.writeFileSync(PathConfigFile, writeData);
	//vscode.workspace.fs.writeFile(PathConfigFile, writeData);
}

function WriteFile(str)
{
	const writeData = Buffer.from(str, 'utf8')
	fs2.writeFileSync(PathConfigFile, writeData);

}
 function ReadFile()
{
	if(!fs2.existsSync(PathConfigFile))
	{
		CreateConfigFile();
	}

	const data = fs2.readFileSync(PathConfigFile, 'utf8');
	return data;
}
function Update (name, newName)
{

}
function Delete (name)
{
	
}
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "cppmetrics" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.djson
	

	let createConfigFile = vscode.commands.registerCommand('cppmetrics.ViewProjectName', function () {
		let text = ReadFile();
		  const obj = JSON.parse(text);
		  if(obj != null)
		  {
			vscode.window.showInformationMessage(obj.projectName,'Ok');
		  }

	});
	context.subscriptions.push(createConfigFile);
	

	var projectPath;
	var outPath;
	let disposable = vscode.commands.registerCommand('cppmetrics.Start_metric', function () {
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
		
		var cppMetricCorePath = "C:\\Users\\User\\source\\repos\\CPP_Metrics\\CPP_Metrics\\bin\\Debug\\net6.0";
		os2.execCommand(`cd ${cppMetricCorePath}`
						+ `& start CPP_Metrics.exe`
						+` -f ${projectPath}`
						+` -o ${projectPath}`

			, function (returnvalue) {

				vscode.window.showInformationMessage('Reports done!','View Report').then(selection =>{
					if(selection === 'View Report')
					{
						let outPutChannel = vscode.window.createOutputChannel("Cpp-metrics","Cpp-metrics-id");
						var reportFold = path.join(projectPath, "Report")
						var folder = getNewestDirectory(reportFold);
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

		//const exec = require('child_process').exec;
		//try {
		//	exec(`cd ${cppMetricCorePath}`
		//	+ `& start AntlrTreeVisualization.exe`
		//	+`-i ${projectPath}`
		//`	+`-o ${outPath}`
		//	, { encoding: 'utf-8' });
		//} catch (error) {
		//	vscode.window.showInformationMessage('Error!');
		//	return;
		//}
		
		
	});
	context.subscriptions.push(disposable);
	let disposable2 = vscode.commands.registerCommand('cppmetrics.InitializeProjectName', async function () {
		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection);
		const searchQuery = await vscode.window.showInputBox({
			placeHolder: "Input name",
			prompt: "Input project name",
			value: selectedText
		  });
		  if(searchQuery === ''){
			console.log(searchQuery);
			vscode.window.showErrorMessage('Error! Project name is empty');
		  }
		  let text = ReadFile();
		  try
		  {
			  const obj = JSON.parse(text);
			  if(obj != null)
			  {
				  obj.projectName = searchQuery;
				  let str = JSON.stringify(obj);
				  WriteFile(str);
			  }
			  else 
			  {
				  return;
			  }
			  vscode.window.showInformationMessage('Initialize project name succeed!','Ok');
		  }
		  catch(ex)
		  {
			return;
		  }
	});
	context.subscriptions.push(disposable2);
	let disposable3 = vscode.commands.registerCommand('cppmetrics.Update', async function () {
		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection);
		const searchQuery = await vscode.window.showInputBox({
			placeHolder: "Input name",
			prompt: "Input project name",
			value: selectedText
		  });
		  if(searchQuery === ''){
			console.log(searchQuery);
			vscode.window.showErrorMessage('Error! Project name is empty');
		  }
		  const searchQuery2 = await vscode.window.showInputBox({
			placeHolder: "Input new name",
			prompt: "Input project name",
			value: selectedText
		  });

		  if(searchQuery === ''){
			console.log(searchQuery);
			vscode.window.showErrorMessage('Error! Project name is empty');
		  }
		  let text = ReadFile();
		  try
		  {
			  const obj = JSON.parse(text);
			  if(obj != null)
			  {
				  obj.projectName = searchQuery2;
				  let str = JSON.stringify(obj);
				  WriteFile(str);
				  Update(searchQuery,searchQuery2);
			  }
			  else 
			  {
				  return;
			  }
			  vscode.window.showInformationMessage('Initialize project name succeed!','Ok');
		  }
		  catch(ex)
		  {
			return;
		  }
	});
	context.subscriptions.push(disposable3);

	let disposable4 = vscode.commands.registerCommand('cppmetrics.Delete', async function () {
		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection);
		const searchQuery = await vscode.window.showInputBox({
			placeHolder: "Input name",
			prompt: "Input project name",
			value: selectedText
		  });
		  if(searchQuery === ''){
			console.log(searchQuery);
			vscode.window.showErrorMessage('Error! Project name is empty');
		  }
		  
		  let text = ReadFile();
		  try
		  {
			  const obj = JSON.parse(text);
			  if(obj != null)
			  {
				  obj.projectName = "";
				  let str = JSON.stringify(obj);
				  WriteFile(str);
				  Delete(searchQuery);
			  }
			  else 
			  {
				  return;
			  }
			  vscode.window.showInformationMessage('Initialize project name succeed!','Ok');
		  }
		  catch(ex )
		  {
			return;
		  }
	});
	context.subscriptions.push(disposable4);
	let disposable6 = vscode.commands.registerCommand('cppmetrics.Solution', async function () {
		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection);
		const searchQuery = await vscode.window.showInputBox({
			placeHolder: "Input name",
			prompt: "Input project name",
			value: selectedText
		  });
		  if(searchQuery === ''){
			console.log(searchQuery);
			vscode.window.showErrorMessage('Error! Project name is empty');
		  }
		  
		  
	});
	context.subscriptions.push(disposable6);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
