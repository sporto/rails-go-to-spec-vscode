import { R } from "@mobily/ts-belt"
import * as assert from "assert";

import * as vscode from "vscode";
import * as resolver from "../../resolver";

type MatcherTestCase = {
	files: {
		code: string,
		specs: Array<string>,
	},
	shouldMatch: boolean,
}

const FILES = {
	controllers: {
		users: {
			code: "/app/controllers/users_controller.rb",
			specs: [
				"/spec/requests/users_controller_spec.rb",
				"/spec/controllers/users_controller_spec.rb",
			],
		},
		clientUsers: {
			code: "/app/controllers/clients/users_controller.rb",
			specs: [
				"/spec/requests/clients/users_controller_spec.rb",
				"/spec/controllers/clients/users_controller_spec.rb",
			],
		}
	},
	lib: {
		thing: {
			code: "/lib/something/foo.rb",
			specs: [
				"/spec/lib/something/foo_spec.rb",
			],
		}
	},
	models: {
		user: {
			code: "/app/models/user.rb",
			specs: [
				"/spec/models/user_spec.rb",
			],
		}
	},
	views: {
		usersShow: {
			code:  "/app/views/namespace/users/_show.html.erb",
			specs: [
				"/spec/views/namespace/users/_show.html.erb_spec.rb",
			],
		},
		usersShowHaml: {
			code:  "/app/views/namespace/users/_show.html.haml",
			specs: [
				"/spec/views/namespace/users/_show.html.haml_spec.rb",
			],
		},
	},
}

function testCodeToSpecMatcher(matcher: resolver.Matcher, testCases: Array<MatcherTestCase>): void {
	testCases.forEach(function (testCase) {
		let file = testCase.files.code;
		let specs = testCase.files.specs;

		let actual = matcher(file);

		let expected = testCase.shouldMatch
			? R.Ok(specs)
			: resolver.NO_MATCH

		assert.deepStrictEqual(actual, expected);
	});
}

function testSpecToCodeMatcher(matcher: resolver.Matcher, testCases: Array<MatcherTestCase>): void {
	testCases.forEach(function (testCase) {
		let file = testCase.files.code;
		let specs = testCase.files.specs;

		specs.forEach(function (spec) {
			let actual = matcher(spec);

			let expected = testCase.shouldMatch
				? R.Ok([file])
				: resolver.NO_MATCH

			assert.deepStrictEqual(actual, expected);
		})
	});
}

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

		test("viewCodeToSpec", (done) => {
			let testCases = [
				{
					files: FILES.models.user,
					shouldMatch: false,
				},
				{
					files: FILES.views.usersShow,
					shouldMatch: true,
				},
				{
					files: FILES.views.usersShowHaml,
					shouldMatch: true,
				},
			];

			testCodeToSpecMatcher(resolver.viewCodeToSpec, testCases);

			done();
		});

		test("viewSpecToCode", (done) => {
			let testCases = [
				{
					files: FILES.models.user,
					shouldMatch: false,
				},
				{
					files: FILES.views.usersShow,
					shouldMatch: true,
				},
				{
					files: FILES.views.usersShowHaml,
					shouldMatch: true,
				},
			];

			testSpecToCodeMatcher(resolver.viewSpecToCode, testCases);

			done();
		});

		test("controllerCodeToSpec", (done) => {
			let testCases = [
				{
					files: FILES.models.user,
					shouldMatch: false,
				},
				{
					files: FILES.controllers.users,
					shouldMatch: true,
				},
				{
					files: FILES.controllers.clientUsers,
					shouldMatch: true,
				},
			];

			testCodeToSpecMatcher(resolver.controllerCodeToSpec, testCases);

			done();
		});

		test("controllerSpecToCode", (done) => {
			let testCases = [
				{
					files: FILES.models.user,
					shouldMatch: false,
				},
				{
					files: FILES.controllers.users,
					shouldMatch: true,
				},
				{
					files: FILES.controllers.clientUsers,
					shouldMatch: true,
				},
			];

			testSpecToCodeMatcher(resolver.controllerSpecToCode, testCases);

			done();
		});

		test("libCodeToSpec", (done) => {
			let testCases = [
				{
					files: FILES.models.user,
					shouldMatch: false,
				},
				{
					files: FILES.lib.thing,
					shouldMatch: true,
				},
			];

			testCodeToSpecMatcher(resolver.libCodeToSpec, testCases);

			done();
		});

		test("libSpecToCode", (done) => {
			let testCases = [
				{
					files: FILES.models.user,
					shouldMatch: false,
				},
				{
					files: FILES.lib.thing,
					shouldMatch: true,
				},
			];

			testSpecToCodeMatcher(resolver.libSpecToCode, testCases);

			done();
		});

		let allFiles = [
			FILES.controllers.clientUsers,
			FILES.controllers.users,
			FILES.lib.thing,
			FILES.models.user,
			FILES.views.usersShow,
			FILES.views.usersShowHaml,
		];

		test("codeToSpec", (done) => {
			let cases = allFiles.map(function (files) {
				return {
					files: files,
					shouldMatch: true,
				}
			})

			testCodeToSpecMatcher(resolver.codeToSpec, cases);

			done();
		});

		test("specToCode", (done) => {
			let cases = allFiles.map(function (files) {
				return {
					files: files,
					shouldMatch: true,
				}
			})

			testSpecToCodeMatcher(resolver.specToCode, cases);

			done();
		});
	});
});
