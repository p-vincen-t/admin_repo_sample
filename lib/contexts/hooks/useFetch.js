import React from 'react'
import request, { REQUEST_SUCCESS, REQUEST_FAILED } from "common/fetch";

const useFetch = (url, options) => {
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    request(url, options, undefined, (status, data) => {
      if (status === REQUEST_SUCCESS) setResponse(data)
      else if(status === REQUEST_FAILED) setError(data)
    })
  }, []);
  return { response, error };
};

export default useFetch
