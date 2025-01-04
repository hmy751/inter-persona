import path from "path";

const getRootDir = () => {
  return path.resolve(process.cwd(), '../..')
}

const getTestingConfigPath = (pathString: string) => {
  return path.join(getRootDir(), 'packages/testing-config', pathString)
}

export { getRootDir, getTestingConfigPath }