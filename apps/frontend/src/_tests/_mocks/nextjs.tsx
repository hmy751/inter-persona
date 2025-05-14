/**
 * next/navigation mock
 */
export const mockRouterPush = jest.fn();
export const mockRouterReplace = jest.fn();
export const mockRouterRefresh = jest.fn();
export const mockRouterBack = jest.fn();

const mockParams = {};

export const setNextParamsMock = (params: Record<string, string>) => {
  Object.assign(mockParams, params);
};

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');
  return {
    __esModule: true,
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => {
      return {
        push: mockRouterPush,
        replace: mockRouterReplace,
        refresh: mockRouterRefresh,
        back: mockRouterBack,
      };
    }),
    useSearchParams: jest.fn().mockImplementation(() => {
      return new URLSearchParams(window.location.search);
    }),
    usePathname: jest.fn().mockImplementation(pathArg => {
      return pathArg;
    }),
    useParams: jest.fn().mockImplementation(() => mockParams),
  };
});

/**
 * next/image mock
 */
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

/**
 * next/head mock
 */
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => {
      return <>{children} </>;
    },
  };
});

/**
 * next/dynamic mock
 */
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (...props: { [key: string]: unknown }[]) => {
    const dynamicModule = jest.requireActual('next/dynamic');
    const dynamicActualComp = dynamicModule.default;
    const RequiredComponent = dynamicActualComp(props[0]);
    RequiredComponent.preload ? RequiredComponent.preload() : RequiredComponent.render.preload();
    return RequiredComponent;
  },
}));
