import * as assert from "assert";

import * as vscode from "vscode";
import * as resolver from "../../resolver";

suite("Extension Test Suite", () => {
	vscode.window.showInformationMessage("Start all tests.");

	suite("resolver", () => {
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

		test("isControllersOrRequests", (done) => {
			let testCases: Array<[string, boolean]> = [
				[
					"/spec/foo/something_spec.rb",
					false,
				],
				[
					"/spec/views/something.html.erb_spec.rb",
					false,
				],
				[
					"/app/foo/something.rb",
					false,
				],
				[
					"/spec/views/something.html.erb.rb",
					false,
				],
				[
					"/app/controllers/something_controller.rb",
					true,
				],
				[
					"/spec/requests/something_spec.rb",
					true,
				]
			];

			testCases.forEach(function (testCase) {
				let file = testCase[0];
				let expected = testCase[1];
				let res = resolver.isControllersOrRequests(file);
				assert.strictEqual(res, expected);
			});

			done();
		});

		test("getControllersRelated", (done) => {
			let testCases = [
				[
					"/app/controllers/something/something_controller.rb",
					"/spec/requests/something/something_spec.rb",
				],
				[
					"/spec/requests/something/something_spec.rb",
					"/app/controllers/something/something_controller.rb",
				],
			];

			testCases.forEach(function (testCase) {
				let file = testCase[0];
				let expected = testCase[1];
				let res = resolver.getControllersRelated(file);
				assert.strictEqual(res, expected);
			});

			done();
		});

		let roundtripCases = [
			[
				"/spec/something/foo_spec.rb",
				"/app/something/foo.rb",
			],
			[
				"/spec/views/namespace/users/_something.html.erb_spec.rb",
				"/app/views/namespace/users/_something.html.erb",
			],
			[
				"/spec/views/namespace/users/something.html.haml_spec.rb",
				"/app/views/namespace/users/something.html.haml",
			],
			[
				"/spec/controllers/users_controller_spec.rb",
				"/app/controllers/users_controller.rb",
			],
			[
				"/spec/lib/something/foo_spec.rb",
				"/lib/something/foo.rb",
			],
		];

		test("specToCode", (done) => {
			roundtripCases.forEach(function (testCase) {
				let file = testCase[0];
				let expected = testCase[1];
				let res = resolver.specToCode(file);
				assert.strictEqual(res, expected);
			});

			done();
		});

		test("codeToSpec", (done) => {
			roundtripCases.forEach(function (testCase) {
				let file = testCase[1];
				let expected = testCase[0];
				let res = resolver.codeToSpec(file);
				assert.strictEqual(res, expected);
			});

			done();
		});
	});
});
