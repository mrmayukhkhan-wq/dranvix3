const tokenMap = {
  brand: "--brand",
  danger: "--danger",
  warn: "--warn",
  safe: "--safe",
  density: "--control-h",
};

export function applyTheme(settings) {
  Object.entries(settings).forEach(([key, value]) => {
    const token = tokenMap[key];
    if (!token) return;
    document.documentElement.style.setProperty(
      token,
      key === "density" ? `${value}px` : value
    );
  });
}
