// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      optimize: { minify: false },
    },
  },
};

export default config;
