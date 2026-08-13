import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
    vi.useRealTimers();
});

beforeEach(() => {
    if (!window.matchMedia) {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    }
});

// Radix UI primitives (Select, DropdownMenu) rely on browser APIs jsdom
// doesn't implement; stub them so interactions don't throw.
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
}
if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
}
