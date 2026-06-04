export function formatMath(text: string): string {
  return text
    // Exponents: 10^6 → $10^{6}$, x^2 → $x^{2}$
    .replace(/([A-Za-z0-9]+)\^(-?[A-Za-z0-9]+)/g, "$$$1^{$2}$$$")
    // Square roots: sqrt(x) → $\sqrt{x}$
    .replace(/sqrt\(([^)]+)\)/g, "$$$\\sqrt{$1}$$$")
    // Fractions implied by division: a/b where a,b are variables/numbers
    .replace(/([A-Za-z0-9_{}]+)\s*\/\s*([A-Za-z0-9_{}]+)/g, "$$$\\frac{$1}{$2}$$$")
    // Multiplication asterisk: a * b → $a \times b$
    .replace(/([A-Za-z0-9]+)\s*\*\s*([A-Za-z0-9]+)/g, "$$$1 \\times $2$$$")
    // Scientific notation: 6.37 x 10^6 → $6.37 \times 10^{6}$
    .replace(/(\d+\.?\d*)\s*x\s*10\^(-?\d+)/g, "$$$1 \\times 10^{$2}$$$")
    // Greek letters
    .replace(/\bR_E\b/g, "$R_{E}$")
    .replace(/\balpha\b/g, "$\\alpha$")
    .replace(/\bomega\b/g, "$\\omega$")
    .replace(/\btheta\b/g, "$\\theta$")
    .replace(/\blambda\b/g, "$\\lambda$")
    // Subscripts: R_E, v_0 etc
    .replace(/([A-Za-z])_([A-Za-z0-9]+)/g, "$$$1_{$2}$$$");
}