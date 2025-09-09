module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' }, // Making sure the compatibility with current Node version
      },
    ],
  ],
};
