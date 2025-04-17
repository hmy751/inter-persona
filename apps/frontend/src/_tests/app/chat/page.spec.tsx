import { act, screen, waitFor } from "@testing-library/react";
import InterviewPage from "@/app/interview/[interviewId]/page";
import Layout from "@/app/interview/[interviewId]/layout";

import { renderWithProviders } from "@/_tests/_mocks/providers";
import { server } from "@/_mocks/server";
import { http } from "msw";
import { baseURL } from "@/_apis/fetcher";
import {
  ChatContentSpeakerType,
  ChatContentStatusType,
} from "@/_store/redux/type";
import { createIntegrationRecordingSetup } from "@/_tests/_utils/integrationRecordingTest";
import { setNextParamsMock } from "@/_tests/_mocks/nextjs";

const mockUser = {
  id: 1,
  imageSrc: "/assets/images/dev_profile.png",
};

jest.mock("@repo/store/useToastStore", () => {
  const addToastMock = jest.fn();

  const mockStore = {
    addToast: addToastMock,
  };

  const mockUseToastStore = () => mockStore;

  mockUseToastStore.getState = jest.fn(() => mockStore);

  return {
    __esModule: true,
    useToastStore: mockUseToastStore,
    default: mockUseToastStore,
  };
});

jest.mock("@/_store/zustand/useUserStore", () => ({
  __esModule: true,
  default: () => ({
    user: mockUser,
  }),
}));

describe("인터뷰 페이지 통합 테스트", () => {
  beforeEach(() => {
    setNextParamsMock({ interviewId: "1" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("인터뷰 시작 및 초기 상태", () => {
    it("인터뷰 시작시 초기 인사말이 표시된다", async () => {
      server.use(
        http.post(`${baseURL}/interview/1/contents/answer`, () => {
          return Response.json({
            content: "안녕하세요. 간단히 자기소개 부탁드립니다.",
          });
        })
      );

      renderWithProviders(
        <Layout>
          <InterviewPage params={{ interviewId: "1" }} />
        </Layout>
      );

      await waitFor(() => {
        expect(
          screen.getByText("안녕하세요. 간단히 자기소개 부탁드립니다.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("사용자 응답 프로세스", () => {
    it("녹음 후 STT 변환 및 AI 응답을 정상적으로 처리한다", async () => {
      server.use(
        http.post(`${baseURL}/interview/1/contents/answer`, () => {
          return Response.json({
            content: "안녕하세요. 간단히 자기소개 부탁드립니다.",
          });
        }),
        http.post("/api/interview", () => {
          return Response.json({ text: "안녕하세요, 저는 개발자입니다." });
        })
      );

      renderWithProviders(
        <Layout>
          <InterviewPage params={{ interviewId: "1" }} />
        </Layout>
      );

      await waitFor(() => {
        expect(
          screen.getByText("안녕하세요. 간단히 자기소개 부탁드립니다.")
        ).toBeInTheDocument();
        expect(
          screen.queryByText("안녕하세요, 저는 개발자입니다.")
        ).not.toBeInTheDocument();
      });

      const integrationSetup = createIntegrationRecordingSetup();
      integrationSetup.setupRequestAnimationFrame();

      await integrationSetup.triggerRecording();

      act(() => {
        integrationSetup.simulateRecordingFlow();
      });

      integrationSetup.cleanup();

      await waitFor(() => {
        expect(
          screen.getByText("안녕하세요, 저는 개발자입니다.")
        ).toBeInTheDocument();
      });
    });

    it("STT 변환 실패시 재시도 기능이 동작한다", async () => {
      server.use(
        http.post("/api/interview", () => {
          return Response.json({ text: "" });
        })
      );

      const { store } = renderWithProviders(
        <Layout>
          <InterviewPage params={{ interviewId: "1" }} />
        </Layout>
      );

      const integrationSetup = createIntegrationRecordingSetup();
      integrationSetup.setupRequestAnimationFrame();

      await integrationSetup.triggerRecording();

      act(() => {
        integrationSetup.simulateRecordingFlow();
      });

      integrationSetup.cleanup();

      await waitFor(() => {
        const state = store.getState();
        expect(state.chat.trySpeechCount).toBe(1);
      });
    });
  });

  describe("AI 응답 에러 처리", () => {
    it("AI 응답 실패시 재시도/취소 선택지를 표시한다", async () => {
      server.use(
        http.post("/api/interview", () => {
          return Response.json({ text: "안녕하세요, 저는 개발자입니다." });
        }),
        http.post(`${baseURL}/interview/1/contents/answer`, () => {
          return Response.json({
            content: "안녕하세요. 간단히 자기소개 부탁드립니다.",
          });
        })
      );

      renderWithProviders(
        <Layout>
          <InterviewPage params={{ interviewId: "1" }} />
        </Layout>
      );

      await waitFor(() => {
        expect(
          screen.getByText("안녕하세요. 간단히 자기소개 부탁드립니다.")
        ).toBeInTheDocument();
      });

      server.use(
        http.post(`${baseURL}/interview/1/contents/answer`, () => {
          return Response.json({ content: null });
        })
      );

      const integrationSetup = createIntegrationRecordingSetup();
      integrationSetup.setupRequestAnimationFrame();

      await integrationSetup.triggerRecording();

      act(() => {
        integrationSetup.simulateRecordingFlow();
      });

      integrationSetup.cleanup();

      await waitFor(
        () => {
          expect(screen.getByText("다시 시도하기")).toBeInTheDocument();
          expect(screen.getByText("취소하기")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("채팅 제한 처리", () => {
    it("채팅이 제한 횟수에 도달하면 결과 페이지로 이동하는 버튼이 생성된다.", async () => {
      const preloadedState = {
        chat: {
          interviewId: 1,
          contents: Array(20).fill({
            status: ChatContentStatusType.success,
            speaker: ChatContentSpeakerType.user,
            content: "test",
            timeStamp: new Date(),
          }),
          trySpeechCount: 0,
        },
      };

      renderWithProviders(
        <Layout>
          <InterviewPage params={{ interviewId: "1" }} />
        </Layout>,
        {
          preloadedState,
        }
      );

      await waitFor(() => {
        expect(screen.getByText("결과 보기")).toBeInTheDocument();
      });
    });
  });
});
