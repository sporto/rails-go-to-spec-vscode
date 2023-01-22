import * as assert from "assert";

// You can import and use all API from the "vscode" module
// as well as import your extension to test it
//import * as vscode from "vscode";
import * as resolver from "./resolver";

suite("resolver", () => {
	test("isSpec", (t) => {
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
		]
		// t.plan(testCases.length);

		testCases.forEach(function (testCase) {
			let file = testCase[0];
			let expected = testCase[1];
			let res = resolver.isSpec(file);
			assert.strictEqual(res, expected);
		});
	});

	test("isControllersOrRequests", (t) => {
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

		]
		// t.plan(testCases.length);

		testCases.forEach(function (testCase) {
			let file = testCase[0];
			let expected = testCase[1];
			let res = resolver.isControllersOrRequests(file);
			assert.strictEqual(res, expected);
		});
	});

	test("getControllersRelated", (t) => {
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

		// t.plan(testCases.length);

		testCases.forEach(function (testCase) {
			let file = testCase[0];
			let expected = testCase[1];
			let res = resolver.getControllersRelated(file);
			assert.strictEqual(res, expected);
		});
	});

	let twoWayTestCases = [
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
			"/spec/lib/something/foo_spec.rb",
			"/lib/something/foo.rb",
		],
	]

	test("specToCode", (t) => {
		// t.plan(twoWayTestCases.length);

		twoWayTestCases.forEach(function (testCase) {
			let file = testCase[0];
			let expected = testCase[1];
			let res = resolver.specToCode(file);
			assert.strictEqual(res, expected);
		});
	});

	test("codeToSpec", (t) => {
		// t.plan(twoWayTestCases.length);

		twoWayTestCases.forEach(function (testCase) {
			let file = testCase[1];
			let expected = testCase[0];
			let res = resolver.codeToSpec(file);
			assert.strictEqual(res, expected);
		});
	});
})
