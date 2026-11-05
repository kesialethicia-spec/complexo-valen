import { describe, expect, test } from "bun:test";
import { createVideoPlayTracker, videoEventParameters } from "./institutional-video";
import { parseVideoConsent } from "./video-consent";

describe("institutional video tracking", () => {
  test("reports the official ID and distinct page parameter", () => {
    expect(videoEventParameters("home")).toEqual({ pagina: "home", video_id: "rRdO0BrGE78", video_titulo: "institucional_grupo_valen", origem: "youtube_embed" });
    expect(videoEventParameters("o_valen").pagina).toBe("o_valen");
  });
  test("does not fire for loading, thumbnail, pause or buffering", () => {
    const calls = [];
    const track = createVideoPlayTracker("home", () => true, (...args) => calls.push(args));
    [-1, 0, 2, 3, 5].forEach(track);
    expect(calls.length).toBe(0);
  });
  test("fires once on effective play, not again after pause and resume", () => {
    const calls = [];
    const track = createVideoPlayTracker("home", () => true, (...args) => calls.push(args));
    [1, 2, 1, 3, 1].forEach(track);
    expect(calls).toEqual([["event", "play_video_institucional", videoEventParameters("home")]]);
  });
  test("denied analytics never emits even if consent changes during the same playback", () => {
    let allowed = false;
    const calls = [];
    const track = createVideoPlayTracker("o_valen", () => allowed, (...args) => calls.push(args));
    track(1); allowed = true; track(2); track(1);
    expect(calls.length).toBe(0);
  });
  test("missing, invalid and denied preferences are not permission", () => {
    [null, "not-json", '{"analytics":false,"marketing":false}', '{"analytics":"true"}'].forEach((value) => {
      expect(parseVideoConsent(value).analytics).toBe(false);
      expect(parseVideoConsent(value).marketing).toBe(false);
    });
  });
  test("analytics and third-party consent remain independent", () => {
    expect(parseVideoConsent('{"analytics":true,"marketing":false}')).toEqual({ analytics: true, marketing: false });
  });
});