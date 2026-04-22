export const generateCurl = ({ method, url, headers, body }) => {
  let curl = `curl -X ${method} "${url}"`;

  // headers
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      curl += ` \\\n  -H "${key}: ${value}"`;
    });
  }

  // body
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    curl += ` \\\n  -d '${JSON.stringify(body)}'`;
  }

  return curl;
};