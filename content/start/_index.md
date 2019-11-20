---
title: "Getting Started"
pre: "<i class='fas fa-chevron-right'></i>  "
date:  2019-09-10T15:21:15+02:00
weight: 1
---
hello
{{< highlight typescript >}}

(async () => { // 1
const testCase = new TestCase(); // 2
try {
// actual test code goes here
} catch (e) {
await testCase.handleException(e); // 3
} finally {
await testCase.saveResult(); // 4
}
})().then(done); // 5

{{< /highlight >}}

