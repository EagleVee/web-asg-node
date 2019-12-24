import Repository from "./AccessTokenRepository";
import ErrorHelper from "../../../Common/ErrorHelper";

const create = async data => {
  if (!data || !data.user || !data.jwtToken || !data.expireAt) {
    ErrorHelper.missingInput();
  }

  return Repository.create(data);
};
const service = {
  create
};

export default service;
