'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as resolver from './resolver';

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

	var document = editor.document;
	var fileName = document.fileName;
	console.log('fileName', fileName);
	var related = resolver.getRelated(fileName);
	console.log('related', related);

	vscode.workspace.openTextDocument(related);

	// Display a message box to the user
	//vscode.window.showInformationMessage('Selected characters:');

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}