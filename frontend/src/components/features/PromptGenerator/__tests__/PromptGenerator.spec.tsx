import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PromptGenerator from "../index";
import * as promptService from "../../../../services/promptService";

// Service mock

vi.mock("../../../../services/promptService", () => ({
  generateSuggestions: vi.fn(),
  refinePrompt: vi.fn(),
}));

describe("PromptGenerator Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the initial state correctly", () => {
    render(<PromptGenerator />);

    expect(
      screen.getByText("Intelligent Prompt Generator")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Escreva a sua ideia")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Gere o esquema do prompt/i })
    ).toBeInTheDocument();
  });

  it("should call the API and display suggestions when the user clicks generate", async () => {
    const mockSuggestions = {
      role: ["Expert Developer", "Tech Lead"],
      objective: ["Create a test suite", "Debug the app"],
      audience: ["Junior Devs", "Senior Devs"],
      style: ["Technical", "Didactic"],
      outputFormat: ["Code block", "Tutorial"],
    };

    vi.mocked(promptService.generateSuggestions).mockResolvedValue(
      mockSuggestions
    );

    render(<PromptGenerator />);

    const input = screen.getByPlaceholderText("Escreva a sua ideia");
    fireEvent.change(input, { target: { value: "Testar minha app" } });

    const button = screen.getByRole("button", {
      name: /gere o esquema do prompt/i,
    });
    fireEvent.click(button);

    expect(promptService.generateSuggestions).toHaveBeenCalledWith(
      "Testar minha app"
    );

    await waitFor(() => {
      expect(screen.getByText("Papel (Role)")).toBeInTheDocument();

      expect(
        screen.queryByText(/Digite uma ideia no campo acima/i)
      ).not.toBeInTheDocument();
    });
  });
});
