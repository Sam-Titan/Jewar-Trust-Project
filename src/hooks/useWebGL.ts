function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const supported = detectWebGL();

/** Same answer as useWebGL(), for code outside React. */
export const webglSupported = supported;

export function useWebGL() {
  return supported;
}
