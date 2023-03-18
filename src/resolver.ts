import { R, pipe } from "@mobily/ts-belt";

const NO_MATCH = R.Error("No Match");

export type Match = R.Result<Array<string>, string>;

type Matcher = (f: string) => Match;

// For any given file return a list of possible matches
export function getRelated(file: string): Match {
	if (isSpec(file)) {
		return specToCode(file);
	} else {
		return codeToSpec(file);
	}
}

function specToCode(file: string): Match {
	return tryMatch(
		file,
		[
			viewSpecToCode,
			controllerSpecToCode,
			libSpecToCode,
			genericSpecToCode,
		]
	);
}

function codeToSpec(file: string): Match {
	return tryMatch(
		file,
		[
			viewCodeToSpec,
			controllerCodeToSpec,
			libRootCodeToSpec,
			genericCodeToSpec,
		]
	);
}

function tryMatch(file: string, fns: Array<Matcher>): Match {
	for (let fn of fns) {
		let result = fn(file);
		if (R.isOk(result)) {
			return result;
			break;
		}
	}
	return NO_MATCH;
}

export function isSpec(file: string): boolean {
	return file.indexOf("_spec.rb") > -1;
}

function switchToSpecDir(file: string): string {
	return file.replace("/app/", "/spec/");
}

function switchToAppDir(file: string): string {
	return file.replace("/spec/", "/app/");
}

function addSpecExtension(file: string): string {
	return file.replace(".rb", "_spec.rb");
}

function removeSpecExtension(file: string): string {
	return file.replace("_spec.rb", ".rb");
}

function isControllerCode(file: string): boolean {
	return file.indexOf("app/controllers") > -1;
}

function isControllerSpec(file: string): boolean {
	return file.indexOf("spec/controllers") > -1 || file.indexOf("spec/requests") > -1;
}

function isRootLibCode(file: string): boolean {
	if (file.indexOf("app/lib/") > -1) {
		return false;
	}
	return file.indexOf("/lib/") > -1;
}

function isViewFile(file: string): boolean {
	let viewRegex = /erb$|haml$|slim$/;
	return (file.match(viewRegex) != null);
}

function isViewSpec(file: string): boolean {
	let viewRegex = /(.erb|.haml|.slim)_spec.rb$/;
	return (file.match(viewRegex) != null);
}

function viewCodeToSpec(file: string): Match {
	if (isViewFile(file)) {
		let viewSpec = file
			.replace("/app/", "/spec/")
			.replace(".haml", ".haml_spec.rb")
			.replace(".erb", ".erb_spec.rb")
			.replace(".slim", ".slim_spec.rb");

		return R.Ok([viewSpec]);
	} else {
		return NO_MATCH;
	}
}

function viewSpecToCode(file: string): Match {
	if (isViewSpec(file)) {
		let viewFile = file
			.replace("_spec.rb", "")
			.replace("/spec", "/app");

		return R.Ok([viewFile]);
	} else {
		return NO_MATCH;
	}
}

function controllerCodeToSpec(file: string): Match {
	if (isControllerCode(file)) {
		let controllerFile = pipe(file, switchToSpecDir, addSpecExtension);
		let requestFile = controllerFile.replace("/controllers/", "/requests/");

		return R.Ok([requestFile, controllerFile]);
	} else {
		return NO_MATCH;
	}
}

function controllerSpecToCode(file: string): Match {
	let isController = isControllerSpec(file);

	if (isController) {
		let controllerFile = pipe(
			file,
			removeSpecExtension,
			switchToAppDir
		).replace("/requests/", "/controllers/");

		return R.Ok([controllerFile]);
	} else {
		return NO_MATCH;
	}
}

function libRootCodeToSpec(file: string): Match {
	if (isRootLibCode(file)) {
		let libSpecFile = pipe(
			file,
			addSpecExtension,
		).replace("/lib/", "/spec/lib/");

		return R.Ok([libSpecFile]);
	} else {
		return NO_MATCH;
	}
}

function libSpecToCode(file: string): Match {
	let isLib = file.indexOf("/spec/lib/") > -1;

	if (isLib) {
		let libRootFile = removeSpecExtension(file)
			.replace("/spec/lib/", "/lib/");

		let libAppFile = pipe(
			file,
			switchToAppDir,
			removeSpecExtension,
		);

		return R.Ok([
			libRootFile,
			libAppFile,
		]);
	} else {
		return NO_MATCH;
	}
}

function genericCodeToSpec(file: string): Match {
	let specFile = pipe(
		file,
		switchToSpecDir,
		addSpecExtension,
	);

	return R.Ok([specFile]);
}

function genericSpecToCode(file: string): Match {
	let codeFile = pipe(
		file,
		switchToAppDir,
		removeSpecExtension,
	);

	return R.Ok([codeFile]);
}