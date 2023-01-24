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

function testMatcher(matcher: resolver.Matcher, testCases: Array<MatcherTestCase>): void {
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

			testMatcher(resolver.viewCodeToSpec, testCases);

			done();
		});

		test("viewSpecToCode", (done) => {
			let testCases = [
				{
					file: "/spec/models/user_spec.rb",
					expected: resolver.NO_MATCH,
				},
				{
					file: "/spec/views/namespace/users/_something.html.erb_spec.rb",
					expected: R.Ok([
						"/app/views/namespace/users/_something.html.erb",
					]),
				},
				{
					file: "/spec/views/namespace/users/something.html.haml_spec.rb",
					expected: R.Ok([
						"/app/views/namespace/users/something.html.haml",
					]),
				},
			];

			testCases.forEach(function (testCase) {
				let actual = resolver.viewSpecToCode(testCase.file);
				assert.deepStrictEqual(actual, testCase.expected);
			});

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

			testCases.forEach(function (testCase) {
				let file = testCase.files.code;
				let specs = testCase.files.specs;
				let actual = resolver.controllerCodeToSpec(file);

				let expected = testCase.shouldMatch
					? R.Ok(specs)
					: resolver.NO_MATCH

				assert.deepStrictEqual(actual, expected);
			});

			done();
		});

		test("controllerSpecToCode", (done) => {
			let testCases = [
				{
					file: "/spec/models/user_spec.rb",
					expected: resolver.NO_MATCH,
				},
				{
					file: "/spec/requests/users_controller_spec.rb",
					expected: R.Ok([
						"/app/controllers/users_controller.rb",
					]),
				},
				{
					file: "/spec/controllers/users_controller_spec.rb",
					expected: R.Ok([
						"/app/controllers/users_controller.rb",
					]),
				},
				{
					file: "/spec/requests/clients/users_controller_spec.rb",
					expected: R.Ok([
						"/app/controllers/clients/users_controller.rb",
					]),
				},
			];

			testCases.forEach(function (testCase) {
				let actual = resolver.controllerSpecToCode(testCase.file);
				assert.deepStrictEqual(actual, testCase.expected);
			});

			done();
		});

		test("libCodeToSpec", (done) => {
			let testCases = [
				{
					file: "/app/models/user.rb",
					expected: resolver.NO_MATCH,
				},
				{
					file: "/lib/something/foo.rb",
					expected: R.Ok([
						"/spec/lib/something/foo_spec.rb",
					]),
				},
			];

			testCases.forEach(function (testCase) {
				let actual = resolver.libCodeToSpec(testCase.file);
				assert.deepStrictEqual(actual, testCase.expected);
			});

			done();
		});

		test("libSpecToCode", (done) => {
			let testCases = [
				{
					file: "/spec/models/user_spec.rb",
					expected: resolver.NO_MATCH,
				},
				{
					file: "/spec/lib/something/foo_spec.rb",
					expected: R.Ok([
						"/lib/something/foo.rb",
					]),
				},
			];

			testCases.forEach(function (testCase) {
				let actual = resolver.libSpecToCode(testCase.file);
				assert.deepStrictEqual(actual, testCase.expected);
			});

			done();
		});

		let roundtripCases = [
			{
				code: "/app/something/foo.rb",
				spec: "/spec/something/foo_spec.rb",
			},
			{
				code: "/app/views/namespace/users/_something.html.erb",
				spec: "/spec/views/namespace/users/_something.html.erb_spec.rb",
			},
			{
				code: "/app/views/namespace/users/something.html.haml",
				spec: "/spec/views/namespace/users/something.html.haml_spec.rb",
			},
			{
				code: "/app/controllers/users_controller.rb",
				spec: "/spec/request/users_controller_spec.rb",
			},
			{
				code: "/lib/something/foo.rb",
				spec: "/spec/lib/something/foo_spec.rb",
			},
		];

		test("codeToSpec", (done) => {
			let testCases = [
				{
					code: "/app/models/user.rb",
					spec: R.Ok(["/spec/models/user_spec.rb"]),
				},
			];

			testCases.forEach(function (testCase) {
				let res = resolver.codeToSpec(testCase.code);
				assert.deepStrictEqual(res, testCase.spec);
			});

			done();
		});

		test("specToCode", (done) => {
			let testCases = [
				{
					spec: "/spec/models/user_spec.rb",
					code: R.Ok(["/app/models/user.rb"]),
				},
			];

			testCases.forEach(function (testCase) {
				let res = resolver.specToCode(testCase.spec);
				assert.deepStrictEqual(res, testCase.code);
			});

			done();
		});
	});
});
