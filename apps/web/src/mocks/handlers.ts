import { http, HttpResponse, RequestHandler } from "msw";

import { baseURL } from "@/apis";

const userHandler: RequestHandler[] = [
  http.post(`${baseURL}/login`, ({ params }) => {
    const { name, developmentCategory } = params;
    return HttpResponse.json({
      id: 1,
      name,
      imageSrc: "/assets/images/dev_profile.png",
    });
  }),
];

const handlers: RequestHandler[] = [...userHandler];

export default handlers;
