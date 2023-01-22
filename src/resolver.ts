export function getRelated(file: string): string {
	if (isSpec(file)) {
		return specToCode(file);
	} else {
		return codeToSpec(file);
	}
}

export function getControllersRelated(file: string) {
	file = convertControllersOrRequestsPath(file);
	return getRelated(file);
}

export function isSpec(file: string): boolean {
	return file.indexOf("_spec.rb") > -1;
}

export function isControllersOrRequests(file: string): boolean {
	return file.indexOf("app/controllers") > -1 || file.indexOf("spec/requests") > -1;
}

function convertControllersOrRequestsPath(file: string): string {
	let isControllerFile = file.match("app/controllers");
	if (isControllerFile) {
		return file.replace("/app/controllers/", "/app/requests/").replace("_controller.rb", ".rb");
	}

	let isRequestSpecFile = file.match("spec/requests");
	if (isRequestSpecFile) {
		return file.replace("/spec/requests/", "/spec/controllers/").replace("_spec.rb", "_controller_spec.rb");
	}

	return file;
}

export function codeToSpec(file: string): string {
	let viewRegex = /erb$|haml$|slim$/;
	let isViewFile = file.match(viewRegex);

	if (isViewFile) {
		return file
			.replace("/app/", "/spec/")
			.replace(".haml", ".haml_spec.rb")
			.replace(".erb", ".erb_spec.rb")
			.replace(".slim", ".slim_spec.rb");
	}

	file = file.replace(".rb", "_spec.rb");

	let isLibFile = file.indexOf("/lib/") > -1;
	if (isLibFile) {
		return file.replace("/lib/", "/spec/lib/");
	}

	return file.replace("/app/", "/spec/");
}

export function specToCode(file: string): string {
	let viewRegex = /(.erb|.haml|.slim)_spec.rb$/;

	let isViewFile = file.match(viewRegex);
	if (isViewFile) {
		return file
			.replace("_spec.rb", "")
			.replace("/spec", "/app");
	}

	file = file.replace("_spec.rb", ".rb");

	let isLibFile = file.indexOf("/spec/lib/") > -1;
	if (isLibFile) {
		return file.replace("/spec/lib/", "/lib/");
	}

	return file.replace("/spec/", "/app/");
}