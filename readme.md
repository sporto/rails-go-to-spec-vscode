# Jest Go to Test extension for VSCODE

Jump between code and test in projects using Jest.

## Limitations

Only matches between `component.js` and `component.test.js`.
PR's for more complicated matching are welcome!

## Changes

* 0.0.2 - Added support for typescript

## Default keybinding:

* Ctrl + Shift + y
* Cmd + Shift + y (Mac)

## Redine shortcuts:

In keybindings.json

```
  ...
	{
		"key": "shift-cmd-y",
		"command": "extension.jestGoToTest",
		"when": "editorFocus"
	}
	...
```
