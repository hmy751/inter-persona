export const baseURL = process.env.NEXT_PUBLIC_API_HOST;

export const get = async <Result>({
  path,
  headers,
  body,
  externalUrl,
}: {
  path?: string;
  headers?: Record<string, string>;
  body?: object;
  externalUrl?: string;
}) => {
  try {
    let url;

    if (externalUrl) {
      url = externalUrl;
    } else {
      url = `${baseURL}/${path}`;
    }

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    };

    const result = await fetch(url, options);
    const data: Result = await result.json();

    if (!result.ok) {
      throw Error("Http Error");
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const post = async <Result>({
  path,
  headers,
  body,
  externalUrl,
}: {
  path?: string;
  headers?: Record<string, string>;
  body?: object;
  externalUrl?: string;
}) => {
  try {
    let url;

    if (externalUrl) {
      url = externalUrl;
    } else {
      url = `${baseURL}/${path}`;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    };

    const result = await fetch(url, options);
    const data: Result = await result.json();

    if (!result.ok) {
      throw Error("Http Error");
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};
