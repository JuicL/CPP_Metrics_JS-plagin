// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require("fs/promises");
const fs2 = require("fs");
const exec1 = require("node:child_process");

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
		pathToCore: "",
		inludeFiles:[],
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

function Update (name, newName,outPutChannel)
{
	let cppMetricCorePath = vscode.workspace.getConfiguration('CPPMetrics').CorePath;
	if(cppMetricCorePath.length == 0)
	{
		let message = "Path to core dont find" ;
		vscode.window.showErrorMessage(message);
		return;
	}
	var strCommand = `chcp 65001 & cd ${cppMetricCorePath}`
	+ `& CPP_Metrics.exe`
	+` -up ${name} ${newName}`;
	let process = exec(strCommand);
	process.stdout.on('data', function(data) {
		outPutChannel.appendLine(data.toString());
		console.log(data.toString()); 
	});
	process.stderr.on('data', function(data) {
		outPutChannel.appendLine(data.toString());
		console.log(data.toString()); 
	});
}

function Delete (name,outPutChannel)
{
	let cppMetricCorePath = vscode.workspace.getConfiguration('CPPMetrics').CorePath;
	if(cppMetricCorePath.length == 0)
	{
		let message = "Path to core dont find" ;
		vscode.window.showErrorMessage(message);
		return;
	}
	var strCommand = `chcp 65001 & cd ${cppMetricCorePath}`
	+ `& CPP_Metrics.exe`
	+` -dp ${name}`;
	let process = exec(strCommand);
	process.stdout.on('data', function(data) {
		outPutChannel.appendLine(data.toString());
		console.log(data.toString()); 
	});
	process.stderr.on('data', function(data) {
		outPutChannel.appendLine(data.toString());
		console.log(data.toString()); 
	});
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
		  if(obj != null && obj.projectName.length != 0)
		  {
			vscode.window.showInformationMessage(obj.projectName,'Ok');
		  }
		  else
		  {
			vscode.window.showErrorMessage("Project name is empty!",'Ok');
		  }

	});
	context.subscriptions.push(createConfigFile);
	let db = vscode.commands.registerCommand('cppmetrics.Database', function () {
		vscode.commands.executeCommand('workbench.action.openSettings', 'cppmetrics Database')
	});
	context.subscriptions.push(db);

	let configureSettings = vscode.commands.registerCommand('cppmetrics.ConfigureSettings', function () {
		vscode.commands.executeCommand('workbench.action.openSettings', 'cppmetrics InludePath')

	});
	context.subscriptions.push(configureSettings);

	let сonfigureOutPath = vscode.commands.registerCommand('cppmetrics.ConfigureOutPath', function () {
		vscode.commands.executeCommand('workbench.action.openSettings', 'cppmetrics OutPath')

	});
	context.subscriptions.push(сonfigureOutPath);
	
	let configureCorePath = vscode.commands.registerCommand('cppmetrics.ConfigureCorePath', function () {
		vscode.commands.executeCommand('workbench.action.openSettings', 'cppmetrics CorePath')
	});
	context.subscriptions.push(configureCorePath);
	
	let ConfigurePathXml = vscode.commands.registerCommand('cppmetrics.ConfigurePathXml', function () {
		vscode.commands.executeCommand('workbench.action.openSettings', 'cppmetrics OutPathXml')
	});
	context.subscriptions.push(ConfigurePathXml);

	let cfg = vscode.commands.registerCommand('cppmetrics.Cfg', function () {

		let terminals = vscode.window.terminals;
		let terminal;
		if(terminals.length == 0)
		{
			 terminal = vscode.window.createTerminal(`Ext Terminal`);
		}
		else{
			terminal = terminals[0];
		}
		var projectPath;
		if(vscode.workspace.workspaceFolders !== undefined) {
			projectPath = vscode.workspace.workspaceFolders[0].uri.fsPath ; 
		} 
		else {
			let message = "Working folder not found, open a folder an try again" ;
			vscode.window.showErrorMessage(message);
			return;
		}
		let cppMetricCorePath = vscode.workspace.getConfiguration('CPPMetrics').CorePath;
		if(cppMetricCorePath.length == 0)
		{
			let message = "Path to core dont find" ;
			vscode.window.showErrorMessage(message);
			return;
		}
		var strCommand = `cd ${cppMetricCorePath}`
		+ ` & CPP_Metrics.exe`
		+` -cfg ${projectPath}`;

		let inludePath = vscode.workspace.getConfiguration('CPPMetrics').InludePath;
		inludePath.forEach(x => strCommand += ` -i ` + x);
		
		let process = exec(strCommand);
		
		process.stdout.on('data', function(data) {
			outPutChannel.appendLine(data.toString());
			console.log(data.toString()); 
		});
		process.stderr.on('data', function(data) {
			outPutChannel.appendLine(data.toString());
			console.log(data.toString()); 
		});
		process.on('exit', function(code) {
			outPutChannel.appendLine(code.toString());
			console.log(code.toString()); 
		});
		
		return;
		os2.execCommand(strCommand
			, function (returnvalue) {

				vscode.window.showInformationMessage('File created!','').then(selection =>{
					
				});
		});
	});
	context.subscriptions.push(cfg);

	var outPath;
	const outPutChannel = vscode.window.createOutputChannel("Cpp-metrics","Cpp-metrics-id");
	let disposable = vscode.commands.registerCommand('cppmetrics.Start_metric', function () {
		//const os = require("os");
		//let osVersion = os.platform();
		//console.log("OS Version:", osVersion);
		let dbflag = vscode.workspace.getConfiguration('CPPMetrics').Database;
		if(dbflag == true)
		{
			let text = ReadFile();
			const obj = JSON.parse(text);
			if(obj.projectName.length == 0)
			{
				vscode.window.showErrorMessage("Initialize project name",'Ok');
				return;
			}
			var projectName = obj.projectName;
		}
		var projectPath;
		// Текущая папка

		if(vscode.workspace.workspaceFolders !== undefined) {
			projectPath = vscode.workspace.workspaceFolders[0].uri.fsPath ; 
		} 
		else {
			let message = "Working folder not found, open a folder an try again" ;
			vscode.window.showErrorMessage(message);
			return;
		}
		
		let cppMetricCorePath = vscode.workspace.getConfiguration('CPPMetrics').CorePath;
		if(cppMetricCorePath.length == 0)
		{
			let message = "Path to core dont find" ;
			vscode.window.showErrorMessage(message);
			return;
		}
		let outPath;
	
		let cppMetricOutPath = vscode.workspace.getConfiguration('CPPMetrics').OutPath;
		let cppMetricOutPathXml = vscode.workspace.getConfiguration('CPPMetrics').OutPathXml;

		if(cppMetricOutPath.length == 0)
		{
			outPath = projectPath
		}
		else{
			outPath = cppMetricOutPath;
		}

		var strCommand = `chcp 65001 & cd ${cppMetricCorePath}`
		+ `& CPP_Metrics.exe`
		+` -f ${projectPath}`
		+` -o ${outPath}`;
		if(dbflag == true)
			strCommand += ` -p ${projectName}`;

		
		if(cppMetricOutPathXml.length != 0)
		{
			strCommand += ` -xmlo ` + cppMetricOutPath;
		}

		let inludePath = vscode.workspace.getConfiguration('CPPMetrics').InludePath;
		inludePath.forEach(x => strCommand += ` -i ` + x);
		
		
		let process = exec(strCommand
			, function (returnvalue,out,err) {
				vscode.window.showInformationMessage('Reports done!','View Report').then(selection =>{
					if(selection === 'View Report')
					{
						var reportFold = path.join(projectPath, "Report")
						var folder = getNewestDirectory(reportFold);
						folder.then(function(res){
							console.log("newestFolderName", res);
							//let fileName = path.join(res, "index.html")
							const exec = require('child_process').exec;
							exec(`cd ${res} & start index.html`, { encoding: 'utf-8' });
						});
						//outPutChannel.appendLine(folder.toString());
					}
					
				});
		});
		process.stdout.on('data', function(data) {
			outPutChannel.appendLine(data.toString());
			console.log(data.toString()); 
		});
		process.stderr.on('data', function(data) {
			outPutChannel.appendLine(data.toString());
			console.log(data.toString()); 
		});
		process.on('exit', function(code) {
			outPutChannel.appendLine(code.toString());
			console.log(code.toString()); 
		});
		
	});
	context.subscriptions.push(disposable);
	
	let CreateProject = vscode.commands.registerCommand('cppmetrics.CreateProject', async function () {
		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection);
		const searchQuery = await vscode.window.showInputBox({
			placeHolder: "Input name",
			prompt: "Input project name",
			value: selectedText
		  });

		  let cppMetricCorePath = vscode.workspace.getConfiguration('CPPMetrics').CorePath;
			if(cppMetricCorePath.length == 0)
			{
				let message = "Path to core dont find" ;
				vscode.window.showErrorMessage(message);
				return;
			}
			if(searchQuery === ''){
				console.log(searchQuery);
				vscode.window.showErrorMessage('Error! Project id is empty');
				return;
			}
			var strCommand = `chcp 65001 & cd ${cppMetricCorePath}`
			+ `& CPP_Metrics.exe`
			+` -cp ${searchQuery}`;
			

			let process = exec(strCommand);
			process.stdout.on('data', function(data) {
				outPutChannel.appendLine(data.toString());
				console.log(data.toString()); 
			});
			process.stderr.on('data', function(data) {
				outPutChannel.appendLine(data.toString());
				console.log(data.toString()); 
			});
		 
	});
	context.subscriptions.push(CreateProject);
	let getProjectId = vscode.commands.registerCommand('cppmetrics.getProjectId', async function () {
		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection);
		const searchQuery = await vscode.window.showInputBox({
			placeHolder: "Input name",
			prompt: "Input project name",
			value: selectedText
		  });

		  let cppMetricCorePath = vscode.workspace.getConfiguration('CPPMetrics').CorePath;
			if(cppMetricCorePath.length == 0)
			{
				let message = "Path to core dont find" ;
				vscode.window.showErrorMessage(message);
				return;
			}
			var strCommand = `chcp 65001 & cd ${cppMetricCorePath}`
			+ `& CPP_Metrics.exe`
			+` -gp `;
			if(searchQuery.length != 0){
				strCommand += searchQuery;
			}

			let process = exec(strCommand);
			process.stdout.on('data', function(data) {
				outPutChannel.appendLine(data.toString());
				console.log(data.toString()); 
			});
			process.stderr.on('data', function(data) {
				outPutChannel.appendLine(data.toString());
				console.log(data.toString()); 
			});
		 
	});
	context.subscriptions.push(getProjectId);
	
	let getSolutionId = vscode.commands.registerCommand('cppmetrics.getSolutionId', async function () {
		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection);
		const searchQuery = await vscode.window.showInputBox({
			placeHolder: "Input project Id",
			prompt: "Input project Id",
			value: selectedText
		  });

		  let cppMetricCorePath = vscode.workspace.getConfiguration('CPPMetrics').CorePath;
			if(cppMetricCorePath.length == 0)
			{
				let message = "Path to core dont find" ;
				vscode.window.showErrorMessage(message);
				return;
			}
			if(searchQuery === ''){
				console.log(searchQuery);
				vscode.window.showErrorMessage('Error! Project id is empty');
				return;
			}

			var strCommand = `chcp 65001 & cd ${cppMetricCorePath}`
			+ `& CPP_Metrics.exe`
			+` -gs ${searchQuery}`;

			let process = exec(strCommand);
			process.stdout.on('data', function(data) {
				outPutChannel.appendLine(data.toString());
				console.log(data.toString()); 
			});
			process.stderr.on('data', function(data) {
				outPutChannel.appendLine(data.toString());
				console.log(data.toString()); 
			});
		 
	});
	context.subscriptions.push(getSolutionId);

	let getMetricsId = vscode.commands.registerCommand('cppmetrics.getMetricsId', async function () {
		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection);
		const searchQuery = await vscode.window.showInputBox({
			placeHolder: "Input solution Id",
			prompt: "Input solution Id",
			value: selectedText
		  });

		  let cppMetricCorePath = vscode.workspace.getConfiguration('CPPMetrics').CorePath;
			if(cppMetricCorePath.length == 0)
			{
				let message = "Path to core dont find" ;
				vscode.window.showErrorMessage(message);
				return;
			}
			if(searchQuery === ''){
				console.log(searchQuery);
				vscode.window.showErrorMessage('Error! Solution id is empty');
				return;
			}

			var strCommand = `chcp 65001 & cd ${cppMetricCorePath}`
			+ `& CPP_Metrics.exe`
			+` -gm ${searchQuery}`;

			let process = exec(strCommand);
			process.stdout.on('data', function(data) {
				outPutChannel.appendLine(data.toString());
				console.log(data.toString()); 
			});
			process.stderr.on('data', function(data) {
				outPutChannel.appendLine(data.toString());
				console.log(data.toString()); 
			});
		 
	});
	context.subscriptions.push(getMetricsId);

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
				  Update(searchQuery,searchQuery2,outPutChannel);
			  }
			  else 
			  {
				  return;
			  }
			  vscode.window.showInformationMessage('Update project name succeed!','Ok');
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
			return;
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
				  Delete(searchQuery,outPutChannel);
			  }
			  else 
			  {
				  return;
			  }
			  vscode.window.showInformationMessage('Delete project name succeed!','Ok');
		  }
		  catch(ex )
		  {
			return;
		  }
	});
	context.subscriptions.push(disposable4);
	let disposable6 = vscode.commands.registerCommand('cppmetrics.Solution', async function () {
		
		
		return;
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
