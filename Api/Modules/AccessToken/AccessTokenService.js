import Repository from "./AccessTokenRepository";

const create = async data => {
  if (!data || !data.user || !data.jwt_token || !data.expired_at) {
    throw new Error("Missing input");
  }

  return Repository.create(data);
};
const service = {
  create
};

export default service;
