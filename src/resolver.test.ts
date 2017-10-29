//import * as assert from 'assert';
import test from "ava";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as resolver from "./resolver";

var testCases = {
  spec: [
    ["/spec/something/foo_spec.rb", "/app/something/foo.rb"],
    [
      "/spec/views/namespace/users/_something.html.erb_spec.rb",
      "/app/views/namespace/users/_something.html.erb"
    ],
    [
      "/spec/views/namespace/users/something.html.haml_spec.rb",
      "/app/views/namespace/users/something.html.haml"
    ],
    ["/spec/lib/something/foo_spec.rb", "/lib/something/foo.rb"],
  ],
  test: [
    ["/test/something/foo_test.rb", "/app/something/foo.rb"],
    [
      "/test/views/namespace/users/_something.html.erb_test.rb",
      "/app/views/namespace/users/_something.html.erb"
    ],
    [
      "/test/views/namespace/users/something.html.haml_test.rb",
      "/app/views/namespace/users/something.html.haml"
    ],
    ["/test/lib/something/foo_test.rb", "/lib/something/foo.rb"]
  ]
};

test("isSpec", t => {
  var testCases = [
    ["/spec/foo/something_spec.rb", true],
    ["/spec/views/something.html.erb_spec.rb", true],
    ["/app/foo/something.rb", false],
    ["/spec/views/something.html.erb.rb", false],
    ["/test/foo/something_test.rb", true],
    ["/test/views/something.html.erb_test.rb", true],
    ["/test/views/something.html.erb.rb", false]
  ];
  t.plan(testCases.length);

  testCases.forEach(function(testCase) {
    var file = testCase[0];
    var expected = testCase[1];
    var res = resolver.isSpec(file);
    t.is(res, expected);
  });
});

test("specToCode", t => {
  t.plan(testCases.spec.length + testCases.test.length);

  testCases.spec.forEach(function(testCase) {
    var file = testCase[0];
    var expected = testCase[1];
    var res = resolver.specToCode(file);
    t.is(res, expected);
  });

  testCases.test.forEach(function(testCase) {
    var file = testCase[0];
    var expected = testCase[1];
    var res = resolver.specToCode(file);
    t.is(res, expected);
  });
});

test("codeToSpec", t => {
  t.plan(testCases.spec.length + testCases.test.length);

  // TODO: tried pulling in Sinon to stub resolver._specDirExists(), but kept getting "cannont find module sinon"
  testCases.spec.forEach(function(testCase) {
    var file = testCase[1];
    var expected = testCase[0];
    var res = resolver.codeToSpec(file);
    t.is(res, expected);
  });

  testCases.test.forEach(function(testCase) {
    var file = testCase[1];
    var expected = testCase[0];
    var res = resolver.codeToSpec(file);
    t.is(res, expected);
  });
});
