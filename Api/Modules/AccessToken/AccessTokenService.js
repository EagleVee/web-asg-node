import Repository from "./AccessTokenRepository";

const create = async data => {
  if (!data || !data.user || !data.jwtToken || !data.expiredAt) {
    throw new Error("Missing input");
  }

  return Repository.create(data);
};
const service = {
  create
};

export default service;
