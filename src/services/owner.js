import { api } from './api';

const getOwnerData = () => {
  const token = localStorage.getItem('token');

  return api
    .get('/proprietario', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => res)
    .catch((err) => err);
};

const updateDependent = (dependentId, status) => {
  const token = localStorage.getItem('token');
  return api
    .put(
      `/dependente/${dependentId}?status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => res)
    .catch((err) => err);
};

const updateOwner = (data) => {
  const token = localStorage.getItem('token');

  return api
    .put(
      `/proprietario/`,
      { ...data },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => res)
    .catch((err) => err);
};

export { getOwnerData, updateDependent, updateOwner };
