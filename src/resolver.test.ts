// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
//import * as vscode from 'vscode';
import * as resolver from "./resolver";

var testCases = [
  ["/app/something/foo.test.js", "/app/something/foo.js"],
  ["/src/component/foo.test.js", "/src/component/foo.js"]
];

test("isSpec", () => {
  var testCases = [
    ["/src/foo/something.test.js", true],
    ["/src/foo/something.test.jsx", true],
    ["/src/foo/something.spec.js", true],
    ["/src/foo/something.js", false],
    ["/foo/something.js", false]
  ];
  expect.assertions(testCases.length);

  testCases.forEach(function(testCase) {
    var file = testCase[0];
    var expected = testCase[1];
    var res = resolver.isSpec(file);
    expect(res).toEqual(expected);
  });
});

test("specToCode", () => {
  expect.assertions(testCases.length);

  testCases.forEach(function(testCase) {
    var file = testCase[0];
    var expected = testCase[1];
    var res = resolver.specToCode(file);
    expect(res).toEqual(expected);
  });
});

test("codeToSpec", () => {
  expect.assertions(testCases.length);

  testCases.forEach(function(testCase) {
    var file = testCase[1];
    var expected = testCase[0];
    var res = resolver.codeToSpec(file);
    expect(res).toEqual(expected);
  });
});
