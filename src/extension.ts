'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as resolver from './resolver';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.railsGoToSpec', () => {
	// The code you place here will be executed every time your command is executed

	// Display a message box to the user
	var editor = vscode.window.activeTextEditor;
	if (!editor) {
		return; // No open text editor
	}

	let document = editor.document;
	let fileName: string = document.fileName;
	let related: string = resolver.getRelated(fileName);
 	// console.log('related', related);

	let dirname: string = path.dirname(related);
	// console.log('dirname', dirname);
	
	let fileExists: boolean = fs.existsSync(related);
	//console.log('fileExists', fileExists);

	if (!fileExists) {
		 mkdirp.sync(dirname);
		 fs.closeSync(fs.openSync(related, 'w'));
	}
	
	vscode.workspace
		.openTextDocument(related)
		.then(vscode.window.showTextDocument);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}