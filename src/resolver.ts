import * as path from "path";
import * as fs from "fs";

export function getRelated(file) {
	if (isSpec(file)) {
		return specToCode(file);
	} else {
		return codeToSpec(file);
	}
}

export function isSpec(file) {
	return file.indexOf('_spec.rb') > -1 || file.indexOf('_test.rb') > -1;
}

function _specDirExists() {
	try {
		fs.statSync(path.resolve("./spec")).isDirectory();
	} catch (e) {
		if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
	}
}

export function codeToSpec(file) {
	var specType = _specDirExists() ? "spec" : "test";

	var viewRegex = /erb$|haml$|slim$/;
	var isViewFile = file.match(viewRegex);

	if (isViewFile) {
		return file
			.replace('/app/', `/${specType}/`)
			.replace('.haml', `.haml_${specType}.rb`)
			.replace('.erb', `.erb_${specType}.rb`)
			.replace('.slim', `.slim_${specType}.rb`);
	}

	file = file.replace('.rb', `_${specType}.rb`);

	var isLibFile = file.indexOf('/lib/') > -1;
	if (isLibFile) {
		return file.replace('/lib/', `/${specType}/lib/`);
	}

	return file.replace('/app/', `/${specType}/`);
}

export function specToCode(file: string) {
	var specType = file.match(/(spec|test).rb$/)[1];

	var viewRegex = /(.erb|.haml|.slim)_(spec|test).rb$/;
	var isViewFile = file.match(viewRegex);
	if (isViewFile) {
		return file
			.replace(`_${specType}.rb`, '')
			.replace(`/${specType}`, '/app');
	}

	file = file.replace(`_${specType}.rb`, '.rb');

	var isLibFile = file.indexOf(`/${specType}/lib/`) > -1;
	if (isLibFile) {
		   return file.replace(`/${specType}/lib/`, '/lib/');
	}

	return file.replace(`/${specType}/`, '/app/');
}

