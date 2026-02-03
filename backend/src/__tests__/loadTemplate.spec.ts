import { expect, test, vi, describe, beforeEach } from "vitest";
import fs from "fs/promises";
import path from "path";

import { loadTemplate, clearTemplateCache } from "../utils/loadTemplate";

vi.mock("fs/promises");

describe("loadTemplate Utility", () => {
  const mockPath = "/path/to/fake/template.txt";
  const mockContent = "Mocked template content";

  beforeEach(() => {
    vi.clearAllMocks();
    clearTemplateCache();
  });

  test("must read the file from disk on the first call and cache the result", async () => {
    vi.mocked(fs.readFile).mockResolvedValue(mockContent);

    const result1 = await loadTemplate(mockPath);

    expect(result1).toBe(mockContent);
    expect(fs.readFile).toHaveBeenCalledTimes(1);
    expect(fs.readFile).toHaveBeenCalledWith(path.resolve(mockPath), "utf-8");

    const result2 = await loadTemplate(mockPath);

    expect(result2).toBe(mockContent);

    expect(fs.readFile).toHaveBeenCalledTimes(1);
  });

  test("must throw an error if the file cannot be read", async () => {
    const fsError = new Error("ENOENT: no such file");
    vi.mocked(fs.readFile).mockRejectedValue(fsError);

    await expect(loadTemplate(mockPath)).rejects.toThrow(
      `Could not load prompt template at: ${path.resolve(
        mockPath
      )}. Details: ENOENT: no such file`
    );
  });
});
