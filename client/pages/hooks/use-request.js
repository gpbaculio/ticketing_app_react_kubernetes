import axios from 'axios';
import React, { useState } from 'react';

const useRequest = ({
  url,
  method,
  body,
  onSuccess,
}) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async () => {
    try {
      // take care if previous result
      setErrors(null);
      const { data } = await axios[method](url, body);
      if (onSuccess) onSuccess();
      return data;
    } catch (error) {
      setErrors(
        <div className="alet alert-danger">
          <h5>The following errors occured</h5>
          <ul className="my-0">
            {error.response.data.errors.map((e) => (
              <li key={e.message}>{e.message}</li>
            ))}
          </ul>
        </div>,
      );
      return null;
    }
  };
  return { doRequest, errors };
};

export default useRequest;
