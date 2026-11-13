import test from "node:test";
import assert from "node:assert/strict";
import { formatTime, parseSubtitle, parseTimestamp } from "../subtitle-parser.js";

test("parses SRT timestamps with comma milliseconds", () => {
  assert.deepEqual(parseSubtitle("1\\n00:00:01,250 --> 00:00:02,500\\n안녕하세요."), [
    { start: 1.25, end: 2.5, text: "안녕하세요." }
  ]);
});

test("parses WebVTT header, cue settings, and short timestamps", () => {
  assert.deepEqual(parseSubtitle("WEBVTT\\n\\n00:01.000 --> 00:03.250 align:start\\nHello"), [
    { start: 1, end: 3.25, text: "Hello" }
  ]);
});

test("removes inline tags and decodes common and numeric entities", () => {
  assert.deepEqual(parseSubtitle("00:00:01.000 --> 00:00:02.000\\n<b>A &amp; B</b> &lt;ok&gt; &#44032; &#xB098;"), [
    { start: 1, end: 2, text: "A & B <ok> 가 나" }
  ]);
});

test("handles UTF-8 BOM and Windows line endings", () => {
  assert.deepEqual(parseSubtitle("\\uFEFFWEBVTT\\r\\n\\r\\n00:00:01.000 --> 00:00:02.000\\r\\n한글"), [
    { start: 1, end: 2, text: "한글" }
  ]);
});

test("sorts cues by start time", () => {
  const result = parseSubtitle("00:00:03.000 --> 00:00:04.000\\n뒤\\n\\n00:00:01.000 --> 00:00:02.000\\n앞");
  assert.deepEqual(result.map(cue => cue.text), ["앞", "뒤"]);
});

test("keeps overlapping cues and rejects invalid or zero-length cues", () => {
  const result = parseSubtitle([
    "00:00:01.000 --> 00:00:03.000\\n첫째",
    "00:00:02.000 --> 00:00:04.000\\n겹침",
    "00:00:04.000 --> 00:00:04.000\\n길이 없음",
    "00:99:01.000 --> 00:99:02.000\\n잘못된 분"
  ].join("\\n\\n"));
  assert.deepEqual(result.map(cue => cue.text), ["첫째", "겹침"]);
});

test("rejects malformed timestamps and unsafe hour overflow", () => {
  assert.equal(parseTimestamp("00:60.000"), null);
  assert.equal(parseTimestamp("00:00:60.000"), null);
  assert.equal(parseTimestamp("999999999999999999999:00:00.000"), null);
  assert.equal(parseTimestamp("not-a-time"), null);
});

test("formats times with and without hours", () => {
  assert.equal(formatTime(65.9), "01:05");
  assert.equal(formatTime(3661), "01:01:01");
  assert.equal(formatTime(-3), "00:00");
});
