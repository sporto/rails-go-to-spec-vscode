import { R } from "@mobily/ts-belt";
import * as assert from "assert";

import * as vscode from "vscode";
import * as resolver from "../../resolver";

type MatcherTestCase = {
	files: {
		code: string,
		specs: Array<string>,
	},
	shouldMatch: boolean,
};

const FILES = [
	// controllers
	{
		code: "/app/controllers/users_controller.rb",
		specs: [
			"/spec/requests/users_controller_spec.rb",
			"/spec/controllers/users_controller_spec.rb",
		],
	},
	{
		code: "/app/controllers/clients/users_controller.rb",
		specs: [
			"/spec/requests/clients/users_controller_spec.rb",
			"/spec/controllers/clients/users_controller_spec.rb",
		],
	},
	// lib
	{
		code: "/lib/something/foo.rb",
		specs: [
			"/spec/lib/something/foo_spec.rb",
		],
	},
	// models
	{
		code: "/app/models/user.rb",
		specs: [
			"/spec/models/user_spec.rb",
		],
	},
	// views
	{
		code:  "/app/views/namespace/users/_show.html.erb",
		specs: [
			"/spec/views/namespace/users/_show.html.erb_spec.rb",
		],
	},
	{
		code:  "/app/views/namespace/users/_show.html.haml",
		specs: [
			"/spec/views/namespace/users/_show.html.haml_spec.rb",
		],
	},
];

suite("Extension Test Suite", () => {
	vscode.window.showInformationMessage("Start all tests.");

	test("isSpec", (done) => {
		let testCases: Array<[string, boolean]> = [
			[
				"/spec/foo/something_spec.rb",
				true,
			],
			[
				"/spec/views/something.html.erb_spec.rb",
				true,
			],
			[
				"/app/foo/something.rb",
				false,
			],
			[
				"/spec/views/something.html.erb.rb",
				false,
			]
		];

		testCases.forEach(function (testCase) {
			let file = testCase[0];
			let expected = testCase[1];
			let res = resolver.isSpec(file);
			assert.strictEqual(res, expected);
		});

		done();
	});

	test("getRelated", (done) => {
		FILES.forEach(function (files) {
			let file = files.code;
			let specs = files.specs;

			// Each file should resolve to an array of potential spec files
			let resolvedSpecs = resolver.getRelated(file);
			let expectedSpecs = R.Ok(specs);

			assert.deepStrictEqual(resolvedSpecs, expectedSpecs);

			// Then each spec should resolve back to the source code
			specs.forEach(function (spec: string) {
				let resolvedCode = resolver.getRelated(spec);
				let expectedCode = R.Ok([file]);

				assert.deepStrictEqual(resolvedCode, expectedCode);
			});
		});

		done();
	});
});
