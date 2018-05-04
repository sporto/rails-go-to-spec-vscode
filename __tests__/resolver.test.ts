// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
//import * as vscode from 'vscode';
import * as resolver from "../src/resolver";

var testCases = [
  ["/app/something/foo.test.js", "/app/something/foo.js"],
  ["/src/component/foo.test.js", "/src/component/foo.js"],
  ["/src/component/foo.test.jsx", "/src/component/foo.jsx"],
  ["/src/component/foo.test.ts", "/src/component/foo.ts"],
  ["/src/component/foo.test.tsx", "/src/component/foo.tsx"]
];

test("isSpec", () => {
  var testCases = [
    ["/src/foo/something.test.js", true],
    ["/src/foo/something.test.ts", true],
    ["/src/foo/something.test.jsx", true],
    ["/src/foo/something.spec.js", true],
    ["/src/foo/something.spec.ts", true],
    ["/src/foo/something.js", false],
    ["/src/foo/something.ts", false],
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
