import mongoose from 'mongoose'

const AccessTokenSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectID,
    required: true,
    ref: 'User'
  },
  jwt_token: {
    type: String,
    required: true
  },
  expired_at: {
    type: Number,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const AccessTokenModel = mongoose.model('AccessToken', AccessTokenSchema)

const find = async (query) => {
  return AccessTokenModel.find(query)
}

const findById = async (id) => {
  return AccessTokenModel.findById(id)
}

const findByToken = async (token) => {
  return AccessTokenModel.findOne({ jwt_token: token }).populate('user')
}

const create = async (data) => {
  const newDocument = new AccessTokenModel(data)
  return newDocument.save()
}

const update = async (id, data) => {
  return AccessTokenModel.findByIdAndUpdate(id, { $set: data }, { new: true })
}

const updateExpireAt = async (token, expireAt) => {
  return AccessTokenModel.updateOne({ jwt_token: token }, { $set: { expired_at: expireAt } }, { new: true })
}

const deleteById = async (id) => {
  return AccessTokenModel.findByIdAndDelete(id)
}

const repository = {
  find,
  findById,
  findByToken,
  create,
  update,
  updateExpireAt,
  deleteById
}

export default repository
