import path from 'path';

const getRootDir = () => {
  return path.resolve(process.cwd(), '../..');
};

const getMockPath = (pathString: string) => {
  return path.join(getRootDir(), 'packages/testing-config/src/mocks', pathString);
};

const getTestingConfigPath = (pathString: string) => {
  const distDir = path.resolve(__dirname, '..', 'dist');
  const jsFilename = pathString.replace(/\.ts$/, '.js');
  return path.resolve(distDir, jsFilename);
};

export { getRootDir, getMockPath, getTestingConfigPath };
