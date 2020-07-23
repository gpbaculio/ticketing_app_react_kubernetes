import Axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // /api/users/currentuser
    return Axios.create({
      baseURL: 'http:ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  }
  return Axios.create({
    baseURL: '/',
  });
};
