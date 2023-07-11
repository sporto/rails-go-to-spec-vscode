// For any given file return a list of possible matches
export function getRelated(file: string): string[] {
	if (isSpec(file)) {
		return specToCode(file);
	} else {
		return codeToSpec(file);
	}
}

export function isSpec(file: string): boolean {
	return file.indexOf("_spec.rb") > -1;
}

function codeToSpec(file: string): string[] {
	const withSpecExt = addSpecExtension(file);
	return switchToSpecDir(withSpecExt);
}

function specToCode(file: string): string[] {
	const withoutSpecExt = removeSpecExtension(file);
	return switchToCodeDir(withoutSpecExt);
}

function switchToSpecDir(file: string): string[] {
	if (file.startsWith("/app/controllers/")) {
		return [
			file.replace("/app/controllers/", "/spec/requests/"),
			file.replace("/app/controllers/", "/spec/controllers/"),
		];
	} else if (file.startsWith("/app/")) {
		return [
			file.replace("/app/", "/spec/"),
		];
	} else {
		return [
			`/spec${file}`
		];
	}
}

function switchToCodeDir(file: string): string[] {
	if (file.startsWith("/spec/config/initializers/")) {
		return [
			file.replace("/spec/", "/"),
		];
	} else if (file.startsWith("/spec/lib/")) {
		return [
			file.replace("/spec/", "/"),
			file.replace("/spec/", "/app/"),
		];
	} else if (file.startsWith("/spec/requests/")) {
		return [
			file.replace("/spec/requests/", "/app/controllers/"),
		];
	} else {
		return [
			file.replace("/spec/", "/app/"),
		];
	}
}

function isViewFile(file: string): boolean {
	const viewRegex = /.erb$|.haml$|.slim$/;
	return viewRegex.test(file);
}

function addSpecExtension(file: string): string {
	if (isViewFile(file)) {
		return file
			.replace(".erb", ".erb_spec.rb")
			.replace(".haml", ".haml_spec.rb")
			.replace(".slim", ".slim_spec.rb");
	} else {
		return file.replace(".rb", "_spec.rb");
	}
}

function removeSpecExtension(file: string): string {
	return file
		.replace(".erb_spec.rb", ".erb")
		.replace(".haml_spec.rb", ".haml")
		.replace(".slim_spec.rb", ".slim")
		.replace("_spec.rb", ".rb");
}